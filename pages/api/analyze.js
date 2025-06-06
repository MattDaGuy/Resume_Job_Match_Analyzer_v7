
export default async function handler(req, res) {
  try {
    const { resume, jobDescription } = req.body;

 const prompt = `
You are a hiring analyst. Compare the following resume to the job description and return ONLY valid JSON in this exact format:

{
  "fitPercentage": number (0–100),
  "qualifications": string[],
  "concerns": string[],
  "questions": string[]
}

Resume:
${resume}

Job Description:
${jobDescription}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful hiring assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const result = await response.json();
console.log('Raw OpenAI response:', result); // TEMP LOG
    const output = result.choices?.[0]?.message?.content || '';

    try {
  const parsed = JSON.parse(output);
  return res.status(200).json(parsed);
} catch (err) {
  console.error("Raw GPT output:", output); // TEMP LOG
  return res.status(500).json({ error: 'OpenAI response was not valid JSON', raw: output });
}

 
