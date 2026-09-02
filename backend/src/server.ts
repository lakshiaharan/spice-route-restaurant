import express from "express";
import cors from "cors";
import bookingsRouter from "./routes/bookings";
import ordersRouter from "./routes/orders";
import analyticsRouter, { telemetryMiddleware } from "./routes/analytics";
import aiRouter from "./routes/ai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(telemetryMiddleware);

app.get("/", (_req, res) => {
  res.json({
    status: "SpiceRoute CloudOps Backend Running",
    cloudProvider: "AWS",
    compute: "EC2 (t2.micro)",
    database: "Amazon DynamoDB",
    version: "2.0.0-enterprise",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "UP",
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
    cloudEnvironment: {
      provider: "AWS",
      region: process.env.AWS_REGION || "ap-south-1",
      compute: "Amazon EC2",
      database: "Amazon DynamoDB"
    },
    services: {
      api: "ONLINE",
      dynamodb: "CONNECTED",
      aiSommelier: "READY",
      kdsStateEngine: "ACTIVE"
    },
    timestamp: new Date().toISOString()
  });
});

app.get("/healthz", (_req, res) => res.status(200).send("OK"));

app.use("/bookings", bookingsRouter);
app.use("/orders", ordersRouter);
app.use("/analytics", analyticsRouter);
app.use("/ai", aiRouter);

app.listen(PORT, () => {
  console.log(`SpiceRoute Enterprise Cloud Backend listening on port ${PORT}`);
});
