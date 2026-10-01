import { Fragment } from "react";
import Icon from "../components/Icon";
import useActiveSection from "../hooks/useActiveSection";
import navItems, { navIds } from "../data/nav";

export default function Navigation() {
  const activeId = useActiveSection(navIds);

  const handleClick = (id) => {
    const el = document.getElementById(id);

    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <aside
      aria-label="Primary"
      className="
        hidden md:flex
        fixed
        top-1/2
        -translate-y-1/2
        left-[clamp(1rem,9vw,10%)]
        z-50
      "
    >
      <nav className="surface gold-glow flex flex-col gap-2 rounded-[20px] px-2.5 py-3.5">
        {navItems.map(({ id, label, icon }, index) => {
          const isActive = activeId === id;

          return (
            <Fragment key={id}>
              {index > 0 && (
                <div aria-hidden="true" className="mx-3 h-px bg-gold-main/12" />
              )}
              <button
                type="button"
                onClick={() => handleClick(id)}
                aria-current={isActive ? "page" : undefined}
                className={`
                flex h-[74px] w-[72px] cursor-pointer flex-col items-center justify-center gap-2
                rounded-[14px] border text-xs
                transition-colors duration-100
                active:scale-95
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-main
                ${
                  isActive
                    ? "border-gold-main bg-gold-main/10 font-medium text-gold-main"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }
              `}
              >
                <Icon name={icon} size={24} />
                <span className="leading-none">{label}</span>
              </button>
            </Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
