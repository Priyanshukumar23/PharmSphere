import { Decimal } from "decimal.js";

export type Dimension = "MASS" | "VOLUME" | "COUNT";
export type DisplayUnit = "g" | "kg" | "mL" | "L" | "item";

// Conversion factors to BASE UNIT
// MASS base: g
// VOLUME base: mL
// COUNT base: item
const CONVERSION_FACTORS: Record<DisplayUnit, number> = {
  g: 1,
  kg: 1000,
  mL: 1,
  L: 1000,
  item: 1,
};

const VALID_UNITS_FOR_DIMENSION: Record<Dimension, DisplayUnit[]> = {
  MASS: ["g", "kg"],
  VOLUME: ["mL", "L"],
  COUNT: ["item"],
};

export const getValidUnits = (dimension: Dimension): DisplayUnit[] => {
  return VALID_UNITS_FOR_DIMENSION[dimension];
};

/**
 * Converts a display quantity (e.g., 5 kg) into base quantity (5000 g)
 */
export const toBaseQuantity = (displayQuantity: number | string, unit: DisplayUnit): Decimal => {
  const factor = CONVERSION_FACTORS[unit];
  if (!factor) throw new Error(`Unknown unit: ${unit}`);
  
  const val = new Decimal(displayQuantity);
  return val.mul(factor);
};

/**
 * Converts a base quantity (e.g., 5000 g) back to display quantity (5 kg)
 */
export const toDisplayQuantity = (baseQuantity: Decimal | string | number, unit: DisplayUnit): Decimal => {
  const factor = CONVERSION_FACTORS[unit];
  if (!factor) throw new Error(`Unknown unit: ${unit}`);
  
  const val = new Decimal(baseQuantity);
  return val.div(factor);
};

/**
 * Calculates the total cost based on the exact base quantity and base price.
 */
export const calculateTotal = (baseQuantity: Decimal, pricePerBaseUnit: Decimal): Decimal => {
  return baseQuantity.mul(pricePerBaseUnit);
};

/**
 * Formats a Decimal to exactly 2 decimal places for INR UI display.
 */
export const formatInr = (amount: Decimal | string | number): string => {
  const val = new Decimal(amount);
  return `₹${val.toFixed(2)}`;
};

/**
 * Safe conversion parsing from client strings
 */
export const parseQuantity = (val: string): number => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};
