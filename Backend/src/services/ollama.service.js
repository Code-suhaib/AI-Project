import axios from "axios";

// ==========================================
// EXTRACT RESUME PROFILE USING QWEN
// ==========================================

export const extractSkillsAI = async (text) => {
  try {
    const trimmedText = text.slice(0, 2500);

    const res = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "qwen2.5:7b",

        prompt: `
You are a strict JSON generator.

Analyze the resume and return ONLY valid JSON.

Return EXACTLY this structure:

{
  "skills": [],
  "suggestedRole": "",
  "experienceLevel": "",
  "projects": [],
  "education": ""
}

Rules:
- Output ONLY JSON
- No markdown
- No explanations
- No comments
- Skills must contain only technical skills
- suggestedRole must be an IT role
- experienceLevel must be Beginner, Intermediate, or Advanced
- projects must contain project names only
- education must contain highest qualification found

Resume:

${trimmedText}
        `,

        stream: false,
      },
      {
        timeout: 120000,
      }
    );

    const output = res.data.response.trim();

    console.log("=================================");
    console.log("🧠 RAW AI OUTPUT");
    console.log("=================================");
    console.log(output);
    console.log("=================================");

    return output;

  } catch (err) {
    console.error("=================================");
    console.error("❌ OLLAMA ERROR");
    console.error("=================================");
    console.error(err.message);
    console.error("=================================");

    return null;
  }
};

// ==========================================
// CLEAN + PARSE PROFILE
// ==========================================

export const cleanSkills = (aiResponse) => {
  try {
    if (!aiResponse) {
      return {
        skills: [],
        suggestedRole: "",
        experienceLevel: "",
        projects: [],
        education: "",
      };
    }

    const match = aiResponse.match(/\{[\s\S]*\}/);

    if (!match) {
      console.warn("⚠️ No JSON found");

      return {
        skills: [],
        suggestedRole: "",
        experienceLevel: "",
        projects: [],
        education: "",
      };
    }

    const parsed = JSON.parse(match[0]);

    return {
      skills: Array.isArray(parsed.skills)
        ? [...new Set(
            parsed.skills.map((skill) =>
              skill
                .toLowerCase()
                .replace(/[^a-z0-9+#. ]/gi, "")
                .trim()
            )
          )].filter(Boolean)
        : [],

      suggestedRole:
        parsed.suggestedRole || "",

      experienceLevel:
        parsed.experienceLevel || "",

      projects:
        Array.isArray(parsed.projects)
          ? parsed.projects
          : [],

      education:
        parsed.education || "",
    };

  } catch (err) {
    console.error(
      "❌ Profile Parsing Error:",
      err.message
    );

    return {
      skills: [],
      suggestedRole: "",
      experienceLevel: "",
      projects: [],
      education: "",
    };
  }
};