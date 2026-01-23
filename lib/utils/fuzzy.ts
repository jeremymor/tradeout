import { Country } from '@/lib/data/countries';

/**
 * Fuzzy match country names with aliases support
 * @param input User input string
 * @param countries Array of all countries
 * @returns Array of matching countries, sorted by relevance
 */
export function fuzzyMatch(input: string, countries: Country[]): Country[] {
  if (!input || input.trim().length === 0) {
    return [];
  }
  
  const searchTerm = input.toLowerCase().trim();
  
  // Score each country based on match quality
  const scored = countries
    .map((country) => {
      let score = 0;
      const countryName = country.name.toLowerCase();
      
      // Exact match (highest priority)
      if (countryName === searchTerm) {
        score = 1000;
      }
      // Starts with search term
      else if (countryName.startsWith(searchTerm)) {
        score = 500;
      }
      // Contains search term
      else if (countryName.includes(searchTerm)) {
        score = 250;
      }
      
      // Check aliases
      for (const alias of country.aliases) {
        const aliasLower = alias.toLowerCase();
        if (aliasLower === searchTerm) {
          score = Math.max(score, 900);
        } else if (aliasLower.startsWith(searchTerm)) {
          score = Math.max(score, 400);
        } else if (aliasLower.includes(searchTerm)) {
          score = Math.max(score, 200);
        }
      }
      
      return { country, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  
  return scored.map(({ country }) => country).slice(0, 10);
}

/**
 * Check if input exactly matches a country (name or alias)
 * @param input User input string
 * @param country Country to check against
 * @returns True if exact match
 */
export function isExactMatch(input: string, country: Country): boolean {
  const searchTerm = input.toLowerCase().trim();
  const countryName = country.name.toLowerCase();
  
  if (countryName === searchTerm) {
    return true;
  }
  
  return country.aliases.some(
    (alias) => alias.toLowerCase() === searchTerm
  );
}

/**
 * Find country by exact match (name or alias)
 * @param input User input string
 * @param countries Array of all countries
 * @returns Matching country or null
 */
export function findCountryByName(
  input: string,
  countries: Country[]
): Country | null {
  const searchTerm = input.toLowerCase().trim();
  
  return (
    countries.find((country) => isExactMatch(searchTerm, country)) || null
  );
}
