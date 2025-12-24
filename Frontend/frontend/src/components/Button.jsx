export default function Button({ children, ...props }) {
  return (
    <button className="btn btn-lux w-100" {...props}>
      {children}
    </button>
  );
}
