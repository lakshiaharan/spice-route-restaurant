// ================================================
// Uploads site files to S3 using AWS SDK v3 (not CLI).
// Run: node sdk-upload.js
// Screenshot the console output to show SDK usage.
// Requires: npm install @aws-sdk/client-s3
// ================================================

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const BUCKET_NAME = "spice-route-restaurant-lakshi-2026";
const REGION = "ap-south-1";
const SITE_DIR = path.join(__dirname, "site");

const s3 = new S3Client({ region: REGION });

const CONTENT_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

async function uploadFile(absoluteFilePath) {
  const relativeKey = path.relative(SITE_DIR, absoluteFilePath).replace(/\\/g, "/");
  const fileContent = fs.readFileSync(absoluteFilePath);
  const ext = path.extname(absoluteFilePath).toLowerCase();

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: relativeKey,
    Body: fileContent,
    ContentType: CONTENT_TYPES[ext] || "application/octet-stream"
  });

  await s3.send(command);
  console.log(`Uploaded: ${relativeKey}`);
}

async function main() {
  const allFiles = getAllFiles(SITE_DIR);
  console.log(`Uploading ${allFiles.length} files to S3 bucket "${BUCKET_NAME}" (${REGION})...`);

  for (const filePath of allFiles) {
    await uploadFile(filePath);
  }

  console.log("All files uploaded successfully via AWS SDK v3.");
  console.log(`Website URL: http://${BUCKET_NAME}.s3-website.${REGION}.amazonaws.com`);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});