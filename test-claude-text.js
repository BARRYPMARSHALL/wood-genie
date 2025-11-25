#!/usr/bin/env node
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY || "sk-ant-your-key-here",
});

console.log("Testing Claude API with text only...");

try {
  const msg = await client.messages.create({
    model: "claude-opus-4-1-20250805",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: 'Return this exact JSON: {"title":"Test Shelf","status":"success"}',
      },
    ],
  });

  console.log("✅ Response received!");
  console.log(msg.content[0]);
} catch (err) {
  console.error("Error:", err.message);
  console.error("Full error:", JSON.stringify(err, null, 2));
}
