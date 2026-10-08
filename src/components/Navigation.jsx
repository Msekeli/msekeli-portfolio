import { Fragment } from "react";
import Icon from "../components/Icon";
import navItems from "../data/nav";

export default function Navigation({ activeId, setActiveId }) {
  // This sidebar is desktop only. Desktop shows one section at a time, so a
  // click just switches the active section.
  const handleClick = (id) => {
    setActiveId(id);

    // If the page was scrolled down to the footer, come back to the top.
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
                <div
                  aria-hidden="true"
                  className="mx-3 mb-2 h-px bg-gold-main/12"
                />
              )}

              <button
                type="button"
                onClick={() => handleClick(id)}
                aria-current={isActive ? "location" : undefined}
                className={`
                  flex h-[74px] w-[72px] cursor-pointer flex-col
                  items-center justify-center gap-2 rounded-[14px]
                  border text-xs transition-colors duration-150
                  active:scale-95
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-gold-main
                  ${
                    isActive
                      ? "border-gold-main bg-gold-main/10 font-medium text-gold-main"
                      : "border-transparent text-text-secondary hover:border-gold-main/30 hover:bg-gold-main/5 hover:text-text-primary"
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
