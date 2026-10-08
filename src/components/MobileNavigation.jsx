import Icon from "../components/Icon";
import navItems from "../data/nav";

export default function MobileNavigation({ activeId, setActiveId }) {
  const handleClick = (id) => {
    const element = document.getElementById(id);

    if (!element) return;

    // Instant visual feedback
    setActiveId(id);

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden h-16 surface border-t border-white/5 gold-glow">
      <div className="h-full flex justify-around items-center">
        {navItems.map(({ id, label, icon }) => {
          const isActive = activeId === id;

          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              aria-current={isActive ? "location" : undefined}
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
