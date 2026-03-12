import Icon from "../components/Icon";
import useActiveSection from "../hooks/useActiveSection";

const items = [
  { id: "home", label: "Home", icon: "Home" },
  { id: "about", label: "About", icon: "User" },
  { id: "certificates", label: "Skills", icon: "Code2" },
  { id: "projects", label: "Projects", icon: "FolderGit2" },
  { id: "contact", label: "Contact", icon: "Mail" },
];

export default function MobileNav() {
  const activeId = useActiveSection(items.map((i) => i.id));

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", location.pathname);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden h-16 surface border-t border-white/5 gold-glow">
      <div className="h-full flex justify-around items-center">
        {items.map(({ id, label, icon }) => {
          const isActive = activeId === id;

          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`flex flex-col items-center cursor-pointer ${
                isActive ? "text-gold-main" : "text-text-muted"
              }`}
            >
              <Icon name={icon} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
