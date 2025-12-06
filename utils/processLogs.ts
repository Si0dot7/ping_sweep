export function processLogs(rawLogs: any[]) {
  // 1) จำลองโมเดลตรวจจับ ping sweep
  const processedLogs = rawLogs.map((log) => {
    const isPingSweep =
      log.icmp_type === 8 &&
      log.src_ip === "10.0.0.5"; // สมมติ IP นี้คือคนโจมตี

    return {
      ...log,
      confidence: isPingSweep ? 0.8 + Math.random() * 0.2 : Math.random() * 0.2,
      label: isPingSweep ? "ping_sweep" : "normal",
    };
  });

  // 2) Summary
  const suspicious = processedLogs.filter((l) => l.label === "ping_sweep");

  const summary = {
    total_logs: processedLogs.length,
    suspicious_count: suspicious.length,
    detection_rate: Math.round((suspicious.length / processedLogs.length) * 100),
    model_updated: "2025-12-05",
  };

  // 3) Timeline สำหรับกราฟ
  const timelineMap: Record<string, number> = {};

  processedLogs.forEach((log) => {
    const time = log.timestamp.slice(11, 16); // HH:MM
    if (!timelineMap[time]) timelineMap[time] = 0;
    if (log.label === "ping_sweep") timelineMap[time]++;
  });

  const timeline = Object.entries(timelineMap).map(([time, count]) => ({
    time,
    detections: count,
  }));

  return {
    logs: processedLogs,
    summary,
    timeline,
  };
}
