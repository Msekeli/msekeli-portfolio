import Button from "../Button";
import Icon from "../Icon";

const pad = (n) => String(n).padStart(2, "0");

export default function ProjectViewerInfo({
  project,
  currentScreen,
  selectedIndex,
  screenCount,
}) {
  // Per-screen tech if the slide has it, otherwise the project's full stack.
  const tech = currentScreen.tech?.length ? currentScreen.tech : project.tech;

  return (
    <aside
      key={selectedIndex}
      className="viewer-fade flex min-w-0 flex-col gap-3 border-t border-borderColor pt-5 lg:border-t-0 lg:pt-0"
    >
      {/* Counter is built from the real number of screens (01 / 05, 01 / 10…) */}
      <p className="leading-none" aria-hidden="true">
        <span className="text-[34px] font-semibold text-gold-main sm:text-[42px]">
          {pad(selectedIndex + 1)}
        </span>

        <span className="text-[15px] text-text-muted sm:text-[18px]">
          {" "}
          / {pad(screenCount)}
        </span>
      </p>

      <h3 className="text-[20px] font-semibold leading-tight text-text-primary sm:text-[25px]">
        {currentScreen.title}
      </h3>

      <div className="space-y-4">
        <p className="text-[14px] leading-6 text-text-secondary sm:text-[17px] sm:leading-7">
          {currentScreen.description}
        </p>

        {tech?.length > 0 && (
          <div className="border-t border-borderColor pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
              Technologies & tools
            </p>

            {/* Same chip style as the Skills section, all equal */}
            <ul className="flex min-w-0 flex-wrap gap-1.5">
              {tech.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {project.repo && (
        <div className="pt-2 sm:pt-3">
          <Button
            type="button"
            variant="primary"
            onClick={() =>
              window.open(project.repo, "_blank", "noopener,noreferrer")
            }
            className="w-full justify-center"
          >
            <Icon name="Github" />
            <span>Source Code</span>
          </Button>
        </div>
      )}
    </aside>
  );
}
