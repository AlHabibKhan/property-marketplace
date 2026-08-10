export async function polishDescription(rawText) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Rewrite this Pakistani property listing description to sound professional, keep it under 100 words, keep all facts unchanged, output in the same language it's written in (Urdu or English): "${rawText}"` }]
        }]
      })
    }
  );
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || rawText;
}