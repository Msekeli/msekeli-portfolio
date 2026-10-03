import Section from "../components/Section";
import Text from "../components/Text";
import Button from "../components/Button";
import Surface from "../components/Surface";
import HeroStatBar from "../components/HeroStatBar";
import TechStrip from "../components/TechStrip";
import hero from "../data/hero.json";

export default function Hero() {
  return (
    <Section id="home">
      <div className="grid grid-cols-1 items-center gap-8 md:pt-8 lg:grid-cols-2">
        {/*
          On mobile the wrapper disappears (contents) so the order can be:
          intro, image, stats. On lg and up it is a normal block, so the stats
          sit directly under the intro in the left column.
        */}
        <div className="contents lg:block">
          {/* Text */}
          <div className="order-1 max-w-xl space-y-6 lg:order-none">
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

          {/* Stats */}
          <HeroStatBar
            stats={hero.stats}
            className="order-3 max-w-xl lg:order-none lg:mt-8"
          />
        </div>

        {/* Image */}
        <div className="order-2 w-full lg:order-none lg:ml-auto lg:max-w-xl">
          <Surface noPadding className="gold-glow overflow-hidden">
            <img
              src="/images/my-hero-img.webp"
              alt="Hero image"
              className="w-full h-full object-cover"
            />
          </Surface>
        </div>
      </div>

      <TechStrip className="mt-10 md:mt-12" />
    </Section>
  );
}
