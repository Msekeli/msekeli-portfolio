import Surface from "./Surface";

export default function HeroCraftedStrip({ title, items = [] }) {
  return (
    <div className="mt-20 lg:mt-28 flex justify-center">
      <Surface className="gold-glow-strong border border-yellow-400/40 px-8 py-4 max-w-fit">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span className="gold-accent font-semibold text-base sm:text-lg lg:text-xl tracking-wide">
            {title}:
          </span>

          {items.map((item) => (
            <span key={item} className="crafted-chip">
              {item}
            </span>
          ))}
        </div>
      </Surface>
    </div>
  );
}
