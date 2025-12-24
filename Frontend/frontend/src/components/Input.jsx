export default function Input({ icon, ...props }) {
  return (
    <div className="input-group mb-3">
      {icon && (
        <span className="input-group-text bg-transparent text-primary">
          <i className={`bi ${icon}`}></i>
        </span>
      )}
      <input className="form-control" {...props} />
    </div>
  );
}
