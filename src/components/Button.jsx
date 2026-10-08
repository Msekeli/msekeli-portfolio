export default function Button({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
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

  const classNames = `${baseClasses} ${variants[variant]} ${className}`;

  if (href || to) {
    return (
      <a
        href={href ?? `#${to}`}
        onClick={onClick}
        className={classNames}
        {...props}
      >
        <span className="pointer-events-none absolute inset-y-0 -left-8 w-6 rotate-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-40" />
        <span className="relative inline-flex items-center gap-2">
          {children}
        </span>
      </a>
    );
  }

  return (
    <button {...props} onClick={onClick} className={classNames}>
      <span className="pointer-events-none absolute inset-y-0 -left-8 w-6 rotate-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-40" />
      <span className="relative inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
