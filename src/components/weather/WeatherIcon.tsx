"use client";

import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  type LucideProps,
} from "lucide-react";

interface WeatherIconProps extends LucideProps {
  conditionId: number;
  icon?: string; // OWM icon code e.g. "01d", "01n"
}

export function WeatherIcon({
  conditionId,
  icon,
  ...props
}: WeatherIconProps) {
  const isNight = icon?.endsWith("n") ?? false;

  // Map OWM condition ID ranges to Lucide icons
  // 200-299: Thunderstorm
  if (conditionId >= 200 && conditionId < 300) {
    return <CloudLightning {...props} />;
  }
  // 300-399: Drizzle
  if (conditionId >= 300 && conditionId < 400) {
    return <CloudDrizzle {...props} />;
  }
  // 500-599: Rain
  if (conditionId >= 500 && conditionId < 600) {
    return <CloudRain {...props} />;
  }
  // 600-699: Snow
  if (conditionId >= 600 && conditionId < 700) {
    return <CloudSnow {...props} />;
  }
  // 700-799: Atmosphere (fog, mist, haze, etc.)
  if (conditionId >= 700 && conditionId < 800) {
    if (conditionId === 781) return <Wind {...props} />; // Tornado
    return <CloudFog {...props} />;
  }
  // 800: Clear
  if (conditionId === 800) {
    return isNight ? <Moon {...props} /> : <Sun {...props} />;
  }
  // 801: Few clouds
  if (conditionId === 801) {
    return isNight ? <CloudMoon {...props} /> : <CloudSun {...props} />;
  }
  // 802-804: Cloudy
  if (conditionId > 801) {
    return <Cloud {...props} />;
  }

  return <Cloud {...props} />;
}
