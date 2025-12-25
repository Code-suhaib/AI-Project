export default function Input({ icon, ...props }) {
  return (
    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text">
          <i className={`bi ${icon}`}></i>
        </span>
        <input className="form-control" {...props} />
      </div>
    </div>
  );
}
