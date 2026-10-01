export default function Container({ children, className = "" }) {
  return (
    <div
      className={`w-full px-[clamp(1rem,9vw,10%)] md:pl-[calc(clamp(1rem,9vw,10%)+10rem)] ${className}`}
    >
      {children}
    </div>
  );
}
