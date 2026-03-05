import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Types
// =============================================================================

type Sector =
  | 'energy'
  | 'minerals'
  | 'agriculture'
  | 'textiles'
  | 'electronics'
  | 'vehicles'
  | 'chemicals'
  | 'metals'
  | 'food'
  | 'other';

interface GeoData {
  name: string;
  iso: string;
  flag: string;
  lat: number;
  lng: number;
  aliases: string[];
  m49: number;
}

interface ComtradeRecord {
  cmdCode: string;
  cmdDesc: string | null;
  primaryValue: number | null;
  reporterCode: number;
  reporterDesc: string | null;
}

interface ComtradeResponse {
  count: number;
  data: ComtradeRecord[];
  error?: string;
}

interface ExportProduct {
  name: string;
  value: number;
  percentage: number;
  sector: Sector;
}

// =============================================================================
// Country geo data + M49 codes
// =============================================================================

const COUNTRIES: GeoData[] = [
  // Americas
  { name: 'United States', iso: 'US', flag: '\u{1F1FA}\u{1F1F8}', lat: 39.83, lng: -98.58, aliases: ['USA', 'US', 'America', 'United States of America', 'U.S.', 'U.S.A.'], m49: 842 },
  { name: 'Canada', iso: 'CA', flag: '\u{1F1E8}\u{1F1E6}', lat: 56.13, lng: -106.35, aliases: ['CAN'], m49: 124 },
  { name: 'Mexico', iso: 'MX', flag: '\u{1F1F2}\u{1F1FD}', lat: 23.63, lng: -102.55, aliases: ['MEX', 'México'], m49: 484 },
  { name: 'Brazil', iso: 'BR', flag: '\u{1F1E7}\u{1F1F7}', lat: -14.24, lng: -51.93, aliases: ['BRA', 'Brasil'], m49: 76 },
  { name: 'Argentina', iso: 'AR', flag: '\u{1F1E6}\u{1F1F7}', lat: -38.42, lng: -63.62, aliases: ['ARG'], m49: 32 },
  { name: 'Chile', iso: 'CL', flag: '\u{1F1E8}\u{1F1F1}', lat: -35.68, lng: -71.54, aliases: ['CHL'], m49: 152 },
  { name: 'Colombia', iso: 'CO', flag: '\u{1F1E8}\u{1F1F4}', lat: 4.57, lng: -74.30, aliases: ['COL'], m49: 170 },
  { name: 'Peru', iso: 'PE', flag: '\u{1F1F5}\u{1F1EA}', lat: -9.19, lng: -75.02, aliases: ['PER', 'Perú'], m49: 604 },
  { name: 'Venezuela', iso: 'VE', flag: '\u{1F1FB}\u{1F1EA}', lat: 6.42, lng: -66.59, aliases: ['VEN'], m49: 862 },
  { name: 'Ecuador', iso: 'EC', flag: '\u{1F1EA}\u{1F1E8}', lat: -1.83, lng: -78.18, aliases: ['ECU'], m49: 218 },
  { name: 'Bolivia', iso: 'BO', flag: '\u{1F1E7}\u{1F1F4}', lat: -16.29, lng: -63.59, aliases: ['BOL'], m49: 68 },
  { name: 'Uruguay', iso: 'UY', flag: '\u{1F1FA}\u{1F1FE}', lat: -32.52, lng: -55.77, aliases: ['URY'], m49: 858 },
  { name: 'Paraguay', iso: 'PY', flag: '\u{1F1F5}\u{1F1FE}', lat: -23.44, lng: -58.44, aliases: ['PRY'], m49: 600 },
  { name: 'Costa Rica', iso: 'CR', flag: '\u{1F1E8}\u{1F1F7}', lat: 9.75, lng: -83.75, aliases: ['CRI'], m49: 188 },
  { name: 'Panama', iso: 'PA', flag: '\u{1F1F5}\u{1F1E6}', lat: 8.54, lng: -80.78, aliases: ['PAN'], m49: 591 },
  { name: 'Cuba', iso: 'CU', flag: '\u{1F1E8}\u{1F1FA}', lat: 21.52, lng: -77.78, aliases: ['CUB'], m49: 192 },
  { name: 'Guatemala', iso: 'GT', flag: '\u{1F1EC}\u{1F1F9}', lat: 15.78, lng: -90.23, aliases: ['GTM'], m49: 320 },
  { name: 'Honduras', iso: 'HN', flag: '\u{1F1ED}\u{1F1F3}', lat: 15.20, lng: -86.24, aliases: ['HND'], m49: 340 },
  { name: 'Dominican Republic', iso: 'DO', flag: '\u{1F1E9}\u{1F1F4}', lat: 18.74, lng: -70.16, aliases: ['DOM'], m49: 214 },
  { name: 'Trinidad and Tobago', iso: 'TT', flag: '\u{1F1F9}\u{1F1F9}', lat: 10.69, lng: -61.22, aliases: ['TTO'], m49: 780 },
  { name: 'Jamaica', iso: 'JM', flag: '\u{1F1EF}\u{1F1F2}', lat: 18.11, lng: -77.30, aliases: ['JAM'], m49: 388 },
  { name: 'El Salvador', iso: 'SV', flag: '\u{1F1F8}\u{1F1FB}', lat: 13.79, lng: -88.90, aliases: ['SLV'], m49: 222 },
  { name: 'Nicaragua', iso: 'NI', flag: '\u{1F1F3}\u{1F1EE}', lat: 12.87, lng: -85.21, aliases: ['NIC'], m49: 558 },
  { name: 'Guyana', iso: 'GY', flag: '\u{1F1EC}\u{1F1FE}', lat: 4.86, lng: -58.93, aliases: ['GUY'], m49: 328 },
  { name: 'Suriname', iso: 'SR', flag: '\u{1F1F8}\u{1F1F7}', lat: 3.92, lng: -56.03, aliases: ['SUR'], m49: 740 },
  { name: 'Belize', iso: 'BZ', flag: '\u{1F1E7}\u{1F1FF}', lat: 17.19, lng: -88.50, aliases: ['BLZ'], m49: 84 },
  // Europe
  { name: 'Germany', iso: 'DE', flag: '\u{1F1E9}\u{1F1EA}', lat: 51.17, lng: 10.45, aliases: ['DEU', 'Deutschland'], m49: 276 },
  { name: 'France', iso: 'FR', flag: '\u{1F1EB}\u{1F1F7}', lat: 46.23, lng: 2.21, aliases: ['FRA'], m49: 251 },
  { name: 'United Kingdom', iso: 'GB', flag: '\u{1F1EC}\u{1F1E7}', lat: 55.38, lng: -3.44, aliases: ['GBR', 'UK', 'Britain', 'England'], m49: 826 },
  { name: 'Italy', iso: 'IT', flag: '\u{1F1EE}\u{1F1F9}', lat: 41.87, lng: 12.57, aliases: ['ITA', 'Italia'], m49: 380 },
  { name: 'Spain', iso: 'ES', flag: '\u{1F1EA}\u{1F1F8}', lat: 40.46, lng: -3.75, aliases: ['ESP', 'España'], m49: 724 },
  { name: 'Netherlands', iso: 'NL', flag: '\u{1F1F3}\u{1F1F1}', lat: 52.13, lng: 5.29, aliases: ['NLD', 'Holland'], m49: 528 },
  { name: 'Belgium', iso: 'BE', flag: '\u{1F1E7}\u{1F1EA}', lat: 50.50, lng: 4.47, aliases: ['BEL', 'België'], m49: 56 },
  { name: 'Switzerland', iso: 'CH', flag: '\u{1F1E8}\u{1F1ED}', lat: 46.82, lng: 8.23, aliases: ['CHE', 'Schweiz', 'Suisse'], m49: 757 },
  { name: 'Sweden', iso: 'SE', flag: '\u{1F1F8}\u{1F1EA}', lat: 60.13, lng: 18.64, aliases: ['SWE', 'Sverige'], m49: 752 },
  { name: 'Norway', iso: 'NO', flag: '\u{1F1F3}\u{1F1F4}', lat: 60.47, lng: 8.47, aliases: ['NOR', 'Norge'], m49: 578 },
  { name: 'Finland', iso: 'FI', flag: '\u{1F1EB}\u{1F1EE}', lat: 61.92, lng: 25.75, aliases: ['FIN', 'Suomi'], m49: 246 },
  { name: 'Denmark', iso: 'DK', flag: '\u{1F1E9}\u{1F1F0}', lat: 56.26, lng: 9.50, aliases: ['DNK', 'Danmark'], m49: 208 },
  { name: 'Ireland', iso: 'IE', flag: '\u{1F1EE}\u{1F1EA}', lat: 53.14, lng: -7.69, aliases: ['IRL', 'Éire'], m49: 372 },
  { name: 'Poland', iso: 'PL', flag: '\u{1F1F5}\u{1F1F1}', lat: 51.92, lng: 19.15, aliases: ['POL', 'Polska'], m49: 616 },
  { name: 'Czech Republic', iso: 'CZ', flag: '\u{1F1E8}\u{1F1FF}', lat: 49.82, lng: 15.47, aliases: ['CZE', 'Czechia', 'Česko'], m49: 203 },
  { name: 'Austria', iso: 'AT', flag: '\u{1F1E6}\u{1F1F9}', lat: 47.52, lng: 14.55, aliases: ['AUT', 'Österreich'], m49: 40 },
  { name: 'Portugal', iso: 'PT', flag: '\u{1F1F5}\u{1F1F9}', lat: 39.40, lng: -8.22, aliases: ['PRT'], m49: 620 },
  { name: 'Greece', iso: 'GR', flag: '\u{1F1EC}\u{1F1F7}', lat: 39.07, lng: 21.82, aliases: ['GRC', 'Hellas', 'Ελλάδα'], m49: 300 },
  { name: 'Romania', iso: 'RO', flag: '\u{1F1F7}\u{1F1F4}', lat: 45.94, lng: 24.97, aliases: ['ROU', 'România'], m49: 642 },
  { name: 'Hungary', iso: 'HU', flag: '\u{1F1ED}\u{1F1FA}', lat: 47.16, lng: 19.50, aliases: ['HUN', 'Magyarország'], m49: 348 },
  { name: 'Ukraine', iso: 'UA', flag: '\u{1F1FA}\u{1F1E6}', lat: 48.38, lng: 31.17, aliases: ['UKR', 'Україна'], m49: 804 },
  { name: 'Lithuania', iso: 'LT', flag: '\u{1F1F1}\u{1F1F9}', lat: 55.17, lng: 23.88, aliases: ['LTU', 'Lietuva'], m49: 440 },
  { name: 'Slovakia', iso: 'SK', flag: '\u{1F1F8}\u{1F1F0}', lat: 48.67, lng: 19.70, aliases: ['SVK', 'Slovensko'], m49: 703 },
  { name: 'Croatia', iso: 'HR', flag: '\u{1F1ED}\u{1F1F7}', lat: 45.10, lng: 15.20, aliases: ['HRV', 'Hrvatska'], m49: 191 },
  { name: 'Bulgaria', iso: 'BG', flag: '\u{1F1E7}\u{1F1EC}', lat: 42.73, lng: 25.49, aliases: ['BGR', 'България'], m49: 100 },
  { name: 'Serbia', iso: 'RS', flag: '\u{1F1F7}\u{1F1F8}', lat: 44.02, lng: 21.01, aliases: ['SRB', 'Србија'], m49: 688 },
  { name: 'Slovenia', iso: 'SI', flag: '\u{1F1F8}\u{1F1EE}', lat: 46.15, lng: 14.99, aliases: ['SVN', 'Slovenija'], m49: 705 },
  { name: 'Latvia', iso: 'LV', flag: '\u{1F1F1}\u{1F1FB}', lat: 56.88, lng: 24.60, aliases: ['LVA', 'Latvija'], m49: 428 },
  { name: 'Estonia', iso: 'EE', flag: '\u{1F1EA}\u{1F1EA}', lat: 58.60, lng: 25.01, aliases: ['EST', 'Eesti'], m49: 233 },
  { name: 'Bosnia and Herzegovina', iso: 'BA', flag: '\u{1F1E7}\u{1F1E6}', lat: 43.92, lng: 17.68, aliases: ['BIH', 'BiH'], m49: 70 },
  { name: 'North Macedonia', iso: 'MK', flag: '\u{1F1F2}\u{1F1F0}', lat: 41.51, lng: 21.75, aliases: ['MKD', 'Macedonia'], m49: 807 },
  { name: 'Albania', iso: 'AL', flag: '\u{1F1E6}\u{1F1F1}', lat: 41.15, lng: 20.17, aliases: ['ALB', 'Shqipëri'], m49: 8 },
  { name: 'Moldova', iso: 'MD', flag: '\u{1F1F2}\u{1F1E9}', lat: 47.41, lng: 28.37, aliases: ['MDA'], m49: 498 },
  { name: 'Montenegro', iso: 'ME', flag: '\u{1F1F2}\u{1F1EA}', lat: 42.71, lng: 19.37, aliases: ['MNE', 'Crna Gora'], m49: 499 },
  { name: 'Iceland', iso: 'IS', flag: '\u{1F1EE}\u{1F1F8}', lat: 64.96, lng: -19.02, aliases: ['ISL', 'Ísland'], m49: 352 },
  { name: 'Luxembourg', iso: 'LU', flag: '\u{1F1F1}\u{1F1FA}', lat: 49.82, lng: 6.13, aliases: ['LUX'], m49: 442 },
  { name: 'Malta', iso: 'MT', flag: '\u{1F1F2}\u{1F1F9}', lat: 35.94, lng: 14.38, aliases: ['MLT'], m49: 470 },
  { name: 'Cyprus', iso: 'CY', flag: '\u{1F1E8}\u{1F1FE}', lat: 35.13, lng: 33.43, aliases: ['CYP', 'Κύπρος'], m49: 196 },
  { name: 'Belarus', iso: 'BY', flag: '\u{1F1E7}\u{1F1FE}', lat: 53.71, lng: 27.95, aliases: ['BLR'], m49: 112 },
  { name: 'Georgia', iso: 'GE', flag: '\u{1F1EC}\u{1F1EA}', lat: 42.32, lng: 43.36, aliases: ['GEO', 'საქართველო'], m49: 268 },
  // Russia & Central Asia
  { name: 'Russia', iso: 'RU', flag: '\u{1F1F7}\u{1F1FA}', lat: 61.52, lng: 105.32, aliases: ['RUS', 'Russian Federation', 'Россия'], m49: 643 },
  { name: 'Kazakhstan', iso: 'KZ', flag: '\u{1F1F0}\u{1F1FF}', lat: 48.02, lng: 66.92, aliases: ['KAZ', 'Қазақстан'], m49: 398 },
  { name: 'Uzbekistan', iso: 'UZ', flag: '\u{1F1FA}\u{1F1FF}', lat: 41.38, lng: 64.59, aliases: ['UZB'], m49: 860 },
  { name: 'Turkmenistan', iso: 'TM', flag: '\u{1F1F9}\u{1F1F2}', lat: 38.97, lng: 59.56, aliases: ['TKM'], m49: 795 },
  { name: 'Kyrgyzstan', iso: 'KG', flag: '\u{1F1F0}\u{1F1EC}', lat: 41.20, lng: 74.77, aliases: ['KGZ'], m49: 417 },
  { name: 'Tajikistan', iso: 'TJ', flag: '\u{1F1F9}\u{1F1EF}', lat: 38.86, lng: 71.28, aliases: ['TJK'], m49: 762 },
  // Middle East
  { name: 'Saudi Arabia', iso: 'SA', flag: '\u{1F1F8}\u{1F1E6}', lat: 23.89, lng: 45.08, aliases: ['SAU', 'KSA'], m49: 682 },
  { name: 'United Arab Emirates', iso: 'AE', flag: '\u{1F1E6}\u{1F1EA}', lat: 23.42, lng: 53.85, aliases: ['ARE', 'UAE', 'Emirates'], m49: 784 },
  { name: 'Qatar', iso: 'QA', flag: '\u{1F1F6}\u{1F1E6}', lat: 25.35, lng: 51.18, aliases: ['QAT'], m49: 634 },
  { name: 'Kuwait', iso: 'KW', flag: '\u{1F1F0}\u{1F1FC}', lat: 29.31, lng: 47.48, aliases: ['KWT'], m49: 414 },
  { name: 'Iran', iso: 'IR', flag: '\u{1F1EE}\u{1F1F7}', lat: 32.43, lng: 53.69, aliases: ['IRN', 'Persia'], m49: 364 },
  { name: 'Iraq', iso: 'IQ', flag: '\u{1F1EE}\u{1F1F6}', lat: 33.22, lng: 43.68, aliases: ['IRQ'], m49: 368 },
  { name: 'Israel', iso: 'IL', flag: '\u{1F1EE}\u{1F1F1}', lat: 31.05, lng: 34.85, aliases: ['ISR'], m49: 376 },
  { name: 'Turkey', iso: 'TR', flag: '\u{1F1F9}\u{1F1F7}', lat: 38.96, lng: 35.24, aliases: ['TUR', 'Türkiye'], m49: 792 },
  { name: 'Oman', iso: 'OM', flag: '\u{1F1F4}\u{1F1F2}', lat: 21.47, lng: 55.98, aliases: ['OMN'], m49: 512 },
  { name: 'Jordan', iso: 'JO', flag: '\u{1F1EF}\u{1F1F4}', lat: 30.59, lng: 36.24, aliases: ['JOR'], m49: 400 },
  { name: 'Bahrain', iso: 'BH', flag: '\u{1F1E7}\u{1F1ED}', lat: 26.07, lng: 50.56, aliases: ['BHR'], m49: 48 },
  { name: 'Lebanon', iso: 'LB', flag: '\u{1F1F1}\u{1F1E7}', lat: 33.85, lng: 35.86, aliases: ['LBN'], m49: 422 },
  // Africa
  { name: 'South Africa', iso: 'ZA', flag: '\u{1F1FF}\u{1F1E6}', lat: -30.56, lng: 22.94, aliases: ['ZAF', 'RSA'], m49: 710 },
  { name: 'Nigeria', iso: 'NG', flag: '\u{1F1F3}\u{1F1EC}', lat: 9.08, lng: 8.68, aliases: ['NGA'], m49: 566 },
  { name: 'Egypt', iso: 'EG', flag: '\u{1F1EA}\u{1F1EC}', lat: 26.82, lng: 30.80, aliases: ['EGY', 'مصر'], m49: 818 },
  { name: 'Algeria', iso: 'DZ', flag: '\u{1F1E9}\u{1F1FF}', lat: 28.03, lng: 1.66, aliases: ['DZA', 'الجزائر'], m49: 12 },
  { name: 'Morocco', iso: 'MA', flag: '\u{1F1F2}\u{1F1E6}', lat: 31.79, lng: -7.09, aliases: ['MAR', 'المغرب'], m49: 504 },
  { name: 'Kenya', iso: 'KE', flag: '\u{1F1F0}\u{1F1EA}', lat: -0.02, lng: 37.91, aliases: ['KEN'], m49: 404 },
  { name: 'Ethiopia', iso: 'ET', flag: '\u{1F1EA}\u{1F1F9}', lat: 9.15, lng: 40.49, aliases: ['ETH'], m49: 231 },
  { name: 'Ghana', iso: 'GH', flag: '\u{1F1EC}\u{1F1ED}', lat: 7.95, lng: -1.02, aliases: ['GHA'], m49: 288 },
  { name: 'Ivory Coast', iso: 'CI', flag: '\u{1F1E8}\u{1F1EE}', lat: 7.54, lng: -5.55, aliases: ['CIV', "Cote d'Ivoire", 'Cote dIvoire'], m49: 384 },
  { name: 'Tanzania', iso: 'TZ', flag: '\u{1F1F9}\u{1F1FF}', lat: -6.37, lng: 34.89, aliases: ['TZA'], m49: 834 },
  { name: 'Angola', iso: 'AO', flag: '\u{1F1E6}\u{1F1F4}', lat: -11.20, lng: 17.87, aliases: ['AGO'], m49: 24 },
  { name: 'DR Congo', iso: 'CD', flag: '\u{1F1E8}\u{1F1E9}', lat: -4.04, lng: 21.76, aliases: ['COD', 'DRC', 'Congo-Kinshasa'], m49: 180 },
  { name: 'Senegal', iso: 'SN', flag: '\u{1F1F8}\u{1F1F3}', lat: 14.50, lng: -14.45, aliases: ['SEN'], m49: 686 },
  { name: 'Zambia', iso: 'ZM', flag: '\u{1F1FF}\u{1F1F2}', lat: -13.13, lng: 27.85, aliases: ['ZMB'], m49: 894 },
  { name: 'Mozambique', iso: 'MZ', flag: '\u{1F1F2}\u{1F1FF}', lat: -18.67, lng: 35.53, aliases: ['MOZ'], m49: 508 },
  { name: 'Tunisia', iso: 'TN', flag: '\u{1F1F9}\u{1F1F3}', lat: 33.89, lng: 9.54, aliases: ['TUN', 'تونس'], m49: 788 },
  { name: 'Uganda', iso: 'UG', flag: '\u{1F1FA}\u{1F1EC}', lat: 1.37, lng: 32.29, aliases: ['UGA'], m49: 800 },
  { name: 'Cameroon', iso: 'CM', flag: '\u{1F1E8}\u{1F1F2}', lat: 7.37, lng: 12.35, aliases: ['CMR'], m49: 120 },
  { name: 'Zimbabwe', iso: 'ZW', flag: '\u{1F1FF}\u{1F1FC}', lat: -19.02, lng: 29.15, aliases: ['ZWE'], m49: 716 },
  { name: 'Libya', iso: 'LY', flag: '\u{1F1F1}\u{1F1FE}', lat: 26.34, lng: 17.23, aliases: ['LBY', 'ليبيا'], m49: 434 },
  { name: 'Sudan', iso: 'SD', flag: '\u{1F1F8}\u{1F1E9}', lat: 12.86, lng: 30.22, aliases: ['SDN', 'السودان'], m49: 729 },
  { name: 'Mali', iso: 'ML', flag: '\u{1F1F2}\u{1F1F1}', lat: 17.57, lng: -4.00, aliases: ['MLI'], m49: 466 },
  { name: 'Burkina Faso', iso: 'BF', flag: '\u{1F1E7}\u{1F1EB}', lat: 12.24, lng: -1.56, aliases: ['BFA'], m49: 854 },
  { name: 'Madagascar', iso: 'MG', flag: '\u{1F1F2}\u{1F1EC}', lat: -18.77, lng: 46.87, aliases: ['MDG'], m49: 450 },
  { name: 'Niger', iso: 'NE', flag: '\u{1F1F3}\u{1F1EA}', lat: 17.61, lng: 8.08, aliases: ['NER'], m49: 562 },
  { name: 'Malawi', iso: 'MW', flag: '\u{1F1F2}\u{1F1FC}', lat: -13.25, lng: 34.30, aliases: ['MWI'], m49: 454 },
  { name: 'Rwanda', iso: 'RW', flag: '\u{1F1F7}\u{1F1FC}', lat: -1.94, lng: 29.87, aliases: ['RWA'], m49: 646 },
  { name: 'Mauritius', iso: 'MU', flag: '\u{1F1F2}\u{1F1FA}', lat: -20.35, lng: 57.55, aliases: ['MUS'], m49: 480 },
  { name: 'Namibia', iso: 'NA', flag: '\u{1F1F3}\u{1F1E6}', lat: -22.96, lng: 18.49, aliases: ['NAM'], m49: 516 },
  { name: 'Botswana', iso: 'BW', flag: '\u{1F1E7}\u{1F1FC}', lat: -22.33, lng: 24.68, aliases: ['BWA'], m49: 72 },
  { name: 'Gabon', iso: 'GA', flag: '\u{1F1EC}\u{1F1E6}', lat: -0.80, lng: 11.61, aliases: ['GAB'], m49: 266 },
  // East Asia
  { name: 'China', iso: 'CN', flag: '\u{1F1E8}\u{1F1F3}', lat: 35.86, lng: 104.20, aliases: ['CHN', 'PRC', "People's Republic of China", '中国'], m49: 156 },
  { name: 'Japan', iso: 'JP', flag: '\u{1F1EF}\u{1F1F5}', lat: 36.20, lng: 138.25, aliases: ['JPN', '日本'], m49: 392 },
  { name: 'South Korea', iso: 'KR', flag: '\u{1F1F0}\u{1F1F7}', lat: 35.91, lng: 127.77, aliases: ['KOR', 'Korea', 'Republic of Korea', '한국'], m49: 410 },
  { name: 'Taiwan', iso: 'TW', flag: '\u{1F1F9}\u{1F1FC}', lat: 23.70, lng: 120.96, aliases: ['TWN', 'Chinese Taipei'], m49: 490 },
  { name: 'Hong Kong', iso: 'HK', flag: '\u{1F1ED}\u{1F1F0}', lat: 22.40, lng: 114.11, aliases: ['HKG', 'Hong Kong SAR'], m49: 344 },
  { name: 'Mongolia', iso: 'MN', flag: '\u{1F1F2}\u{1F1F3}', lat: 46.86, lng: 103.85, aliases: ['MNG'], m49: 496 },
  // South Asia
  { name: 'India', iso: 'IN', flag: '\u{1F1EE}\u{1F1F3}', lat: 20.59, lng: 78.96, aliases: ['IND', 'Bharat'], m49: 356 },
  { name: 'Bangladesh', iso: 'BD', flag: '\u{1F1E7}\u{1F1E9}', lat: 23.68, lng: 90.36, aliases: ['BGD'], m49: 50 },
  { name: 'Pakistan', iso: 'PK', flag: '\u{1F1F5}\u{1F1F0}', lat: 30.38, lng: 69.35, aliases: ['PAK', 'پاکستان'], m49: 586 },
  { name: 'Sri Lanka', iso: 'LK', flag: '\u{1F1F1}\u{1F1F0}', lat: 7.87, lng: 80.77, aliases: ['LKA', 'Ceylon'], m49: 144 },
  { name: 'Nepal', iso: 'NP', flag: '\u{1F1F3}\u{1F1F5}', lat: 28.39, lng: 84.12, aliases: ['NPL'], m49: 524 },
  // Southeast Asia
  { name: 'Indonesia', iso: 'ID', flag: '\u{1F1EE}\u{1F1E9}', lat: -0.79, lng: 113.92, aliases: ['IDN'], m49: 360 },
  { name: 'Thailand', iso: 'TH', flag: '\u{1F1F9}\u{1F1ED}', lat: 15.87, lng: 100.99, aliases: ['THA', 'ไทย'], m49: 764 },
  { name: 'Vietnam', iso: 'VN', flag: '\u{1F1FB}\u{1F1F3}', lat: 14.06, lng: 108.28, aliases: ['VNM', 'Việt Nam'], m49: 704 },
  { name: 'Malaysia', iso: 'MY', flag: '\u{1F1F2}\u{1F1FE}', lat: 4.21, lng: 101.98, aliases: ['MYS'], m49: 458 },
  { name: 'Philippines', iso: 'PH', flag: '\u{1F1F5}\u{1F1ED}', lat: 12.88, lng: 121.77, aliases: ['PHL', 'Pilipinas'], m49: 608 },
  { name: 'Singapore', iso: 'SG', flag: '\u{1F1F8}\u{1F1EC}', lat: 1.35, lng: 103.82, aliases: ['SGP'], m49: 702 },
  { name: 'Myanmar', iso: 'MM', flag: '\u{1F1F2}\u{1F1F2}', lat: 21.91, lng: 95.96, aliases: ['MMR', 'Burma'], m49: 104 },
  { name: 'Cambodia', iso: 'KH', flag: '\u{1F1F0}\u{1F1ED}', lat: 12.57, lng: 104.99, aliases: ['KHM', 'Kampuchea'], m49: 116 },
  { name: 'Laos', iso: 'LA', flag: '\u{1F1F1}\u{1F1E6}', lat: 19.86, lng: 102.50, aliases: ['LAO'], m49: 418 },
  { name: 'Brunei', iso: 'BN', flag: '\u{1F1E7}\u{1F1F3}', lat: 4.54, lng: 114.73, aliases: ['BRN', 'Brunei Darussalam'], m49: 96 },
  // Oceania
  { name: 'Australia', iso: 'AU', flag: '\u{1F1E6}\u{1F1FA}', lat: -25.27, lng: 133.78, aliases: ['AUS', 'Oz'], m49: 36 },
  { name: 'New Zealand', iso: 'NZ', flag: '\u{1F1F3}\u{1F1FF}', lat: -40.90, lng: 174.89, aliases: ['NZL', 'Aotearoa'], m49: 554 },
  { name: 'Papua New Guinea', iso: 'PG', flag: '\u{1F1F5}\u{1F1EC}', lat: -6.31, lng: 143.96, aliases: ['PNG'], m49: 598 },
  { name: 'Fiji', iso: 'FJ', flag: '\u{1F1EB}\u{1F1EF}', lat: -17.71, lng: 178.07, aliases: ['FJI'], m49: 242 },
  // Caucasus
  { name: 'Azerbaijan', iso: 'AZ', flag: '\u{1F1E6}\u{1F1FF}', lat: 40.14, lng: 47.58, aliases: ['AZE'], m49: 31 },
  { name: 'Armenia', iso: 'AM', flag: '\u{1F1E6}\u{1F1F2}', lat: 40.07, lng: 45.04, aliases: ['ARM', 'Հայաստան'], m49: 51 },
  // Additional countries with Comtrade data (not in original 100)
  { name: 'Macao', iso: 'MO', flag: '\u{1F1F2}\u{1F1F4}', lat: 22.20, lng: 113.54, aliases: ['MAC', 'Macao SAR'], m49: 446 },
  { name: 'Togo', iso: 'TG', flag: '\u{1F1F9}\u{1F1EC}', lat: 8.62, lng: 1.21, aliases: ['TGO'], m49: 768 },
  { name: 'Benin', iso: 'BJ', flag: '\u{1F1E7}\u{1F1EF}', lat: 9.31, lng: 2.32, aliases: ['BEN'], m49: 204 },
  { name: 'Guinea', iso: 'GN', flag: '\u{1F1EC}\u{1F1F3}', lat: 9.95, lng: -9.70, aliases: ['GIN'], m49: 324 },
  { name: 'Sierra Leone', iso: 'SL', flag: '\u{1F1F8}\u{1F1F1}', lat: 8.46, lng: -11.78, aliases: ['SLE'], m49: 694 },
  { name: 'Liberia', iso: 'LR', flag: '\u{1F1F1}\u{1F1F7}', lat: 6.43, lng: -9.43, aliases: ['LBR'], m49: 430 },
  { name: 'Mauritania', iso: 'MR', flag: '\u{1F1F2}\u{1F1F7}', lat: 21.01, lng: -10.94, aliases: ['MRT'], m49: 478 },
  { name: 'Chad', iso: 'TD', flag: '\u{1F1F9}\u{1F1E9}', lat: 15.45, lng: 18.73, aliases: ['TCD', 'Tchad'], m49: 148 },
  { name: 'Republic of the Congo', iso: 'CG', flag: '\u{1F1E8}\u{1F1EC}', lat: -0.23, lng: 15.83, aliases: ['COG', 'Congo-Brazzaville'], m49: 178 },
  { name: 'Eswatini', iso: 'SZ', flag: '\u{1F1F8}\u{1F1FF}', lat: -26.52, lng: 31.47, aliases: ['SWZ', 'Swaziland'], m49: 748 },
  { name: 'Lesotho', iso: 'LS', flag: '\u{1F1F1}\u{1F1F8}', lat: -29.61, lng: 28.23, aliases: ['LSO'], m49: 426 },
  { name: 'Gambia', iso: 'GM', flag: '\u{1F1EC}\u{1F1F2}', lat: 13.44, lng: -15.31, aliases: ['GMB'], m49: 270 },
  { name: 'Cape Verde', iso: 'CV', flag: '\u{1F1E8}\u{1F1FB}', lat: 16.00, lng: -24.01, aliases: ['CPV', 'Cabo Verde'], m49: 132 },
  { name: 'Comoros', iso: 'KM', flag: '\u{1F1F0}\u{1F1F2}', lat: -11.88, lng: 43.87, aliases: ['COM'], m49: 174 },
  { name: 'Seychelles', iso: 'SC', flag: '\u{1F1F8}\u{1F1E8}', lat: -4.68, lng: 55.49, aliases: ['SYC'], m49: 690 },
  { name: 'Djibouti', iso: 'DJ', flag: '\u{1F1E9}\u{1F1EF}', lat: 11.83, lng: 42.59, aliases: ['DJI'], m49: 262 },
  { name: 'Eritrea', iso: 'ER', flag: '\u{1F1EA}\u{1F1F7}', lat: 15.18, lng: 39.78, aliases: ['ERI'], m49: 232 },
  { name: 'Burundi', iso: 'BI', flag: '\u{1F1E7}\u{1F1EE}', lat: -3.37, lng: 29.92, aliases: ['BDI'], m49: 108 },
  { name: 'Central African Republic', iso: 'CF', flag: '\u{1F1E8}\u{1F1EB}', lat: 6.61, lng: 20.94, aliases: ['CAF'], m49: 140 },
  { name: 'Somalia', iso: 'SO', flag: '\u{1F1F8}\u{1F1F4}', lat: 5.15, lng: 46.20, aliases: ['SOM'], m49: 706 },
  { name: 'South Sudan', iso: 'SS', flag: '\u{1F1F8}\u{1F1F8}', lat: 6.88, lng: 31.31, aliases: ['SSD'], m49: 728 },
  { name: 'Equatorial Guinea', iso: 'GQ', flag: '\u{1F1EC}\u{1F1F6}', lat: 1.65, lng: 10.27, aliases: ['GNQ'], m49: 226 },
  { name: 'Guinea-Bissau', iso: 'GW', flag: '\u{1F1EC}\u{1F1FC}', lat: 11.80, lng: -15.18, aliases: ['GNB'], m49: 624 },
  { name: 'São Tomé and Príncipe', iso: 'ST', flag: '\u{1F1F8}\u{1F1F9}', lat: 0.19, lng: 6.61, aliases: ['STP'], m49: 678 },
  // Caribbean / Small States
  { name: 'Barbados', iso: 'BB', flag: '\u{1F1E7}\u{1F1E7}', lat: 13.19, lng: -59.54, aliases: ['BRB'], m49: 52 },
  { name: 'Bahamas', iso: 'BS', flag: '\u{1F1E7}\u{1F1F8}', lat: 25.03, lng: -77.40, aliases: ['BHS'], m49: 44 },
  { name: 'Haiti', iso: 'HT', flag: '\u{1F1ED}\u{1F1F9}', lat: 18.97, lng: -72.29, aliases: ['HTI'], m49: 332 },
  { name: 'Saint Lucia', iso: 'LC', flag: '\u{1F1F1}\u{1F1E8}', lat: 13.91, lng: -60.98, aliases: ['LCA'], m49: 662 },
  // Additional Asia
  { name: 'Maldives', iso: 'MV', flag: '\u{1F1F2}\u{1F1FB}', lat: 3.20, lng: 73.22, aliases: ['MDV'], m49: 462 },
  { name: 'Bhutan', iso: 'BT', flag: '\u{1F1E7}\u{1F1F9}', lat: 27.51, lng: 90.43, aliases: ['BTN'], m49: 64 },
  // Pacific Islands
  { name: 'Samoa', iso: 'WS', flag: '\u{1F1FC}\u{1F1F8}', lat: -13.76, lng: -172.10, aliases: ['WSM'], m49: 882 },
  { name: 'Tonga', iso: 'TO', flag: '\u{1F1F9}\u{1F1F4}', lat: -21.18, lng: -175.20, aliases: ['TON'], m49: 776 },
  { name: 'Vanuatu', iso: 'VU', flag: '\u{1F1FB}\u{1F1FA}', lat: -15.38, lng: 166.96, aliases: ['VUT'], m49: 548 },
  { name: 'Solomon Islands', iso: 'SB', flag: '\u{1F1F8}\u{1F1E7}', lat: -9.65, lng: 160.16, aliases: ['SLB'], m49: 90 },
  { name: 'Kiribati', iso: 'KI', flag: '\u{1F1F0}\u{1F1EE}', lat: 1.87, lng: -157.36, aliases: ['KIR'], m49: 296 },
  // Europe (more)
  { name: 'Kosovo', iso: 'XK', flag: '\u{1F1FD}\u{1F1F0}', lat: 42.60, lng: 20.90, aliases: ['XKX'], m49: 412 },
  { name: 'Andorra', iso: 'AD', flag: '\u{1F1E6}\u{1F1E9}', lat: 42.55, lng: 1.60, aliases: ['AND'], m49: 20 },
];

// =============================================================================
// HS2 → Sector mapping
// =============================================================================

const HS2_TO_SECTOR: Record<string, Sector> = {
  // Energy
  '27': 'energy',
  // Minerals
  '25': 'minerals', '26': 'minerals', '71': 'minerals',
  // Agriculture (live animals, raw plants, wood)
  '01': 'agriculture', '05': 'agriculture', '06': 'agriculture',
  '07': 'agriculture', '08': 'agriculture', '09': 'agriculture',
  '10': 'agriculture', '11': 'agriculture', '12': 'agriculture',
  '13': 'agriculture', '14': 'agriculture',
  '44': 'agriculture', '45': 'agriculture', '46': 'agriculture', '47': 'agriculture',
  // Food (meat, fish, dairy, processed food, beverages, tobacco)
  '02': 'food', '03': 'food', '04': 'food',
  '15': 'food', '16': 'food', '17': 'food', '18': 'food',
  '19': 'food', '20': 'food', '21': 'food', '22': 'food',
  '23': 'food', '24': 'food',
  // Chemicals (incl. pharma, plastics, rubber)
  '28': 'chemicals', '29': 'chemicals', '30': 'chemicals',
  '31': 'chemicals', '32': 'chemicals', '33': 'chemicals',
  '34': 'chemicals', '35': 'chemicals', '36': 'chemicals',
  '37': 'chemicals', '38': 'chemicals', '39': 'chemicals', '40': 'chemicals',
  // Textiles (leather, furs, fabrics, clothing, footwear)
  '41': 'textiles', '42': 'textiles', '43': 'textiles',
  '50': 'textiles', '51': 'textiles', '52': 'textiles',
  '53': 'textiles', '54': 'textiles', '55': 'textiles',
  '56': 'textiles', '57': 'textiles', '58': 'textiles',
  '59': 'textiles', '60': 'textiles', '61': 'textiles',
  '62': 'textiles', '63': 'textiles', '64': 'textiles',
  '65': 'textiles', '66': 'textiles', '67': 'textiles',
  // Electronics
  '85': 'electronics',
  // Vehicles (rail, road, air, ships)
  '86': 'vehicles', '87': 'vehicles', '88': 'vehicles', '89': 'vehicles',
  // Metals (stone, ceramics, glass, base metals)
  '68': 'metals', '69': 'metals', '70': 'metals',
  '72': 'metals', '73': 'metals', '74': 'metals',
  '75': 'metals', '76': 'metals', '78': 'metals',
  '79': 'metals', '80': 'metals', '81': 'metals',
  '82': 'metals', '83': 'metals',
  // Everything else → 'other' (84 machinery, 48-49 paper, 90-97 instruments/furniture/art)
};

function getSector(hs2Code: string): Sector {
  return HS2_TO_SECTOR[hs2Code] || 'other';
}

// =============================================================================
// HS2 → Friendly product names
// =============================================================================

const HS2_FRIENDLY_NAMES: Record<string, string> = {
  '01': 'Live Animals',
  '02': 'Meat',
  '03': 'Fish & Seafood',
  '04': 'Dairy & Eggs',
  '05': 'Animal Products',
  '06': 'Live Plants & Flowers',
  '07': 'Vegetables',
  '08': 'Fruit & Nuts',
  '09': 'Coffee, Tea & Spices',
  '10': 'Cereals',
  '11': 'Milling Products',
  '12': 'Oil Seeds',
  '13': 'Gums & Resins',
  '14': 'Vegetable Materials',
  '15': 'Fats & Oils',
  '16': 'Prepared Meat & Fish',
  '17': 'Sugars',
  '18': 'Cocoa',
  '19': 'Cereal Preparations',
  '20': 'Prepared Vegetables & Fruit',
  '21': 'Miscellaneous Food',
  '22': 'Beverages & Spirits',
  '23': 'Animal Feed',
  '24': 'Tobacco',
  '25': 'Salt, Stone & Cement',
  '26': 'Ores & Slag',
  '27': 'Mineral Fuels & Oils',
  '28': 'Inorganic Chemicals',
  '29': 'Organic Chemicals',
  '30': 'Pharmaceuticals',
  '31': 'Fertilizers',
  '32': 'Dyes & Pigments',
  '33': 'Perfumery & Cosmetics',
  '34': 'Soap & Cleaning Products',
  '35': 'Enzymes & Starches',
  '36': 'Explosives',
  '37': 'Photographic Goods',
  '38': 'Chemical Products',
  '39': 'Plastics',
  '40': 'Rubber',
  '41': 'Leather',
  '42': 'Leather Goods',
  '43': 'Furskins',
  '44': 'Wood Products',
  '45': 'Cork Products',
  '46': 'Straw & Plaiting',
  '47': 'Wood Pulp',
  '48': 'Paper & Paperboard',
  '49': 'Printed Books & Media',
  '50': 'Silk',
  '51': 'Wool & Animal Hair',
  '52': 'Cotton',
  '53': 'Vegetable Fibers',
  '54': 'Synthetic Filaments',
  '55': 'Synthetic Staple Fibers',
  '56': 'Nonwovens & Cordage',
  '57': 'Carpets',
  '58': 'Special Woven Fabrics',
  '59': 'Coated Textiles',
  '60': 'Knitted Fabrics',
  '61': 'Knitted Apparel',
  '62': 'Woven Apparel',
  '63': 'Textile Articles',
  '64': 'Footwear',
  '65': 'Headgear',
  '66': 'Umbrellas',
  '67': 'Feathers & Artificial Flowers',
  '68': 'Stone & Cement Articles',
  '69': 'Ceramics',
  '70': 'Glass & Glassware',
  '71': 'Precious Stones & Metals',
  '72': 'Iron & Steel',
  '73': 'Iron & Steel Articles',
  '74': 'Copper',
  '75': 'Nickel',
  '76': 'Aluminum',
  '78': 'Lead',
  '79': 'Zinc',
  '80': 'Tin',
  '81': 'Other Base Metals',
  '82': 'Metal Tools & Cutlery',
  '83': 'Metal Products',
  '84': 'Machinery',
  '85': 'Electrical Equipment',
  '86': 'Railway Equipment',
  '87': 'Vehicles',
  '88': 'Aircraft & Spacecraft',
  '89': 'Ships & Boats',
  '90': 'Optical & Medical Instruments',
  '91': 'Clocks & Watches',
  '92': 'Musical Instruments',
  '93': 'Arms & Ammunition',
  '94': 'Furniture',
  '95': 'Toys & Sports Equipment',
  '96': 'Miscellaneous Manufactures',
  '97': 'Art & Antiques',
  '99': 'Unspecified Commodities',
};

// =============================================================================
// API helpers
// =============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = 2): Promise<Response | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        console.warn(`    Rate limited, waiting 2s...`);
        await sleep(2000);
        continue;
      }
      return response;
    } catch (err) {
      console.warn(`    Network error (attempt ${attempt + 1}): ${err}`);
      if (attempt < retries) await sleep(2000);
    }
  }
  return null;
}

async function fetchCountryExports(
  m49Code: number,
  years: number[] = [2023, 2022, 2021],
): Promise<{ data: ComtradeRecord[]; year: number } | null> {
  for (const year of years) {
    const url =
      `https://comtradeapi.un.org/public/v1/preview/C/A/HS` +
      `?reporterCode=${m49Code}&period=${year}&flowCode=X` +
      `&partnerCode=0&cmdCode=AG2&includeDesc=true&breakdownMode=classic`;

    const response = await fetchWithRetry(url);
    if (!response || !response.ok) continue;

    const json: ComtradeResponse = await response.json();
    if (json.count > 0 && json.data && json.data.length > 0) {
      return { data: json.data, year };
    }
  }
  return null;
}

// =============================================================================
// Data transformation
// =============================================================================

function transformExports(records: ComtradeRecord[]): {
  exports: ExportProduct[];
  totalExports: number;
} {
  // Filter out code 99 (unspecified) and records with no value
  const filtered = records.filter(
    (r) => r.cmdCode !== '99' && r.primaryValue != null && r.primaryValue > 0,
  );

  // Total from all classified products
  const totalRaw = filtered.reduce((sum, r) => sum + (r.primaryValue || 0), 0);
  const totalExports = Math.round(totalRaw / 1_000_000);

  // Top 12 by value
  const sorted = [...filtered].sort((a, b) => (b.primaryValue || 0) - (a.primaryValue || 0)).slice(0, 12);

  const exports: ExportProduct[] = sorted.map((record) => {
    const valueMillions = Math.max(1, Math.round((record.primaryValue || 0) / 1_000_000));
    const percentage =
      totalRaw > 0
        ? parseFloat((((record.primaryValue || 0) / totalRaw) * 100).toFixed(1))
        : 0;

    return {
      name: HS2_FRIENDLY_NAMES[record.cmdCode] || (record.cmdDesc ? record.cmdDesc.split(';')[0].trim() : `HS ${record.cmdCode}`),
      value: valueMillions,
      percentage: Math.max(percentage, 0.1),
      sector: getSector(record.cmdCode),
    };
  });

  return { exports, totalExports };
}

// =============================================================================
// Output writer
// =============================================================================

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

interface CountryResult {
  geo: GeoData;
  exports: ExportProduct[];
  totalExports: number;
  source: 'api' | 'skipped';
  year?: number;
}

function writeCountriesFile(outputPath: string, results: CountryResult[]): void {
  const lines: string[] = [];

  // Determine the most common data year
  const yearCounts = new Map<number, number>();
  for (const r of results) {
    if (r.year) yearCounts.set(r.year, (yearCounts.get(r.year) || 0) + 1);
  }
  const dataYear = [...yearCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 2023;
  const updateDate = new Date().toISOString().split('T')[0];

  lines.push(`// Auto-generated from UN Comtrade API — do not edit manually`);
  lines.push(`// Run: npm run fetch-trade-data`);
  lines.push(``);
  lines.push(`export const dataInfo = { updatedAt: '${updateDate}', dataYear: ${dataYear} };`);
  lines.push(``);
  lines.push(`export interface ExportProduct {`);
  lines.push(`  name: string;`);
  lines.push(`  value: number;`);
  lines.push(`  percentage: number;`);
  lines.push(`  sector: 'energy' | 'minerals' | 'agriculture' | 'textiles' | 'electronics' | 'vehicles' | 'chemicals' | 'metals' | 'food' | 'other';`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface Country {`);
  lines.push(`  name: string;`);
  lines.push(`  iso: string;`);
  lines.push(`  flag: string;`);
  lines.push(`  lat: number;`);
  lines.push(`  lng: number;`);
  lines.push(`  aliases: string[];`);
  lines.push(`  exports: ExportProduct[];`);
  lines.push(`  totalExports: number;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const countries: Country[] = [`);

  for (const entry of results) {
    const { geo, exports: exps, totalExports } = entry;
    const aliasStr = geo.aliases.map((a) => `'${escapeString(a)}'`).join(', ');

    lines.push(`  {`);
    lines.push(`    name: '${escapeString(geo.name)}',`);
    lines.push(`    iso: '${geo.iso}',`);
    lines.push(`    flag: '${geo.flag}',`);
    lines.push(`    lat: ${geo.lat},`);
    lines.push(`    lng: ${geo.lng},`);
    lines.push(`    aliases: [${aliasStr}],`);
    lines.push(`    totalExports: ${totalExports},`);
    lines.push(`    exports: [`);
    for (const exp of exps) {
      lines.push(`      { name: '${escapeString(exp.name)}', value: ${exp.value}, percentage: ${exp.percentage}, sector: '${exp.sector}' },`);
    }
    lines.push(`    ],`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const outputPath = path.resolve(__dirname, '..', 'lib', 'data', 'countries.ts');

  console.log(`Fetching export data for ${COUNTRIES.length} countries from UN Comtrade...`);
  console.log(`Output: ${outputPath}`);
  console.log(``);

  const results: CountryResult[] = [];
  let apiCount = 0;
  let skipCount = 0;

  for (let i = 0; i < COUNTRIES.length; i++) {
    const geo = COUNTRIES[i];
    const progress = `[${i + 1}/${COUNTRIES.length}]`;

    process.stdout.write(`${progress} ${geo.name} (${geo.iso}) M49=${geo.m49}... `);

    const apiResult = await fetchCountryExports(geo.m49);

    if (apiResult && apiResult.data.length > 0) {
      const { exports: exps, totalExports } = transformExports(apiResult.data);

      if (exps.length >= 3 && totalExports > 0) {
        results.push({
          geo,
          exports: exps,
          totalExports,
          source: 'api',
          year: apiResult.year,
        });
        console.log(`${exps.length} products, $${totalExports}M (${apiResult.year})`);
        apiCount++;
      } else {
        console.log(`insufficient data (${exps.length} products), skipping`);
        skipCount++;
      }
    } else {
      console.log(`no data, skipping`);
      skipCount++;
    }

    // Rate limit: slightly over 1 req/sec
    await sleep(1100);
  }

  // Sort by totalExports descending
  results.sort((a, b) => b.totalExports - a.totalExports);

  writeCountriesFile(outputPath, results);

  console.log(``);
  console.log(`Done!`);
  console.log(`  ${apiCount} countries with API data`);
  console.log(`  ${skipCount} countries skipped (no data)`);
  console.log(`  Output: ${outputPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
