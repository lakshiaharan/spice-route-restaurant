import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Uses default AWS credential chain (env vars / IAM role / ~/.aws/credentials)
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1"
});

export const ddb = DynamoDBDocumentClient.from(client);

export const TABLES = {
  BOOKINGS: process.env.BOOKINGS_TABLE || "RestaurantBookings",
  ORDERS: process.env.ORDERS_TABLE || "RestaurantOrders"
};
