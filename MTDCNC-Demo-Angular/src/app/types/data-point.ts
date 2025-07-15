export interface DataPoint {
  timestamp: string; // UTC timestamp
  status: 0 | 1; // 0 for downtime, 1 for uptime
}