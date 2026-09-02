# ================================================
# Deploy static restaurant site to S3 using AWS CLI (PowerShell)
# Run: .\deploy-s3.ps1
# ================================================

$ErrorActionPreference = "Stop"

$BUCKET_NAME = "spice-route-restaurant-site"  # Note: S3 bucket names must be globally unique
$REGION = "ap-south-1"

Write-Host ">>> Creating S3 bucket: $BUCKET_NAME"
aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" --create-bucket-configuration LocationConstraint="$REGION"

Write-Host ">>> Disabling Block Public Access (needed for static site hosting)"
aws s3api put-public-access-block --bucket "$BUCKET_NAME" --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false

Write-Host ">>> Enabling static website hosting"
aws s3 website "s3://$BUCKET_NAME/" --index-document index.html --error-document index.html

Write-Host ">>> Applying public-read bucket policy"
$policy = @"
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
"@

$policy | Out-File -FilePath "bucket-policy.json" -Encoding ascii
aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file://bucket-policy.json

Write-Host ">>> Uploading site files"
aws s3 sync ./site "s3://$BUCKET_NAME" --delete

Write-Host ">>> Deployment complete!" -ForegroundColor Green
Write-Host "Website URL: http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com" -ForegroundColor Cyan
