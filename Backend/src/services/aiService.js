import axios from "axios";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL = "qwen2.5:7b";


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

export const rankInternshipsAI = async (
  profile,
  internships
) => {
  try {

    const simplifiedJobs = internships.map((job) => ({
      job_title: job.job_title || "",
      employer_name: job.employer_name || "",
      location: `${job.job_city || ""} ${job.job_country || ""}`.trim(),
      apply_link: job.job_apply_link || "",
    }));

    const prompt = `
You are an AI internship advisor.

Candidate Profile:

Role:
${profile.role || ""}

Skills:
${(profile.skills || []).join(", ")}

Experience:
${profile.experience || ""}

Interests:
${profile.interests || ""}

Career Goal:
${profile.goal || ""}

Internships:

${JSON.stringify(simplifiedJobs)}

Return ONLY valid JSON.

{
  "recommendations":[
    {
      "job_title":"",
      "employer_name":"",
      "reason":"",
      "score":95,
      "job_apply_link":""
    }
  ]
}

Choose the best 5 internships.

Rules:
- Higher score = better match
- Score between 1 and 100
- Return ONLY JSON
- No markdown
- No explanation
- No text outside JSON
- Sort highest score first
`;

    console.log("================================");
    console.log("🤖 Sending request to Qwen");
    console.log("Prompt Length:", prompt.length);
    console.log("Jobs:", simplifiedJobs.length);
    console.log("================================");

    console.time("Qwen Response Time");

    const res = await axios.post(
      OLLAMA_URL,
      {
        model: MODEL,
        prompt,
        stream: false,
      },
      {
        timeout: 180000, // 3 min
      }
    );

    console.timeEnd("Qwen Response Time");

    console.log("================================");
    console.log("✅ Qwen Response Received");
    console.log("================================");

    if (!res.data?.response) {
      console.error("❌ Empty response from Qwen");
      return null;
    }

    return res.data.response;

  } catch (err) {

    console.log("================================");
    console.log("❌ QWEN ERROR");
    console.log("================================");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error(err.response.data);
    } else if (err.request) {
      console.error("No response received");
      console.error(err.message);
    } else {
      console.error(err.message);
    }

    return null;
  }
};


// ==============================
// 🔹 4. CLEAN RANKING OUTPUT
// ==============================

export const cleanRecommendations = (response) => {
  try {
    if (!response) return [];

    const match = response.match(/\{[\s\S]*\}/);

    if (!match) return [];

    const parsed = JSON.parse(match[0]);

    return parsed.recommendations || [];
  } catch (err) {
    console.error(
      "❌ Recommendation Parse Error:",
      err.message
    );

    return [];
  }
};