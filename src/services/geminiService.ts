import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WoodworkingPlan, UnitSystem, Difficulty, WoodType } from "../types";

const getAIClient = () => {
  // @ts-ignore - Vite provides import.meta.env
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
  if (!apiKey) throw new Error('Gemini API key not configured (VITE_API_KEY)');
  return new GoogleGenAI({ apiKey });
};

const planSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    estimatedCost: { type: Type.STRING },
    estimatedRetailPrice: { type: Type.STRING },
    estimatedTime: { type: Type.STRING },
    overallDimensions: {
      type: Type.OBJECT,
      properties: {
        height: { type: Type.STRING },
        width: { type: Type.STRING },
        depth: { type: Type.STRING },
      },
      required: ["height", "width", "depth"],
    },
    shoppingList: { type: Type.ARRAY, items: { type: Type.STRING } },
    cutList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          partName: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          thickness: { type: Type.STRING },
          width: { type: Type.STRING },
          length: { type: Type.STRING },
          material: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
      },
    },
    assemblySteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING },
        },
      },
    },
    svgBlueprint: { type: Type.STRING },
  },
};

export async function generatePlanFromImage(
  base64Image: string,
  units: UnitSystem,
  difficulty: Difficulty,
  woodType: WoodType
): Promise<WoodworkingPlan & { svgBlueprint?: string }> {
  try {
    const ai = getAIClient();
    const model = "gemini-2.5-flash";

    const match = base64Image.match(/^data:(.+);base64,(.+)$/);
    const mimeType = match ? match[1] : "image/jpeg";
    const data = match ? match[2] : base64Image;

    const unitInstructions = units === 'imperial'
      ? "Use IMPERIAL units (Inches, Feet). Assume standard US lumber sizes (e.g., 2x4 is 1.5x3.5 inch)."
      : "Use METRIC units (Millimeters). Assume standard European timber sizes (e.g., 45x95mm).";

    const prompt = `Analyze this furniture photo and produce a structured woodworking plan in JSON.\nUNITS: ${units}\nSKILL: ${difficulty}\nMATERIAL: ${woodType}\n${unitInstructions}\nRespond strictly as JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: planSchema,
        systemInstruction: 'You are an expert carpenter. Return only JSON matching schema.',
      },
    });

    if (!response.text) throw new Error('No response from Gemini');
    const plan = JSON.parse(response.text) as any;
    return plan as WoodworkingPlan & { svgBlueprint?: string };
  } catch (err) {
    console.error('geminiService error:', err);
    // Fallback demo plan
    return {
      title: 'Demo Shelf Unit',
      description: 'Demo plan used because AI request failed.',
      estimatedCost: '$50',
      estimatedTime: '3-4 hours',
      estimatedRetailPrice: '$800',
      overallDimensions: { height: '900mm', width: '600mm', depth: '300mm' },
      shoppingList: ['2x4 x6', 'Wood screws', 'Wood glue'],
      cutList: [
        { partName: 'Side', quantity: 2, thickness: '18mm', width: '300mm', length: '900mm', material: 'Plywood' },
        { partName: 'Shelf', quantity: 3, thickness: '18mm', width: '560mm', length: '280mm', material: 'Plywood' },
      ],
      assemblySteps: [
        { stepNumber: 1, instruction: 'Cut all pieces to size.' },
        { stepNumber: 2, instruction: 'Assemble sides and shelves using screws and glue.' },
      ],
      svgBlueprint: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect x="10" y="20" width="180" height="260" fill="none" stroke="#333"/></svg>',
    };
  }
}
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WoodworkingPlan, UnitSystem, Difficulty, WoodType } from "../types";

// Initialize Gemini AI
const getAIClient = () => {
  // @ts-ignore - import.meta is available at runtime in Vite
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('Gemini API key not configured (VITE_API_KEY)');
  }
  return new GoogleGenAI({ apiKey });
};

// Define the response schema for structured output
const planSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative title for the woodworking project" },
    description: { type: Type.STRING, description: "A brief summary of the build style and utility" },
    estimatedCost: { type: Type.STRING, description: "Estimated range for raw materials, e.g. '$40 - $60'" },
    estimatedTime: { type: Type.STRING, description: "Estimated build time, e.g. '3-4 Hours'" },
    estimatedRetailPrice: { type: Type.STRING, description: "Estimated price if bought in a store, e.g. '$800'" },
    overallDimensions: {
      type: Type.OBJECT,
      properties: {
        height: { type: Type.STRING },
        width: { type: Type.STRING },
        depth: { type: Type.STRING },
      },
      required: ["height", "width", "depth"]
    },
    shoppingList: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of raw materials needed to buy."
    },
    cutList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          partName: { type: Type.STRING, description: "e.g., Vertical Leg" },
          quantity: { type: Type.NUMBER },
          thickness: { type: Type.STRING, description: "nominal thickness (e.g. 1.5 inch or 38mm)" },
          width: { type: Type.STRING, description: "nominal width (e.g. 3.5 inch or 89mm)" },
          length: { type: Type.STRING, description: "length to cut (e.g. 60 inch or 1500mm)" },
          material: { type: Type.STRING, description: "e.g., 2x4 Pine or 45x95mm Timber" },
          notes: { type: Type.STRING, description: "Specific cut instructions like 'miter 45 deg'" }
        },
        required: ["partName", "quantity", "length", "material"]
      }
    },
    assemblySteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING }
        },
        required: ["stepNumber", "instruction"]
      }
    }
  },
  required: ["title", "estimatedCost", "estimatedTime", "estimatedRetailPrice", "overallDimensions", "shoppingList", "cutList", "assemblySteps"]
};

export async function generatePlanFromImage(
  base64Image: string,
  units: UnitSystem,
  difficulty: Difficulty,
  woodType: WoodType
): Promise<WoodworkingPlan> {
  console.log('\n🔄 generatePlanFromImage called');
  console.log('📊 Config:', { units, difficulty, woodType });
  
  try {
    const ai = getAIClient();
    const model = "gemini-2.5-flash";
    
    // Extract base64 data and mime type from Data URI if present
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

    console.log('📡 Calling Gemini API with structured schema...');
    const startTime = performance.now();

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType, 
            },
          },
          {
            text: `Analyze this image of a furniture piece and create a detailed woodworking plan. 
            
            CONFIGURATION:
            1. ${unitInstructions}
            2. Difficulty Level: ${difficulty}. ${difficultyInstructions}
            3. ${materialInstructions}
            
            Estimate the cost of materials (Lumber + Screws) vs the cost of buying this item new (Retail Price).
            Make the Retail Price realistic for a high-end store (e.g. West Elm/Pottery Barn) to highlight savings.
            
            Provide a complete cut list, shopping list, and assembly steps.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        systemInstruction: "You are an expert master carpenter. You generate precise, safe, and efficient woodworking plans from photos. Do not generate images, only text data.",
      },
    });

    const elapsed = performance.now() - startTime;
    console.log(`⏱️  API response received in ${elapsed.toFixed(0)}ms`);

    if (!response.text) {
      console.error('❌ No response text from Gemini');
      throw new Error("No response from Gemini AI");
    }

    console.log('📝 Response text (first 200 chars):', response.text.substring(0, 200));

    const plan = JSON.parse(response.text) as WoodworkingPlan;
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
  
  const dimensionSuffix = units === 'imperial' ? '"' : 'mm';
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
