/**
 * Test Anthropic Claude API directly
 * Run with: node test-claude-api.js
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const API_KEY = process.env.VITE_ANTHROPIC_API_KEY || "sk-ant-your-key-here";

// Create a simple test image (1x1 pixel red PNG - base64)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

const client = new Anthropic({ apiKey: API_KEY });

const systemPrompt = `You are an expert master carpenter. Analyze furniture images and create detailed, practical woodworking plans in valid JSON format.

When given an image, you must:
1. Analyze the furniture piece in detail
2. Create a comprehensive cut list with exact dimensions
3. Estimate realistic material costs and retail price
4. Provide step-by-step assembly instructions
5. Return ONLY valid JSON matching the exact schema provided

Always return valid JSON - never include markdown, code blocks, or explanations.`;

const userPrompt = `Analyze this furniture image and create a detailed woodworking plan.

CONFIGURATION:
1. Use IMPERIAL units (Inches, Feet).
2. Difficulty Level: Intermediate.
3. Primary Material Preference: Oak/Hardwood.

Return ONLY this JSON structure (no markdown, no extra text):
{
  "title": "Furniture name",
  "description": "Detailed description",
  "estimatedCost": "$50-75",
  "estimatedRetailPrice": "$800",
  "estimatedTime": "4-6 hours",
  "overallDimensions": {
    "height": "36\\"",
    "width": "24\\"",
    "depth": "12\\""
  },
  "shoppingList": ["2x4 lumber...", "Screws..."],
  "cutList": [
    {
      "partName": "Leg",
      "quantity": 4,
      "thickness": "3/4\\"",
      "width": "2\\"",
      "length": "36\\"",
      "material": "Oak",
      "notes": "Cut at 90 degrees"
    }
  ],
  "assemblySteps": [
    {
      "stepNumber": 1,
      "instruction": "Cut all pieces..."
    }
  ]
}`;

async function testClaude() {
  try {
    console.log('🚀 Testing Anthropic Claude API...');
    console.log('📍 Model: claude-3-5-sonnet-20241022');
    console.log('');

    console.log('📤 Sending request...');
    const startTime = Date.now();

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: testImageBase64,
              },
            },
            {
              type: "text",
              text: userPrompt,
            },
          ],
        },
      ],
    });

    const elapsed = Date.now() - startTime;
    console.log(`⏱️  Response received in ${elapsed}ms`);
    console.log('');

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      console.error('❌ No text content in response');
      process.exit(1);
    }

    const responseText = textContent.text;
    console.log('📝 Response (first 500 chars):');
    console.log(responseText.substring(0, 500));
    console.log('');

    // Try to parse JSON
    try {
      const plan = JSON.parse(responseText);
      console.log('✅ Successfully parsed JSON plan!');
      console.log(`📋 Plan title: "${plan.title}"`);
      console.log(`💰 Cost: ${plan.estimatedCost} → Retail: ${plan.estimatedRetailPrice}`);
      console.log(`⏱️  Time: ${plan.estimatedTime}`);
      console.log(`🪚 Cut list items: ${plan.cutList?.length || 0}`);
      console.log(`📦 Shopping list items: ${plan.shoppingList?.length || 0}`);
      console.log(`🔨 Assembly steps: ${plan.assemblySteps?.length || 0}`);
      console.log('');
      console.log('✅ Claude is working correctly!');
    } catch (parseErr) {
      console.error('❌ Failed to parse response as JSON');
      console.log('Full response:', responseText);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ API Error:', error.message);
    process.exit(1);
  }
}

testClaude();
