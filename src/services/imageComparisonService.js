/**
 * Service for comparing Pokemon card images with emphasis on style differences
 */

/**
 * Calculates a similarity score between two cards with heavy penalties for style differences
 * @param {Object} card1 The first card to compare
 * @param {Object} card2 The second card to compare
 * @returns {number} Similarity score from 0-100, where 100 is identical
 */
export const compareCards = (card1, card2) => {
  let score = 100;
  
  // Base comparison checks
  if (!card1 || !card2) {
    return 0;
  }

  // Heavy penalties for style differences
  if (card1.style !== card2.style) {
    // Style differences (holo vs non-holo, reverse holo, etc)
    score -= 40;
  }

  if (card1.numberColor !== card2.numberColor) {
    // Card number color differences
    score -= 35;
  }

  if (card1.set !== card2.set) {
    // Set differences
    score -= 30;
  }

  // Additional condition checks
  if (card1.condition !== card2.condition) {
    score -= 15;
  }

  // Surface quality differences
  if (Math.abs((card1.surfaceQuality || 0) - (card2.surfaceQuality || 0)) > 0.2) {
    score -= 20;
  }

  // Centering differences
  if (Math.abs((card1.centering || 0) - (card2.centering || 0)) > 0.2) {
    score -= 15;
  }

  // Edge wear differences
  if (Math.abs((card1.edgeWear || 0) - (card2.edgeWear || 0)) > 0.2) {
    score -= 15;
  }

  // Ensure score doesn't go below 0
  return Math.max(0, score);
};

/**
 * Analyzes a card's visual characteristics
 * @param {Object} cardData The card data including image analysis results
 * @returns {Object} Extracted card characteristics
 */
export const analyzeCardCharacteristics = (cardData) => {
  return {
    style: detectCardStyle(cardData),
    numberColor: detectNumberColor(cardData),
    set: cardData.set,
    condition: evaluateCondition(cardData),
    surfaceQuality: evaluateSurfaceQuality(cardData),
    centering: evaluateCentering(cardData),
    edgeWear: evaluateEdgeWear(cardData)
  };
};

// Helper functions for characteristic detection
const detectCardStyle = (cardData) => {
  // Implement logic to detect if card is holo, reverse holo, etc
  // This would use image analysis to detect reflective patterns
  return cardData.style || 'normal';
};

const detectNumberColor = (cardData) => {
  // Implement logic to detect the color of the card number
  // This would analyze the specific region where the number appears
  return cardData.numberColor || 'black';
};

const evaluateCondition = (cardData) => {
  // Implement logic to evaluate overall card condition
  return cardData.condition || 'near mint';
};

const evaluateSurfaceQuality = (cardData) => {
  // Implement logic to evaluate surface scratches, print quality, etc
  return cardData.surfaceQuality || 1.0;
};

const evaluateCentering = (cardData) => {
  // Implement logic to evaluate card centering
  return cardData.centering || 1.0;
};

const evaluateEdgeWear = (cardData) => {
  // Implement logic to evaluate edge wear and whitening
  return cardData.edgeWear || 1.0;
};
