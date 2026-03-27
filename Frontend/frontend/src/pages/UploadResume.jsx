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

  // Fetch resume metadata
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
    } catch (err) {
      setResumeMeta(null);
    }
  };

  // Upload / Replace Resume
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
      setMessage(
        err.response?.data?.message || "Upload failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete Resume
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?"))
      return;

    try {
      const res = await axios.delete(
        "http://localhost:5000/users/resume",
        { headers }
      );

      setMessage(res.data.message);
      setResumeMeta(null);
    } catch (err) {
      setMessage("Delete failed. Try again.");
    }
  };

  // View Resume
  const handleView = () => {
    window.open(
      "http://localhost:5000/users/resume",
      "_blank"
    );
  };

  const resumeExists = resumeMeta && resumeMeta.fileName;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">Resume Manager</h3>

        {message && (
          <div
            className={`alert ${
              message.toLowerCase().includes("success")
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        {/* Resume Info */}
        {resumeExists && (
          <div className="mb-4">
            <p><strong>File:</strong> {resumeMeta.fileName}</p>

            <p>
              <strong>Size:</strong>{" "}
              {resumeMeta.size
                ? (resumeMeta.size / 1024).toFixed(2) + " KB"
                : "Unknown"}
            </p>

            <p>
              <strong>Uploaded:</strong>{" "}
              {resumeMeta.uploadedAt
                ? new Date(resumeMeta.uploadedAt).toLocaleString()
                : "Unknown"}
            </p>
          </div>
        )}

        {/* Upload / Replace Form */}
        <form onSubmit={handleUpload} className="mb-3">
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Uploading..."
                : resumeExists
                ? "Replace Resume"
                : "Upload Resume"}
            </button>
          </div>
        </form>

        {/* View / Delete Buttons */}
        {resumeExists && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-success w-100"
              onClick={handleView}
            >
              View Resume
            </button>

            <button
              className="btn btn-danger w-100"
              onClick={handleDelete}
            >
              Delete Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}