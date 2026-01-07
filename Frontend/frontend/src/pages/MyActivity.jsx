import { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";

export default function MyActivity() {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await axios.get("/activity/my");
      setHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <h3 className="text-white mb-4 fw-semibold">
        <i className="bi bi-clock-history me-2"></i>
        My Activity
      </h3>

      {loading && <p className="text-light">Loading activity...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && history.length === 0 && (
        <p className="text-light opacity-75">
          No activity found yet. Try searching internships.
        </p>
      )}

      {/* ACTIVITY CARDS */}
      <div className="row">
        {history.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <motion.div
              className="p-4 h-100 rounded-4"
              whileHover={{ y: -6 }}
              onClick={() => setSelected(item)}
              style={{
                cursor: "pointer",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(14px)",
                color: "#fff",
              }}
            >
              <h6 className="fw-bold text-white text-capitalize mb-2">
                {item.role}
              </h6>

              <p className="mb-1 text-info small">
                Skills: {item.skills.join(", ")}
              </p>

              <small className="text-light opacity-75">
                {new Date(item.createdAt).toLocaleString()}
              </small>
            </motion.div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">
                  Results for "{selected.role}"
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelected(null)}
                />
              </div>

              <div className="modal-body">
                {selected.results.map((job, i) => (
                  <div
                    key={i}
                    className="border-bottom border-secondary pb-2 mb-3"
                  >
                    <strong className="d-block">{job.title}</strong>
                    <span className="text-info">{job.company}</span>
                    <br />
                    <small className="text-light opacity-75">
                      {job.location}
                    </small>
                    <br />
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-light mt-2"
                    >
                      Apply
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
