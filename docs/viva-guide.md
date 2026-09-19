# 🎓 Architecture & Evaluation Guide

This document contains architectural decisions and technical deep-dives for project evaluation and system design discussions.

---

### Technical Design Decisions

#### 1. Why DynamoDB over MySQL / PostgreSQL?
- **Predictable Latency:** DynamoDB delivers single-digit millisecond response times under peak order ingestion without relational locking bottlenecks.
- **On-Demand Capacity:** The system automatically scales compute and read/write capacity without requiring manual provisioned IOPS management or database maintenance windows.
- **Access Patterns:** All key lookups in Spice Route (`orderId`, `bookingId`) are key-value lookups ideal for single-table partition key lookups.

#### 2. Why Decouple Static Frontend from Compute?
- **Zero Static Contention:** Offloading HTML, CSS, JavaScript, and high-resolution food assets to **Amazon S3** ensures that client asset downloads consume 0% of EC2 CPU cycles.
- **Edge Acceleration:** Serving assets through global CDNs (Vercel Edge / CloudFront) brings caching closer to end-users with global TLS termination.

#### 3. How is Credential Security Enforced?
- **IAM Instance Profiles:** The EC2 instance retrieves temporary rotating credentials from the AWS Instance Metadata Service (IMDSv2). No long-lived access keys (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) are committed to source control or stored in `.env` files.

#### 4. Role of Amazon SNS in Event-Driven Messaging
- **Asynchronous Decoupling:** Placing table reservations or updating order status triggers background SNS notification events (`SpiceRoute-Alerts`). This guarantees that external SMS or email dispatch latencies do not block client HTTP responses.

#### 5. SRE Telemetry & CloudWatch Alarms
- **Custom Business Telemetry:** Custom metrics (`ApiLatency`, `NewOrder`, `NewBooking`, `KdsTransition`) are emitted to the `SpiceRoute/CloudOps` namespace.
- **Proactive Mitigation:** CloudWatch Alarms are configured on EC2 CPU utilization (`>= 80%`) and API latencies to notify operators before degradation impacts users.