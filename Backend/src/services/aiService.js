import axios from "axios";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL = "phi3:mini";


// ==============================
// 🔹 1. EXTRACT SKILLS (AI)
// ==============================

export const extractSkillsAI = async (text) => {
  try {
    const trimmedText = text.slice(0, 500); // 🔥 smaller = more stable

    const res = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt: `
You are a strict JSON generator.

Extract ONLY technical skills.

STRICT RULES:
- Output ONLY JSON
- No explanation
- No markdown
- No extra text
- No line breaks inside values
- Do NOT repeat instructions

Return EXACTLY:
{"skills":["react","nodejs"]}

Text:
${trimmedText}
      `,
      stream: false,
    });

    return res.data.response;

  } catch (err) {
    console.error("❌ AI ERROR:", err.response?.data || err.message);
    return null;
  }
};


// ==============================
// 🔹 2. CLEAN + PARSE SKILLS
// ==============================

export const cleanSkills = (aiResponse) => {
  try {
    if (!aiResponse) return [];

    // 🔥 extract FIRST JSON only (non-greedy)
    const match = aiResponse.match(/\{[\s\S]*?\}/);

    if (!match) {
      console.warn("⚠️ No JSON found");
      return [];
    }

    let jsonString = match[0];

    // 🔥 repair common LLM issues
    jsonString = jsonString
      .replace(/,\s*}/g, "}")       // trailing comma
      .replace(/\n/g, "")           // new lines
      .replace(/\t/g, "")
      .replace(/an\s*d/g, "")       // broken "and"
      .replace(/[^ -~]/g, "");      // remove weird unicode

    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed.skills)) return [];

    const cleaned = parsed.skills.map((skill) =>
      skill
        .toLowerCase()
        .split("(")[0]
        .replace(/[^a-z0-9+#. ]/gi, "")
        .trim()
    );

    return [...new Set(cleaned)].filter(Boolean);

  } catch (err) {
    console.error("❌ Skill parsing error:", err.message);
    return [];
  }
};


// ==============================
// 🔹 3. AI RANK INTERNSHIPS
// ==============================

export const rankInternshipsAI = async (skills, internships) => {
  try {
    const limited = internships.slice(0, 5); // 🔥 keep small

    const res = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt: `
You are an AI career assistant.

Skills:
${JSON.stringify(skills)}

Internships:
${JSON.stringify(limited)}

STRICT RULES:
- Return ONLY JSON
- No explanation
- No markdown
- No extra text

Format:
{
  "recommendations":[
    {"role":"","company":"","reason":""}
  ]
}

Select best 3–5 internships.
      `,
      stream: false,
    });

    return res.data.response;

  } catch (err) {
    console.error("❌ Ranking error:", err.response?.data || err.message);
    return null;
  }
};


// ==============================
// 🔹 4. CLEAN RANKING OUTPUT
// ==============================

export const cleanRecommendations = (aiResponse) => {
  try {
    if (!aiResponse) return [];

    const match = aiResponse.match(/\{[\s\S]*?\}/);

    if (!match) return [];

    let jsonString = match[0];

    jsonString = jsonString
      .replace(/,\s*}/g, "}")
      .replace(/\n/g, "")
      .replace(/\t/g, "");

    const parsed = JSON.parse(jsonString);

    return parsed.recommendations || [];

  } catch (err) {
    console.error("❌ Recommendation parsing error:", err.message);
    return [];
  }
};