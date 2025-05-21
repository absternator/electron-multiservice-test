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
      style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Electron File Operations Demo</h1>
      <label>
        Operation:
        <select
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value);
            setPayload(
              JSON.stringify(defaultPayloads[e.target.value], null, 2)
            );
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
      <label>
        Payload (JSON):
        <textarea
          rows={6}
          style={{ width: "100%" }}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleRun} disabled={loading}>
        {loading ? "Running..." : "Run Operation"}
      </button>
      <br />
      <h2>Result</h2>
      <pre style={{ border: "1px solid #ccc", padding: 10, minHeight: 80 }}>
        {result || "(no result)"}
      </pre>
    </div>
  );
}
