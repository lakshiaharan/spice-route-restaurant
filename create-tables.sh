#!/bin/bash
# ================================================
# Create DynamoDB tables for bookings and orders using AWS CLI
# Screenshot this running to show CLI usage for backend data layer.
# ================================================

set -e
REGION="ap-south-1"

echo ">>> Creating RestaurantBookings table"
aws dynamodb create-table \
  --table-name RestaurantBookings \
  --attribute-definitions AttributeName=bookingId,AttributeType=S \
  --key-schema AttributeName=bookingId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION"

echo ">>> Creating RestaurantOrders table"
aws dynamodb create-table \
  --table-name RestaurantOrders \
  --attribute-definitions AttributeName=orderId,AttributeType=S \
  --key-schema AttributeName=orderId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION"

echo ">>> Waiting for tables to become active..."
aws dynamodb wait table-exists --table-name RestaurantBookings --region "$REGION"
aws dynamodb wait table-exists --table-name RestaurantOrders --region "$REGION"

echo ">>> Tables created successfully."
aws dynamodb list-tables --region "$REGION"
