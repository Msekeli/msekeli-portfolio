import Section from "../components/Section";
import Text from "../components/Text";
import Button from "../components/Button";
import Surface from "../components/Surface";
import HeroMetrics from "../components/HeroMetrics/HeroMetrics";
import hero from "../data/hero.json";

export default function Hero() {
  return (
    <Section id="home">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:pt-8 items-center">
        {/* Text */}
        <div className="space-y-6 max-w-xl stagger">
          <Text variant="secondary">{hero.greeting}</Text>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold gold-accent leading-tight">
            {hero.name}
          </h1>

          <h2 className="text-xl lg:text-2xl font-medium text-text-secondary">
            {hero.headline}
          </h2>

          <Text className="max-w-lg">{hero.description}</Text>

          <div className="pt-2">
            <Button to="projects">{hero.cta}</Button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full lg:max-w-xl lg:ml-auto">
          <Surface noPadding className="gold-glow animate-fade overflow-hidden">
            <img
              src="/images/my-hero-img.webp"
              alt="Hero image"
              className="w-full h-full object-cover"
            />
          </Surface>
        </div>
        <HeroMetrics className="lg:col-span-2" />
      </div>
    </Section>
  );
}
