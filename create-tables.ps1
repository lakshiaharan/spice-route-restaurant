# ================================================
# Create DynamoDB tables for bookings and orders using AWS CLI (PowerShell)
# Run: .\create-tables.ps1
# ================================================

$ErrorActionPreference = "Stop"
$REGION = "ap-south-1"

Write-Host ">>> Creating RestaurantBookings table"
aws dynamodb create-table `
  --table-name RestaurantBookings `
  --attribute-definitions AttributeName=bookingId,AttributeType=S `
  --key-schema AttributeName=bookingId,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST `
  --region "$REGION"

Write-Host ">>> Creating RestaurantOrders table"
aws dynamodb create-table `
  --table-name RestaurantOrders `
  --attribute-definitions AttributeName=orderId,AttributeType=S `
  --key-schema AttributeName=orderId,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST `
  --region "$REGION"

Write-Host ">>> Waiting for tables to become active..."
aws dynamodb wait table-exists --table-name RestaurantBookings --region "$REGION"
aws dynamodb wait table-exists --table-name RestaurantOrders --region "$REGION"

Write-Host ">>> Tables created successfully." -ForegroundColor Green
aws dynamodb list-tables --region "$REGION"
