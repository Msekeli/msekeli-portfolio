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
    <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div className="surface rounded-2xl p-3 flex flex-col gap-4 gold-glow max-h-105 justify-center">
        {navItems.map(({ id, label, icon }) => {
          const isActive = activeId === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleClick(id)}
              className="
                group relative
                flex items-center justify-center
                w-14 h-14
                cursor-pointer
                transition-transform duration-100
                active:scale-95
              "
            >
              <div
                className={`
                  w-12 h-12 rounded-full
                  flex items-center justify-center
                  border
                  transition-all duration-100
                  group-hover:scale-105
                  ${
                    isActive
                      ? "border-gold-main text-gold-main gold-glow"
                      : "border-gold-main/30 text-text-muted"
                  }
                `}
              >
                <Icon name={icon} />
              </div>

              <span
                className="
                  absolute left-16 top-1/2 -translate-y-1/2
                  px-3 py-1 rounded-md surface
                  text-text-primary text-sm font-bold
                  border border-gold-main/50
                  shadow-[0_0_10px_rgba(212,175,55,0.2)]
                  opacity-0 translate-x-2
                  group-hover:opacity-100 group-hover:translate-x-0
                  transition-all duration-150
                  whitespace-nowrap
                  pointer-events-none
                "
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
