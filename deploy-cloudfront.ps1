# =========================================================================
# Deploy Amazon CloudFront Global CDN in front of S3 Static Site
# Run: .\deploy-cloudfront.ps1
# =========================================================================

$ErrorActionPreference = "Stop"

$BUCKET_NAME = "spice-route-restaurant-lakshi-2026"
$REGION = "ap-south-1"
$ORIGIN_DOMAIN = "$BUCKET_NAME.s3-website.$REGION.amazonaws.com"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  Amazon CloudFront CDN Distribution Provisioner" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "S3 Origin Domain: $ORIGIN_DOMAIN"

# Generate CloudFront Distribution Config
$callerRef = "spiceroute-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$cfConfig = @"
{
  "CallerReference": "$callerRef",
  "Comment": "Spice Route Global Edge CDN (S3 Static Website)",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-Website-Origin",
        "DomainName": "$ORIGIN_DOMAIN",
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
"@

$cfConfig | Out-File -FilePath "cloudfront-config.json" -Encoding ascii

Write-Host ">>> Creating CloudFront Distribution via AWS CLI..."
$result = aws cloudfront create-distribution --distribution-config file://cloudfront-config.json | ConvertFrom-Json

$distId = $result.Distribution.Id
$distDomain = $result.Distribution.DomainName

Write-Host ""
Write-Host ">>> CloudFront Distribution Created Successfully!" -ForegroundColor Green
Write-Host "Distribution ID : $distId" -ForegroundColor Yellow
Write-Host "CloudFront HTTPS URL : https://$distDomain" -ForegroundColor Green
Write-Host "Global Edge Locations : 400+ PoPs worldwide with automatic TLS & DDoS Shield"
Write-Host "=========================================================" -ForegroundColor Cyan