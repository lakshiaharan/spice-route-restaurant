import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PutCommand, ScanCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "../db";

const router = Router();

export type OrderStatus = "ORDER_PLACED" | "KITCHEN_ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED";

export interface StatusTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  orderId: string;
  name: string;
  phone: string;
  items: string;
  address: string;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
  timeline: StatusTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

// POST /orders - place a new food order
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, phone, items, address } = req.body;

    if (!name || !phone || !items || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    const order: Order = {
      orderId,
      name,
      phone,
      items,
      address,
      status: "ORDER_PLACED",
      estimatedDeliveryMinutes: 35,
      timeline: [
        {
          status: "ORDER_PLACED",
          timestamp: now,
          note: "Order received and queued for kitchen confirmation."
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLES.ORDERS,
        Item: order
      })
    );

    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

// GET /orders - list all orders (for Kitchen / Admin KDS)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: TABLES.ORDERS }));
    const orders = (result.Items || []) as Order[];
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /orders/:id/track - live order tracking for customer
router.get("/:id/track", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ddb.send(
      new GetCommand({
        TableName: TABLES.ORDERS,
        Key: { orderId: id }
      })
    );

    if (!result.Item) {
      return res.status(404).json({ error: "Order not found with ID: " + id });
    }

    return res.json(result.Item);
  } catch (err) {
    console.error("Error tracking order:", err);
    return res.status(500).json({ error: "Failed to track order" });
  }
});

// PATCH /orders/:id/status - update status from Kitchen KDS
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses: OrderStatus[] = [
      "ORDER_PLACED",
      "KITCHEN_ACCEPTED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status transition" });
    }

    const current = await ddb.send(
      new GetCommand({
        TableName: TABLES.ORDERS,
        Key: { orderId: id }
      })
    );

    if (!current.Item) {
      return res.status(404).json({ error: "Order not found" });
    }

    const now = new Date().toISOString();
    const existingTimeline = current.Item.timeline || [];
    const newTimeline: StatusTimelineEvent[] = [
      ...existingTimeline,
      {
        status,
        timestamp: now,
        note: note || `Order status updated to ${status}`
      }
    ];

    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.ORDERS,
        Key: { orderId: id },
        UpdateExpression: "set #st = :status, timeline = :timeline, updatedAt = :updatedAt",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":status": status,
          ":timeline": newTimeline,
          ":updatedAt": now
        }
      })
    );

    return res.json({
      message: "Order status updated",
      orderId: id,
      newStatus: status,
      timeline: newTimeline
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
