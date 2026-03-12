import Icon from "../components/Icon";
import useActiveSection from "../hooks/useActiveSection";

const items = [
  { id: "home", label: "Home", icon: "Home" },
  { id: "about", label: "About", icon: "User" },
  { id: "certificates", label: "Skills", icon: "Code2" },
  { id: "projects", label: "Projects", icon: "FolderGit2" },
  { id: "contact", label: "Contact", icon: "Mail" },
];

export default function DesktopNav() {
  const activeId = useActiveSection(items.map((i) => i.id));

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", location.pathname);
  };

  return (
    <aside className="hidden md:flex w-24">
      <div className="mt-24 ml-15 surface rounded-2xl p-3 flex flex-col gap-4 gold-glow max-h-105 justify-center">
        {items.map(({ id, label, icon }) => {
          const isActive = activeId === id;

          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="group relative flex items-center justify-center w-14 h-14 cursor-pointer interactive"
            >
              {/* Icon circle */}
              <div
                className={`
                  w-12 h-12 rounded-full
                  flex items-center justify-center
                  border
                  ${
                    isActive
                      ? "border-gold-main text-gold-main gold-glow"
                      : "border-gold-main/30 text-text-muted"
                  }
                `}
              >
                <Icon name={icon} />
              </div>

              {/* Tooltip label */}
              <span
                className="
                  absolute left-16 top-1/2 -translate-y-1/2
                  px-3 py-1 rounded-md surface
                  text-text-primary text-sm font-bold
                  border border-gold-main/50
                  shadow-[0_0_10px_rgba(212,175,55,0.2)]
                  opacity-0 translate-x-2
                  group-hover:opacity-100 group-hover:translate-x-0
                  transition-all duration-150 whitespace-nowrap
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
