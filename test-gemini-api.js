/**
 * Direct test of Gemini API
 * Run with: node test-gemini-api.js
 */

import https from 'https';

const API_KEY = 'AIzaSyCsBKEHlrxPkHdsiKWzTDOBFOOp_ROX4Nw';

// Create a simple test image (1x1 pixel red PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

const prompt = `You are an expert woodworking craftsperson. Analyze this furniture image and create a detailed woodworking plan.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "Furniture name",
  "description": "Brief description",
  "estimatedCost": "$50",
  "estimatedRetailPrice": "$800",
  "estimatedTime": "4-6 hours",
  "overallDimensions": {"height": "36\\"", "width": "24\\"", "depth": "12\\""},
  "shoppingList": ["2x4 lumber...", "Screws..."],
  "cutList": [{"partName": "Leg", "quantity": 4, "thickness": "3/4\\"", "width": "2\\"", "length": "36\\"", "material": "Wood"}],
  "assemblySteps": [{"stepNumber": 1, "instruction": "Cut all pieces..."}]
}`;

const requestBody = {
  contents: [
    {
      parts: [
        {
          text: prompt,
        },
        {
          inlineData: {
            mimeType: 'image/png',
            data: testImageBase64,
          },
        },
      ],
    },
  ],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 3000,
  },
};

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

console.log('🚀 Testing Gemini API...');
console.log('📍 URL:', url.replace(API_KEY, '***KEY***'));
console.log('📦 Request body size:', JSON.stringify(requestBody).length, 'bytes');
console.log('');

const postData = JSON.stringify(requestBody);

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log('📋 Headers:', res.headers);
  console.log('');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Response received');
    console.log('📏 Response size:', data.length, 'bytes');
    console.log('');

    try {
      const parsed = JSON.parse(data);
      console.log('📄 Full Response (formatted):');
      console.log(JSON.stringify(parsed, null, 2));
      console.log('');

      // Check structure
      if (parsed.candidates && parsed.candidates[0]) {
        const textContent = parsed.candidates[0].content?.parts?.[0]?.text;
        if (textContent) {
          console.log('✅ Text content extracted (first 500 chars):');
          console.log(textContent.substring(0, 500));
          console.log('');

          // Try to extract JSON
          const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            console.log('✅ Found markdown JSON block');
            console.log('JSON content:', jsonMatch[1].substring(0, 300));
          } else {
            const directMatch = textContent.match(/\{[\s\S]*\}/);
            if (directMatch) {
              console.log('✅ Found direct JSON object');
              console.log('JSON content:', directMatch[0].substring(0, 300));
            }
          }
        } else {
          console.log('❌ No text content in response');
        }
      } else {
        console.log('❌ No candidates in response');
      }
    } catch (err) {
      console.log('⚠️  Could not parse as JSON:');
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});

console.log('📤 Sending request...');
req.write(postData);
req.end();

// Timeout after 30 seconds
setTimeout(() => {
  console.error('⏱️  Timeout: API did not respond within 30 seconds');
  process.exit(1);
}, 30000);
