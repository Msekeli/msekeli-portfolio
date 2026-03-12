import Section from "../components/Section";
import Text from "../components/Text";
import Button from "../components/Button";
import hero from "../data/hero.json";

export default function Hero() {
  return (
    <Section id="home">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:pt-12 items-center">
        {/* Text */}
        <div className="space-y-6 max-w-xl">
          <Text variant="secondary">{hero.greeting}</Text>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold gold-accent leading-tight">
            {hero.name}
          </h1>

          <h2 className="text-xl lg:text-2xl font-medium text-text-secondary">
            {hero.headline}
          </h2>

          <Text className="max-w-lg">{hero.description}</Text>

          {Array.isArray(hero.techStack) && (
            <div className="pt-2 hidden lg:block">
              <span className="tag">
                <span className="tag-label">{hero.techStackLabel}</span>
                <span className="tag-value">{hero.techStack.join(" · ")}</span>
              </span>
            </div>
          )}

          <div className="pt-2">
            <Button to="projects">{hero.cta}</Button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full lg:max-w-md lg:ml-auto">
          <div className="surface rounded-2xl gold-glow p-6">
            <img
              src="/images/hero.png"
              alt="Hero illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
