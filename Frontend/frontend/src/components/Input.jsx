export default function Input({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="input-group mb-3">
      {icon && (
        <span className="input-group-text bg-light">
          <i className={`bi ${icon}`}></i>
        </span>
      )}
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
