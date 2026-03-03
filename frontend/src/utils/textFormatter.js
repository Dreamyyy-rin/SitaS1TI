/**
 * Utility functions for text formatting
 */

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} text - The text to capitalize
 * @returns {string} - The text with each word capitalized
 */
export const toTitleCase = (text) => {
  if (!text) return text;

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
