export default function Surface({
  children,
  elevated = false,
  className = "",
  noPadding = false,
  ...props
}) {
  const baseClasses = `
    surface
    interactive
    rounded-2xl
    ${noPadding ? "" : "p-6"}
  `;

  const elevationClass = elevated ? "surface--elevated" : "";

  return (
    <div {...props} className={`${baseClasses} ${elevationClass} ${className}`}>
      {children}
    </div>
  );
}
