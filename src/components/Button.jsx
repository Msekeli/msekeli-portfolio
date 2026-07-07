export default function Button({
  children,
  to,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  const handleClick = (e) => {
    if (to) {
      const el = document.getElementById(to);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", location.pathname);
      }
    }

    if (onClick) onClick(e);
  };

  const baseClasses = `
    group relative overflow-hidden
    inline-flex items-center gap-2
    px-4 py-2
    rounded-md
    whitespace-nowrap
    cursor-pointer
    interactive
    text-sm
    font-medium
  `;

  const variants = {
    primary: `
      border border-gold-main
      text-gold-main
      hover:bg-gold-main/10
    `,
    secondary: `
      surface
      text-text-secondary
      hover:text-gold-main
    `,
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <span className="pointer-events-none absolute inset-y-0 -left-8 w-6 rotate-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-40" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
