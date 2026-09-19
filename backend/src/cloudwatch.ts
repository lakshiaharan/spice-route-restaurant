import { CloudWatchClient, PutMetricDataCommand, StandardUnit } from "@aws-sdk/client-cloudwatch";

const REGION = process.env.AWS_REGION || "ap-south-1";
const NAMESPACE = "SpiceRoute/CloudOps";

const cloudwatch = new CloudWatchClient({ region: REGION });

export interface MetricDimension {
  Name: string;
  Value: string;
}

/**
 * Puts a custom metric data point into AWS CloudWatch
 */
export async function emitMetric(
  metricName: string,
  value: number,
  unit: StandardUnit = "Count",
  dimensions: MetricDimension[] = []
): Promise<void> {
  const isAwsConfigured = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_EXECUTION_ENV || process.env.AWS_REGION;

  if (!isAwsConfigured) {
    // Local / Offline trace
    return;
  }

  try {
    const command = new PutMetricDataCommand({
      Namespace: NAMESPACE,
      MetricData: [
        {
          MetricName: metricName,
          Value: value,
          Unit: unit,
          Timestamp: new Date(),
          Dimensions: dimensions.length > 0 ? dimensions : [{ Name: "Environment", Value: "Production-EC2" }]
        }
      ]
    });

    await cloudwatch.send(command);
  } catch (err: any) {
    // Silently handle credential/network failures during local development
    // console.debug(`[AWS CloudWatch] Metric emission notice: ${err.message}`);
  }
}

/**
 * Convenience helper: Record API Request Latency
 */
export async function recordApiLatency(route: string, durationMs: number): Promise<void> {
  await emitMetric("ApiLatency", durationMs, "Milliseconds", [
    { Name: "Route", Value: route },
    { Name: "Environment", Value: "Production-EC2" }
  ]);
}

/**
 * Convenience helper: Record Business Events
 */
export async function recordBusinessEvent(eventType: "NewBooking" | "NewOrder" | "KdsTransition" | "AiSommelierQuery"): Promise<void> {
  await emitMetric(eventType, 1, "Count", [
    { Name: "EventType", Value: eventType },
    { Name: "Environment", Value: "Production-EC2" }
  ]);
}