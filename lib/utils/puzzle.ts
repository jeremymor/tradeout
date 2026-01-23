import { Country } from '@/lib/data/countries';

/**
 * Select a random country excluding recently played ones
 * @param countries Array of all countries
 * @param excludedIds Array of country ISO codes to exclude
 * @param maxHistory Maximum number of countries to track (default 20)
 * @returns Randomly selected country
 */
export function selectRandomCountry(
  countries: Country[],
  excludedIds: string[] = [],
  maxHistory: number = 20
): Country {
  // Filter out excluded countries
  const recentExcluded = excludedIds.slice(-maxHistory);
  const availableCountries = countries.filter(
    (country) => !recentExcluded.includes(country.iso)
  );
  
  // If all countries have been played recently, reset and use all
  const pool = availableCountries.length > 0 ? availableCountries : countries;
  
  // Select random country
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Get color for treemap sector
 * @param sector Export product sector
 * @returns Hex color code
 */
export function getSectorColor(
  sector: string
): string {
  const colors: Record<string, string> = {
    energy: '#B0C9D4', // Powder Blue
    minerals: '#D9C9A8', // Warm Sand
    agriculture: '#E8B4B4', // Dusty Pink
    textiles: '#C9B8D4', // Soft Lavender
    electronics: '#B8C5B0', // Sage Green
    vehicles: '#D4C9B8', // Warm Beige
    chemicals: '#C9D4B8', // Pale Olive
    metals: '#B8B8C9', // Cool Gray
    food: '#B8C5B0', // Sage Green (same as electronics)
    other: '#D4CFC7', // Warm Gray
  };
  
  return colors[sector] || colors.other;
}
