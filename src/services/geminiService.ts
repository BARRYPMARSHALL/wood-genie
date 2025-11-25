import Anthropic from "@anthropic-ai/sdk";
import { WoodworkingPlan, UnitSystem, Difficulty, WoodType } from "../types";

const getAIClient = () => {
  // @ts-ignore - Vite provides import.meta.env
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  if (!apiKey) throw new Error('Anthropic API key not configured (VITE_ANTHROPIC_API_KEY)');
  return new Anthropic({ apiKey });
};

export async function generatePlanFromImage(
  base64Image: string,
  units: UnitSystem,
  difficulty: Difficulty,
  woodType: WoodType
): Promise<WoodworkingPlan & { svgBlueprint?: string }> {
  try {
    const client = getAIClient();
    const model = "claude-opus-4-1-20250805";

    // Extract MIME type from data URI if present
    const match = base64Image.match(/^data:(.+);base64,(.+)$/);
    const mimeType = match ? match[1] : "image/jpeg";
    const data = match ? match[2] : base64Image;

    console.log(`📤 Image details: mimeType=${mimeType}, dataLength=${data.length}`);

    const unitInstructions = units === 'imperial'
      ? "Use IMPERIAL units (Inches, Feet). Assume standard US lumber sizes (e.g., 2x4 is 1.5x3.5 inch)."
      : "Use METRIC units (Millimeters). Assume standard European structural timber sizes (e.g., 45x95mm).";

    const difficultyInstructions = difficulty === 'Beginner'
      ? "Keep it very simple. Use only basic cuts (90 degree) and screws/glue. Avoid complex joinery like mortise & tenon."
      : difficulty === 'Advanced'
      ? "Use professional joinery techniques (dadoes, rabbets, or pocket holes) appropriate for high-quality furniture."
      : "Balance durability with ease of build. Pocket holes are acceptable.";

    const materialInstructions = `Primary Material Preference: ${woodType}. Base cost estimates on this material price.`;

    const systemPrompt = `You are an expert master carpenter. Analyze furniture images and create detailed, practical woodworking plans in valid JSON format.

When given an image and configuration, you must:
1. Analyze the furniture piece in detail
2. Create a comprehensive cut list with exact dimensions
3. Estimate realistic material costs and retail price
4. Provide step-by-step assembly instructions
5. Return ONLY valid JSON matching the exact schema provided

Always return valid JSON - never include markdown, code blocks, or explanations.`;

    const userPrompt = `Analyze this furniture image and create a detailed woodworking plan.

CONFIGURATION:
1. ${unitInstructions}
2. Difficulty Level: ${difficulty}. ${difficultyInstructions}
3. ${materialInstructions}

Estimate the cost of materials (Lumber + Screws + Hardware) vs the cost of buying this item new (Retail Price).
Make the Retail Price realistic for a high-end store (e.g. West Elm/Pottery Barn) to highlight savings.

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
  "shoppingList": ["2x4 lumber...", "Screws...", "Wood glue..."],
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
      "instruction": "Cut all pieces according to the cut list..."
    }
  ]
}`;

    console.log('📡 Calling Claude API with vision...');
    const startTime = performance.now();

    const response = await client.messages.create({
      model: model,
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
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: data,
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

    const elapsed = performance.now() - startTime;
    console.log(`⏱️  API response received in ${elapsed.toFixed(0)}ms`);

    // Extract text from response
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      console.error('❌ No text content in response');
      throw new Error("No text response from Claude API");
    }

    const responseText = textContent.text;
    console.log('📝 Response text (first 300 chars):', responseText.substring(0, 300));

    // Try to extract JSON from response (in case it's wrapped in markdown)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
      console.log('✅ Extracted JSON from markdown block');
    } else {
      // Try to find JSON object directly
      const directMatch = responseText.match(/\{[\s\S]*\}/);
      if (directMatch) {
        jsonStr = directMatch[0];
        console.log('✅ Found direct JSON object');
      }
    }

    const plan = JSON.parse(jsonStr) as WoodworkingPlan;
    console.log('✅ Successfully parsed plan:', plan.title);
    return plan;

  } catch (error) {
    console.error('❌ Error generating plan:', error);
    console.log('⚠️  Falling back to demo result...');
    return generateDemoResult(units, difficulty, woodType);
  }
}

function generateDemoResult(
  units: UnitSystem,
  difficulty: Difficulty,
  woodType: WoodType
): WoodworkingPlan {
  console.log('🔴 WARNING: Using DEMO DATA, not API results');

  const height = units === 'imperial' ? '36"' : '900mm';
  const width = units === 'imperial' ? '24"' : '600mm';
  const depth = units === 'imperial' ? '12"' : '300mm';

  const costRange = difficulty === 'Beginner' ? '$45-60' : difficulty === 'Intermediate' ? '$80-120' : '$150-250';
  const retailPrice = difficulty === 'Beginner' ? '$300' : difficulty === 'Intermediate' ? '$800' : '$1500';
  const timeEstimate = difficulty === 'Beginner' ? '3-4 hours' : difficulty === 'Intermediate' ? '6-8 hours' : '12-16 hours';

  return {
    title: 'Modern Wooden Shelf Unit',
    description: `A versatile ${woodType} shelf perfect for storing books, plants, and decorative items. Designed for ${difficulty} skill level.`,
    estimatedCost: costRange,
    estimatedRetailPrice: retailPrice,
    estimatedTime: timeEstimate,
    overallDimensions: {
      height,
      width,
      depth,
    },
    shoppingList: [
      `${woodType} lumber - 8ft - qty 4 - $8-12 each`,
      'Wood screws 2.5 inch - 1 box - $5',
      'Wood glue - 1 bottle - $4',
      'Sandpaper assortment - 1 pack - $6',
      'Wood stain or paint - 1 quart - $8-15',
      'Mounting hardware - 1 set - $10',
    ],
    cutList: [
      {
        partName: 'Vertical Supports',
        quantity: 2,
        thickness: units === 'imperial' ? '3/4"' : '19mm',
        width: units === 'imperial' ? '8"' : '200mm',
        length: units === 'imperial' ? '36"' : '900mm',
        material: woodType,
        notes: 'Sand smooth after cutting',
      },
      {
        partName: 'Horizontal Shelves',
        quantity: 3,
        thickness: units === 'imperial' ? '3/4"' : '19mm',
        width: units === 'imperial' ? '8"' : '200mm',
        length: units === 'imperial' ? '24"' : '600mm',
        material: woodType,
        notes: 'Ensure all edges are flush',
      },
      {
        partName: 'Back Panel',
        quantity: 1,
        thickness: units === 'imperial' ? '1/2"' : '12mm',
        width: units === 'imperial' ? '24"' : '600mm',
        length: units === 'imperial' ? '36"' : '900mm',
        material: 'Plywood',
        notes: 'Optional for additional support',
      },
    ],
    assemblySteps: [
      { stepNumber: 1, instruction: 'Cut all pieces according to the cut list. Sand all surfaces smooth with 120-grit sandpaper.' },
      { stepNumber: 2, instruction: 'Drill pilot holes to prevent wood splitting.' },
      { stepNumber: 3, instruction: 'Apply wood glue to all joining surfaces.' },
      { stepNumber: 4, instruction: 'Assemble shelves to vertical supports using screws or dowels.' },
      { stepNumber: 5, instruction: 'Attach back panel if desired for extra stability.' },
      { stepNumber: 6, instruction: `Apply ${woodType === 'Reclaimed Wood' ? 'clear seal' : 'stain or paint'} and let dry completely.` },
      { stepNumber: 7, instruction: 'Mount to wall using appropriate hardware for your wall type.' },
    ],
  };
}
