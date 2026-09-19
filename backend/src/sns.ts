import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const REGION = process.env.AWS_REGION || "ap-south-1";
const snsClient = new SNSClient({ region: REGION });

const BOOKING_TOPIC_ARN = process.env.SNS_BOOKING_TOPIC_ARN || process.env.SNS_TOPIC_ARN || "";
const ORDER_TOPIC_ARN = process.env.SNS_ORDER_TOPIC_ARN || process.env.SNS_TOPIC_ARN || "";

export interface BookingNotificationPayload {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}

export interface OrderNotificationPayload {
  orderId: string;
  name: string;
  phone: string;
  items: string;
  address: string;
  status: string;
}

/**
 * Publishes Table Booking Confirmation to Amazon SNS
 */
export async function publishBookingConfirmation(payload: BookingNotificationPayload): Promise<{ sent: boolean; messageId?: string }> {
  const subject = `Table Booking Confirmed: ${payload.bookingId} - ${payload.name}`;
  const message = [
    `🌿 SPICE ROUTE RESTAURANT — TABLE RESERVATION CONFIRMED 🌿`,
    `--------------------------------------------------`,
    `Booking ID  : ${payload.bookingId}`,
    `Guest Name  : ${payload.name}`,
    `Contact     : ${payload.phone} (${payload.email})`,
    `Date & Time : ${payload.date} at ${payload.time}`,
    `Party Size  : ${payload.guests} Guests`,
    `Status      : Confirmed (Table Reserved)`,
    `--------------------------------------------------`,
    `We look forward to serving you authentic, pure-vegetarian delicacies!`
  ].join("\n");

  if (!BOOKING_TOPIC_ARN) {
    console.log(`[AWS SNS MOCK] Booking alert logged (Topic ARN not set):\n${message}`);
    return { sent: true, messageId: `mock-msg-${Date.now()}` };
  }

  try {
    const cmd = new PublishCommand({
      TopicArn: BOOKING_TOPIC_ARN,
      Subject: subject,
      Message: message
    });
    const res = await snsClient.send(cmd);
    console.log(`[AWS SNS] Booking notification published successfully. MessageId: ${res.MessageId}`);
    return { sent: true, messageId: res.MessageId };
  } catch (err: any) {
    console.warn(`[AWS SNS] Notice: Could not deliver SNS message (${err.message}). Continuing normally.`);
    return { sent: false };
  }
}

/**
 * Publishes Live Food Order Alert to Amazon SNS
 */
export async function publishOrderAlert(payload: OrderNotificationPayload): Promise<{ sent: boolean; messageId?: string }> {
  const subject = `New Order Placed: ${payload.orderId} - ${payload.name}`;
  const message = [
    `🍽️ SPICE ROUTE KITCHEN — NEW ORDER DISPATCH 🍽️`,
    `--------------------------------------------------`,
    `Order Number : ${payload.orderId}`,
    `Customer     : ${payload.name} (${payload.phone})`,
    `Items        : ${payload.items}`,
    `Delivery To  : ${payload.address}`,
    `Initial State: ${payload.status}`,
    `--------------------------------------------------`,
    `Order queued in Live KDS for immediate kitchen preparation.`
  ].join("\n");

  if (!ORDER_TOPIC_ARN) {
    console.log(`[AWS SNS MOCK] Order alert logged (Topic ARN not set):\n${message}`);
    return { sent: true, messageId: `mock-msg-${Date.now()}` };
  }

  try {
    const cmd = new PublishCommand({
      TopicArn: ORDER_TOPIC_ARN,
      Subject: subject,
      Message: message
    });
    const res = await snsClient.send(cmd);
    console.log(`[AWS SNS] Order notification published successfully. MessageId: ${res.MessageId}`);
    return { sent: true, messageId: res.MessageId };
  } catch (err: any) {
    console.warn(`[AWS SNS] Notice: Could not deliver SNS message (${err.message}). Continuing normally.`);
    return { sent: false };
  }
}

/**
 * Publishes Delivery Dispatch Alert when order moves to OUT_FOR_DELIVERY
 */
export async function publishDeliveryDispatch(orderId: string, customerName: string, customerPhone: string, driverName = "Vikram S."): Promise<void> {
  const message = `🚚 Spice Route Update: Order #${orderId} is OUT FOR DELIVERY with Driver ${driverName} (Contact: +91 98860 11223). Fresh vegetarian meal arriving shortly!`;

  if (!ORDER_TOPIC_ARN) {
    console.log(`[AWS SNS MOCK] Delivery dispatch SMS logged:\n${message}`);
    return;
  }

  try {
    await snsClient.send(
      new PublishCommand({
        TopicArn: ORDER_TOPIC_ARN,
        Subject: `Delivery Alert: #${orderId} En Route`,
        Message: message
      })
    );
  } catch (err: any) {
    console.warn(`[AWS SNS] Delivery dispatch alert notice: ${err.message}`);
  }
}