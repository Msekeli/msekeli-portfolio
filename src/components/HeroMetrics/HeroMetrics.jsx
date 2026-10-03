import metrics from "../../data/heroMetrics.json";
import MetricCard from "./MetricCard";

export default function HeroMetrics({ className = "" }) {
  return (
    <div
      className={`mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 ${className}`}
    >
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          icon={metric.icon}
          value={metric.value}
          suffix={metric.suffix}
          label={metric.label}
        />
      ))}
    </div>
  );
}
