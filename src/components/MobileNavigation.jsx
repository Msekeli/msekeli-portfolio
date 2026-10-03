import Icon from "../components/Icon";
import useActiveSection from "../hooks/useActiveSection";
import navItems, { navIds } from "../data/nav";

export default function MobileNavigation() {
  const [activeId, setActiveId] = useActiveSection(navIds);

  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden h-16 surface border-t border-white/5 gold-glow">
      <div className="h-full flex justify-around items-center">
        {navItems.map(({ id, label, icon }) => {
          const isActive = activeId === id;

          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActiveId(id)}
              aria-current={isActive ? "location" : undefined}
              className={`flex flex-col items-center cursor-pointer ${
                isActive ? "text-gold-main" : "text-text-muted"
              }`}
            >
              <Icon name={icon} />
              <span className="text-xs mt-1">{label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
