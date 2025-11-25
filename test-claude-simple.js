#!/usr/bin/env node
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY || "sk-ant-your-key-here",
});

console.log("Testing Claude API...");

try {
  const msg = await client.messages.create({
    model: "claude-opus-4-1-20250805",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Return only valid JSON for a wooden shelf: {\"title\": \"Shelf\", \"description\": \"A simple wooden shelf\", \"estimatedCost\": \"$50\", \"estimatedRetailPrice\": \"$300\", \"estimatedTime\": \"2 hours\", \"overallDimensions\": {\"height\": \"36\\\"\", \"width\": \"24\\\"\", \"depth\": \"12\\\"\"}, \"shoppingList\": [\"2x4 lumber\"], \"cutList\": [{\"partName\": \"Shelf\", \"quantity\": 1, \"thickness\": \"3/4\\\"\", \"width\": \"24\\\"\", \"length\": \"36\\\"\", \"material\": \"Pine\"}], \"assemblySteps\": [{\"stepNumber\": 1, \"instruction\": \"Cut shelf to size\"}]}",
      },
    ],
  });

  console.log("✅ Response received!");
  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  console.log("Response:", text.substring(0, 200));

  try {
    const json = JSON.parse(text);
    console.log("✅ Valid JSON! Title:", json.title);
  } catch {
    console.log("⚠️  Not JSON, but got response");
  }
} catch (err) {
  console.error("❌ Error:", err.message);
}
