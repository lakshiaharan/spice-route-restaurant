<div align="center">

# 🌿 Spice Route
### Cloud-Native Restaurant Platform & Dietary Rule Engine

[![CI Suite](https://github.com/lakshiaharan/spice-route-restaurant/actions/workflows/ci.yml/badge.svg)](https://github.com/lakshiaharan/spice-route-restaurant/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![AWS Cloud](https://img.shields.io/badge/AWS-S3%20%7C%20EC2%20%7C%20DynamoDB%20%7C%20SNS%20%7C%20CloudWatch-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![DynamoDB](https://img.shields.io/badge/Amazon-DynamoDB_NoSQL-4053D6?logo=amazondynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)

<p align="center">
  A decoupled multi-tier cloud prototype engineered on Amazon Web Services (AWS) featuring a TypeScript Express API on EC2, DynamoDB NoSQL persistence, asynchronous Amazon SNS notifications, CloudWatch telemetry, S3 static hosting, and a deterministic dietary rule engine.
</p>

[🌐 Live Web Demo](https://spice-route-restaurant-flame.vercel.app/) • [🪣 AWS S3 Endpoint](http://spice-route-restaurant-lakshi-2026.s3-website.ap-south-1.amazonaws.com/) • [📖 System Architecture](#-system-architecture) • [⚡ Quickstart](#-getting-started) • [🎓 Architecture Notes](docs/viva-guide.md)

</div>

---

## 📑 Table of Contents
- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [AWS Cloud Infrastructure](#-aws-cloud-infrastructure)
- [Core Platform Modules](#-core-platform-modules)
  - [1. Dietary & Nutritional Rule Engine](#1-dietary--nutritional-rule-engine)
  - [2. Kitchen Display System (KDS Kanban)](#2-kitchen-display-system-kds-kanban)
  - [3. Asynchronous Messaging (Amazon SNS)](#3-asynchronous-messaging-amazon-sns)
  - [4. Observability & Telemetry (Amazon CloudWatch)](#4-observability--telemetry-amazon-cloudwatch)
- [Security & Network Configuration](#-security--network-configuration)
- [REST API Specification](#-rest-api-specification)
- [Automated Testing & CI/CD](#-automated-testing--cicd)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 📖 Overview

**Spice Route** demonstrates a decoupled multi-tier architecture designed to separate static presentation assets from transactional business compute and persistence.

### Key Engineering Features:
- **Tier Decoupling**: Static assets (HTML, CSS, JS, images) are served via **Amazon S3** and **Vercel Edge**, offloading web traffic from the compute layer.
- **Stateless Compute**: **TypeScript / Express REST API** running on **Amazon EC2 (t2.micro / Ubuntu Linux)**, daemonized with **PM2** process management.
- **Serverless NoSQL Storage**: **Amazon DynamoDB** with On-Demand capacity handling table reservations (`RestaurantBookings`) and food orders (`RestaurantOrders`).
- **Event-Driven Messaging**: **Amazon SNS** background notification bus delivering structured JSON email/SMS alerts upon booking confirmations and order dispatch.
- **Cloud Observability**: Custom metrics (`SpiceRoute/CloudOps`) streamed to **Amazon CloudWatch** with automated CPU threshold alarms.
- **Role-Based Security**: Credentials managed through **AWS IAM Instance Profiles** with zero hardcoded API keys.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer ["1. Client & Application Layer"]
        CustomerApp["📱 Customer Web Ordering Interface"]
        KDSApp["🍳 Kitchen Display System (KDS Terminal)"]
        OpsDashboard["📊 CloudOps Telemetry & Load Tester"]
    end

    subgraph CDNLayer ["2. Web Distribution & Storage Tier"]
        VercelEdge["🌐 Vercel Edge Network\n(HTTPS SSL & Anycast Routing)"]
        S3Bucket["🪣 Amazon S3 Static Hosting\n(Bucket: spice-route-restaurant-lakshi-2026)"]
    end

    subgraph ComputeLayer ["3. Application Compute Layer (AWS EC2)"]
        EC2Instance["🖥️ AWS EC2 t2.micro (Ubuntu 24.04 LTS)\nRegion: ap-south-1 (Mumbai)"]
        PM2Process["⚙️ PM2 Process Supervisor\n(Auto-Restart & Daemon Clustering)"]
        ExpressAPI["🚀 TypeScript Express REST API\n(Port 3000)"]
        
        EC2Instance --- PM2Process
        PM2Process --> ExpressAPI
    end

    subgraph DatabaseLayer ["4. Managed Persistence Layer (AWS DynamoDB)"]
        DDBOrders[("🗄️ Amazon DynamoDB: RestaurantOrders\nPartition Key: orderId (String)")]
        DDBBookings[("🗄️ Amazon DynamoDB: RestaurantBookings\nPartition Key: bookingId (String)")]
    end

    subgraph MessagingLayer ["5. Messaging & Event Bus (Amazon SNS)"]
        SNSTopic["📢 Amazon SNS: SpiceRoute-Alerts\n(Pub/Sub SMS & Email Dispatch)"]
    end

    subgraph MonitoringLayer ["6. Observability & SRE (Amazon CloudWatch)"]
        CloudWatchEngine["📈 Amazon CloudWatch Metrics & Alarms\n(Namespace: SpiceRoute/CloudOps)"]
    end

    subgraph SecurityLayer ["7. Security & Identity (AWS IAM)"]
        IAMRole["🔐 AWS IAM Instance Profile\n(Zero Hardcoded Credentials)"]
    end

    CustomerApp -->|HTTPS / Edge| VercelEdge
    CustomerApp -->|HTTP Static Assets| S3Bucket
    CustomerApp -->|REST API Calls| ExpressAPI
    KDSApp -->|State Machine Sync| ExpressAPI
    OpsDashboard -->|Live Telemetry Probes| ExpressAPI

    ExpressAPI --- IAMRole
    IAMRole -->|Authorized Read/Write| DDBOrders
    IAMRole -->|Authorized Read/Write| DDBBookings
    ExpressAPI -->|Publish Events| SNSTopic
    ExpressAPI -->|Emit Telemetry| CloudWatchEngine
```

---

## ☁️ AWS Cloud Infrastructure

| AWS Cloud Service | Architecture Role | Configuration Details | Scalability Mode |
| :--- | :--- | :--- | :--- |
| **Amazon S3** | Static Website Hosting | Public static website hosting bucket in `ap-south-1` | Serverless Managed Storage |
| **Amazon EC2** | Stateless API Compute | `t2.micro` (1 vCPU, 1 GB RAM), Ubuntu Linux, Node.js 20 LTS, PM2 | Single Instance Prototype |
| **Amazon DynamoDB** | NoSQL Storage Tier | Tables: `RestaurantOrders` (`orderId`), `RestaurantBookings` (`bookingId`) | On-Demand Auto-Scaling |
| **Amazon SNS** | Pub/Sub Messaging | Standard Topic: `SpiceRoute-Alerts` (Email-JSON & SMS subscriptions) | Managed Event Bus |
| **Amazon CloudWatch** | Observability & Metrics | Namespace: `SpiceRoute/CloudOps`, CPU Alarm (`>= 80%`) | Metric Streams & Alarms |
| **AWS IAM** | Identity & Security | Scoped EC2 Instance Profile policies for DynamoDB and SNS | Role-Based Access Control |
| **AWS VPC & Sec Groups** | Network Isolation | SSH restricted to admin IP (`<YOUR_IP>/32`), API exposed via HTTPS | Layer 4 Stateful Firewall |

---

## 🎯 Core Platform Modules

### 1. Dietary & Nutritional Rule Engine
- **Deterministic Multi-Variable Evaluation**: Evaluates 21 curated signature vegetarian dishes for calories, protein, carbs, and fats.
- **Standardized High-Protein (≥10g)**: Accurately filters and ranks the top 6 protein-rich items (Paneer Tikka 18g, Paneer Butter Masala 17g, Palak Paneer 16g, Dal Makhani 14g, Yellow Dal Tadka 12g, Shahi Malai Kofta 11g).
- **Calorie Budget Boundary**: Dynamic boundary filter (50 kcal to 500 kcal).
- **Allergen Verification**: Strict zero-leakage exclusion for `100% Vegan`, `Gluten-Free`, `Nut-Free`, `Diabetic-Friendly`, and `Jain-Friendly`.

### 2. Kitchen Display System (KDS Kanban)
- **4-Stage State Machine**: `📥 Order Placed` ➔ `👨‍🍳 In Preparation` ➔ `🚚 Out for Delivery` ➔ `✅ Delivered & Completed`.
- **Driver Dispatch Integration**: Moving tickets to *Out for Delivery* assigns driver details and triggers an automated dispatch alert via Amazon SNS.

### 3. Asynchronous Messaging (Amazon SNS)
- Decouples notification dispatch from HTTP request-response cycles.
- Publishes structured JSON payloads to topic `SpiceRoute-Alerts` for table reservations and delivery dispatches.

### 4. Observability & Telemetry (Amazon CloudWatch)
- Custom metric dispatcher tracking `ApiLatency`, `NewBooking`, `NewOrder`, and `KdsTransition`.
- Benchmarked under simulated concurrent client loads (25–50 virtual users).

---

## 🔒 Security & Network Configuration

- **IAM Instance Profiles**: The backend on EC2 assumes an IAM role at runtime, retrieving short-lived credentials via IMDSv2. No secrets are stored in code or repository files.
- **Security Group Rules**:
  - **SSH (Port 22)**: Restricted to administrator IP (`<YOUR_ADMIN_IP>/32`).
  - **HTTPS (Port 443)**: Public inbound for secure web and API proxy traffic.
  - **HTTP (Port 80)**: Redirects to HTTPS.
  - **Internal API (Port 3000)**: Bound to `127.0.0.1` behind reverse proxy / HTTPS termination.
- **Mixed Content Mitigation**: Frontend dynamically resolves API URLs, routing through HTTPS reverse-proxy rewrites (`/api/*`) to prevent browser mixed-content blocking.

---

## 📡 REST API Specification

### `GET /health`
Returns live system health, process uptime, memory utilization, and cloud environment metadata.
```json
{
  "status": "UP",
  "uptimeSeconds": 516420,
  "memoryUsageMB": "44.20",
  "cloudEnvironment": {
    "provider": "AWS",
    "region": "ap-south-1",
    "compute": "Amazon EC2",
    "database": "Amazon DynamoDB",
    "notifications": "Amazon SNS",
    "observability": "Amazon CloudWatch"
  },
  "services": {
    "api": "ONLINE",
    "dynamodb": "CONNECTED",
    "snsNotifications": "ACTIVE (Pub/Sub Event Bus)",
    "cloudwatchMetrics": "STREAMING (Namespace: SpiceRoute/CloudOps)"
  }
}
```

### `POST /orders`
Creates a customer order, persists to DynamoDB, and dispatches an Amazon SNS notification.
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Sharma",
    "phone": "+91 98765 43210",
    "items": "Paneer Tikka (₹220), Veg Biryani (₹250)",
    "address": "Flat 302, Palm Heights, MG Road"
  }'
```

### `POST /bookings`
Persists a table reservation in DynamoDB and triggers an instant confirmation alert.
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ramesh Gupta",
    "email": "ramesh@example.com",
    "phone": "+91 98450 11223",
    "date": "2026-09-25",
    "time": "20:00",
    "guests": 4
  }'
```

---

## 🧪 Automated Testing & CI/CD

The repository includes a decoupled testing architecture executed via **GitHub Actions**:

- **Unit Test Suite (`backend/test/unit.test.js`)**: Validates the 21-dish catalog schema, deterministic dietary rule logic, and KDS state machine transitions with **zero external network dependencies**.
- **Live Integration Probe (`backend/test/live.test.js`)**: Optional smoke test for live cloud endpoints.

```bash
# Run Unit Tests (CI-safe)
cd backend
npm test

# Run Live Endpoint Smoke Test (optional)
npm run test:live
```

---

## 📂 Repository Structure

```text
AWS/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI workflow (build & unit tests)
├── docs/
│   └── viva-guide.md                   # Technical design & architecture notes
├── site/                               # Static Frontend (S3 / Vercel)
│   ├── index.html                      # Single-page interface & KDS terminal
│   ├── style.css                       # Responsive design system
│   ├── script.js                       # Client-side dietary rule engine & KDS state
│   └── images/                         # 21 Curated signature dish image assets
├── backend/                            # TypeScript Express REST API
│   ├── src/
│   │   ├── server.ts                   # Express server entrypoint & health probe
│   │   ├── db.ts                       # Amazon DynamoDB Document Client setup
│   │   ├── sns.ts                      # Amazon SNS event dispatcher
│   │   ├── cloudwatch.ts               # Amazon CloudWatch metrics dispatcher
│   │   └── routes/
│   │       ├── bookings.ts             # POST/GET table reservations
│   │       ├── orders.ts               # POST/GET/PATCH food orders & KDS state
│   │       ├── ai.ts                   # Curated menu database & nutritional rules
│   │       └── analytics.ts            # CloudOps telemetry & load tester
│   ├── test/
│   │   ├── unit.test.js                # CI-safe unit test suite
│   │   └── live.test.js                # Live cloud endpoints smoke tester
│   ├── package.json                    # Backend dependencies & scripts
│   └── tsconfig.json                   # TypeScript configuration
├── deploy-s3.ps1                       # S3 deployment script (PowerShell)
├── deploy-s3.sh                        # S3 deployment script (Bash)
├── deploy-cloudfront.ps1               # CloudFront CDN provisioner (PowerShell)
├── deploy-cloudfront.sh                # CloudFront CDN provisioner (Bash)
├── create-tables.ps1                   # DynamoDB table creator (PowerShell)
├── create-tables.sh                    # DynamoDB table creator (Bash)
├── sdk-upload.js                       # AWS SDK v3 Node.js upload utility
├── vercel.json                         # Vercel deployment & HTTPS reverse proxy config
├── LICENSE                             # MIT License
└── README.md                           # Master project documentation
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js 20+ LTS**
- **TypeScript 5.7+**
- **AWS CLI** (optional, for deployment scripts)

### 1. Clone the Repository
```bash
git clone https://github.com/lakshiaharan/spice-route-restaurant.git
cd spice-route-restaurant
```

### 2. Run the Backend
```bash
cd backend
npm install
npm run build
npm start
```
*Backend runs locally at `http://localhost:3000`.*

### 3. Run the Frontend
```bash
cd ../site
npx serve .
```

### 4. Run Automated Tests
```bash
cd ../backend
npm test
```

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).