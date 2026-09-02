import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "../db";

const router = Router();

interface Booking {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  createdAt: string;
}

// POST /bookings - create a new table booking
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, date, time, guests } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking: Booking = {
      bookingId: uuidv4(),
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      createdAt: new Date().toISOString()
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLES.BOOKINGS,
        Item: booking
      })
    );

    return res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({ error: "Failed to create booking" });
  }
});

// GET /bookings - list all bookings (for admin/testing)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: TABLES.BOOKINGS }));
    return res.json(result.Items || []);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;
