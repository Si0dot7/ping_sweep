"use client";

export default function LogViewer({ logs }) {
  return (
    <div className="border p-5 rounded bg-white shadow">
      <h2 className="text-2xl font-bold mb-4">Log Viewer</h2>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Source IP</th>
              <th className="p-2 border">Destination IP</th>
              <th className="p-2 border">Bytes</th>
              <th className="p-2 border">ICMP</th>
              <th className="p-2 border">TTL</th>
              <th className="p-2 border">Label</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((l, i) => (
              <tr key={i} className="border hover:bg-gray-50">
                <td className="p-2 border">{l.timestamp}</td>
                <td className="p-2 border">{l.src_ip}</td>
                <td className="p-2 border">{l.dst_ip}</td>
                <td className="p-2 border">{l.client_bytes}</td>
                <td className="p-2 border">{`${l.icmp_type}/${l.icmp_code}`}</td>
                <td className="p-2 border">{l.ttl}</td>
                <td className={`p-2 border ${l.label === "ping_sweep" ? "text-red-600 font-bold" : ""}`}>
                  {l.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
