#!/bin/bash
# =========================================================================
# Deploy Amazon CloudFront Global CDN in front of S3 Static Site
# Run: ./deploy-cloudfront.sh
# =========================================================================

set -e

BUCKET_NAME="spice-route-restaurant-lakshi-2026"
REGION="ap-south-1"
ORIGIN_DOMAIN="${BUCKET_NAME}.s3-website.${REGION}.amazonaws.com"
CALLER_REF="spiceroute-$(date +%s)"

echo "========================================================="
echo "  Amazon CloudFront CDN Distribution Provisioner"
echo "========================================================="
echo "S3 Origin Domain: ${ORIGIN_DOMAIN}"

cat <<EOF > cloudfront-config.json
{
  "CallerReference": "${CALLER_REF}",
  "Comment": "Spice Route Global Edge CDN (S3 Static Website)",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-Website-Origin",
        "DomainName": "${ORIGIN_DOMAIN}",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-Website-Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "Enabled": true
}
EOF

echo ">>> Creating CloudFront Distribution via AWS CLI..."
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json

echo "========================================================="
echo ">>> CloudFront Distribution provisioning in progress!"
echo "Check your AWS Console under CloudFront Distributions."
echo "========================================================="