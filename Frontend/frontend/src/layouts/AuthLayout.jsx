import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  return (
    <motion.div
      className="vh-100 d-flex justify-content-center align-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="glass p-5" style={{ width: "420px" }}>
        {children}
      </div>
    </motion.div>
  );
}
