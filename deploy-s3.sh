#!/bin/bash
# ================================================
# Deploy static restaurant site to S3 using AWS CLI
# Run this from the project root.
# Take a screenshot of this script running successfully
# to show CLI usage for your submission.
# ================================================

set -e

BUCKET_NAME="spice-route-restaurant-site"   # must be globally unique - change if taken
REGION="ap-south-1"

echo ">>> Creating S3 bucket: $BUCKET_NAME"
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION" \
  --create-bucket-configuration LocationConstraint="$REGION"

echo ">>> Disabling Block Public Access (needed for static site hosting)"
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false

echo ">>> Enabling static website hosting"
aws s3 website "s3://$BUCKET_NAME/" \
  --index-document index.html \
  --error-document index.html

echo ">>> Applying public-read bucket policy"
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy file://bucket-policy.json

echo ">>> Uploading site files"
aws s3 sync ./site "s3://$BUCKET_NAME" --delete

echo ">>> Deployment complete!"
echo "Website URL: http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com"
