import React, { useState } from "react";

const defaultPayloads: Record<string, any> = {
  create: { path: "test.txt" },
  read: { path: "test.txt" },
  update: { path: "test.txt", content: "Hello, world!" },
  delete: { path: "test.txt" },
  move: { from: "test.txt", to: "test2.txt" },
  copy: { from: "test2.txt", to: "test3.txt" },
  rename: { from: "test3.txt", to: "test4.txt" },
  list: { path: "." },
};

const operations = Object.keys(defaultPayloads);

export default function App() {
  const [operation, setOperation] = useState("create");
  const [payload, setPayload] = useState(
    JSON.stringify(defaultPayloads["create"], null, 2)
  );
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (window.electronAPI && typeof window.electronAPI.send === "function") {
        // Running in Electron
        res = await window.electronAPI.send(
          "file-operation",
          operation,
          JSON.stringify(payload)
        );
      } else {
        // Running in web/preview mode, call backend directly
        const response = await fetch("http://localhost:8081/file-operation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operation, payload }),
        });
        res = await response.json();
      }
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "3rem auto",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 32px 0 rgba(60, 60, 120, 0.10)",
        padding: "2.5rem 2rem 2rem 2rem",
        border: "1px solid #e5e7eb",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: -1,
          color: "#2d3748",
          marginBottom: 24,
        }}
      >
        <img
          src='/src/assets/react.svg'
          alt='App Icon'
          style={{ width: 48, verticalAlign: "middle", marginRight: 12 }}
        />
        Electron File Operations Demo
      </h1>
      <label style={{ fontWeight: 500, color: "#374151" }}>
        Operation:
        <select
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value);
            setPayload(
              JSON.stringify(defaultPayloads[e.target.value], null, 2)
            );
          }}
          style={{
            marginLeft: 8,
            padding: 4,
            borderRadius: 6,
            border: "1px solid #cbd5e1",
          }}
        >
          {operations.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label style={{ fontWeight: 500, color: "#374151" }}>
        Payload (JSON):
        <textarea
          rows={6}
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            marginTop: 4,
            fontFamily: "monospace",
            fontSize: 15,
            padding: 8,
          }}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />
      </label>
      <br />
      <button
        onClick={handleRun}
        disabled={loading}
        style={{
          background: loading ? "#cbd5e1" : "#6366f1",
          color: loading ? "#64748b" : "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 28px",
          fontWeight: 600,
          fontSize: 17,
          margin: "18px 0 0 0",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 2px 8px 0 rgba(99,102,241,0.08)",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        {loading ? "Running..." : "Run Operation"}
      </button>
      <br />
      <h2
        style={{
          color: "#4b5563",
          fontWeight: 600,
          marginTop: 32,
          fontSize: 22,
        }}
      >
        Result
      </h2>
      <pre
        style={{
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          padding: 14,
          minHeight: 80,
          borderRadius: 8,
          fontSize: 15,
          color: "#334155",
        }}
      >
        {result || "(no result)"}
      </pre>
    </div>
  );
}
