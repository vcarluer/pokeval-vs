import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  dangerouslyAllowBrowser: true
});

const isDataUrl = (str) => str.startsWith('data:image/');
const isHttpUrl = (str) => str.startsWith('http://') || str.startsWith('https://');

export const analyzeImage = async (base64Image) => {
  try {
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content: "Extract Pokemon card details and return as JSON. Pokemon name must be in English, without any subtype in the name. Return subtype and HP separately."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this Pokemon card and return JSON with format: {\"name\":\"english_name\",\"subtype\":\"\",\"hp\":\"\"}"
            },
            {
              type: "image_url",
              image_url: {
                url: isDataUrl(base64Image) ? base64Image : `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: config.openai.maxTokens,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing image with OpenAI:', error);
    throw error;
  }
};

export const compareImages = async (image1, image2) => {
  try {
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content: `Compare Pokemon cards and return comparison as JSON with weighted penalties for differences.

          Scoring System:
          Start with 100 points and apply penalties based on differences found:

          CRITICAL DIFFERENCES (Each can reduce up to 25 points):
          - Card style differences (holo vs non-holo): -25 points
          - Number color differences (gold vs silver): -25 points
          - Set symbol differences: -25 points
          
          MAJOR DIFFERENCES (Each can reduce up to 15 points):
          - Different artwork: -15 points
          - Different HP values: -15 points
          - Different card frame: -15 points
          
          MINOR DIFFERENCES (Each can reduce up to 5 points):
          - Card condition variations: -5 points
          - Print quality differences: -5 points
          - Minor centering issues: -5 points
          
          Rules:
          1. The final score must never go below 0
          2. Perfect matches should score 95-100
          3. Cards with any critical difference should score no higher than 75
          4. Cards with multiple critical differences should score no higher than 40
          5. The sum of penalties should match the final score reduction from 100
          
          Return in format: {
            "areSimilar": bool,
            "similarityScore": 0-100,
            "differences": [
              {
                "description": "Different card style (holo vs non-holo)",
                "impact": "Critical",
                "penaltyApplied": -25
              }
            ],
            "confidence": 0-100,
            "totalPenalties": -X (sum of all penaltyApplied values)
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Compare these two Pokemon cards. The first image is the user's reference card. Pay special attention to card style (holo patterns), number colors, and set symbols."
            },
            {
              type: "image_url",
              image_url: {
                url: isDataUrl(image1) ? image1 : 
                     isHttpUrl(image1) ? image1 : 
                     `data:image/jpeg;base64,${image1}`
              }
            },
            {
              type: "image_url",
              image_url: {
                url: isDataUrl(image2) ? image2 : 
                     isHttpUrl(image2) ? image2 : 
                     `data:image/jpeg;base64,${image2}`
              }
            }
          ]
        }
      ],
      max_tokens: config.openai.maxTokens,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Ensure the similarity score matches the penalties
    const totalPenalties = result.differences.reduce((sum, diff) => sum + (diff.penaltyApplied || 0), 0);
    const calculatedScore = Math.max(0, Math.min(100, 100 + totalPenalties));
    
    return {
      ...result,
      similarityScore: calculatedScore,
      totalPenalties
    };
  } catch (error) {
    console.error('Error comparing images with OpenAI:', error);
    throw error;
  }
};
