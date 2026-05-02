import { useState, useEffect } from "react";
import axios from "axios";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeMeta, setResumeMeta] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchResumeMeta();
  }, []);

  const fetchResumeMeta = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/users/resume/meta",
        { headers }
      );
      setResumeMeta(res.data);
    } catch {
      setResumeMeta(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      return setMessage("Please select a file first.");
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        "http://localhost:5000/users/upload-resume",
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
      setFile(null);
      fetchResumeMeta();
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Delete your resume permanently?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        "http://localhost:5000/users/resume",
        { headers }
      );

      setMessage(res.data.message);
      setResumeMeta(null);
    } catch {
      setMessage("Delete failed.");
    }
  };

  const handleView = () => {
    window.open(
      "http://localhost:5000/users/resume",
      "_blank"
    );
  };

  const resumeExists = resumeMeta && resumeMeta.fileName;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff, #e0f7fa, #f8fafc)",
      }}
    >
      <div className="container py-5">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ color: "#1e293b" }}>
            📄 Resume Manager
          </h3>
          <p style={{ color: "#64748b" }}>
            Upload your resume to unlock AI-powered recommendations
          </p>
        </div>

        {/* CARD */}
        <div
          className="card border-0 shadow-lg p-4"
          style={{ borderRadius: "16px", maxWidth: "500px", margin: "auto" }}
        >

          {/* MESSAGE */}
          {message && (
            <div
              className={`alert ${
                message.toLowerCase().includes("success")
                  ? "alert-success"
                  : "alert-danger"
              } text-center`}
            >
              {message}
            </div>
          )}

          {/* FILE INFO */}
          {resumeExists && (
            <div className="mb-4 p-3 bg-light rounded">
              <p className="mb-1">
                <strong>📁 File:</strong> {resumeMeta.fileName}
              </p>
              <p className="mb-1">
                <strong>📦 Size:</strong>{" "}
                {resumeMeta.size
                  ? (resumeMeta.size / 1024).toFixed(2) + " KB"
                  : "Unknown"}
              </p>
              <p className="mb-0">
                <strong>⏱ Uploaded:</strong>{" "}
                {resumeMeta.uploadedAt
                  ? new Date(resumeMeta.uploadedAt).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          )}

          {/* UPLOAD */}
          <form onSubmit={handleUpload} className="mb-3">
            <input
              type="file"
              className="form-control mb-3"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              type="submit"
              className="btn w-100"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                color: "white",
                fontWeight: "600",
              }}
            >
              {loading
                ? "Uploading..."
                : resumeExists
                ? "Replace Resume"
                : "Upload Resume"}
            </button>
          </form>

          {/* ACTIONS */}
          {resumeExists && (
            <div className="d-flex gap-2 mt-3">

              <button
                className="btn w-100"
                style={{
                  background: "#10b981",
                  color: "white",
                }}
                onClick={handleView}
              >
                👁 View
              </button>

              <button
                className="btn w-100"
                style={{
                  background: "#ef4444",
                  color: "white",
                }}
                onClick={handleDelete}
              >
                🗑 Delete
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}