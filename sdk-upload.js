// ================================================
// Uploads site files to S3 using AWS SDK v3 (not CLI).
// Run: node sdk-upload.js
// Screenshot the console output to show SDK usage.
// Requires: npm install @aws-sdk/client-s3
// ================================================

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const BUCKET_NAME = "spice-route-restaurant-site"; // same bucket as deploy-s3.sh
const REGION = "ap-south-1";
const SITE_DIR = path.join(__dirname, "site");

const s3 = new S3Client({ region: REGION });

const CONTENT_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript"
};

async function uploadFile(fileName) {
  const filePath = path.join(SITE_DIR, fileName);
  const fileContent = fs.readFileSync(filePath);
  const ext = path.extname(fileName);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: CONTENT_TYPES[ext] || "application/octet-stream"
  });

  await s3.send(command);
  console.log(`Uploaded: ${fileName}`);
}

async function main() {
  const files = fs.readdirSync(SITE_DIR);
  console.log(`Uploading ${files.length} files to bucket "${BUCKET_NAME}"...`);

  for (const file of files) {
    await uploadFile(file);
  }

  console.log("All files uploaded successfully via AWS SDK.");
  console.log(`Website URL: http://${BUCKET_NAME}.s3-website.${REGION}.amazonaws.com`);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
