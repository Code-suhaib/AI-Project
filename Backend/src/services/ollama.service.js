import axios from "axios";

export const extractSkillsAI = async (text) => {
  try {
    const res = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi3",
        prompt: `
You are a strict parser.

Extract ONLY technical skill names.
Return ONLY JSON:
{"skills": ["skill1", "skill2"]}

Text:
${text}
        `,
        stream: false,
      }
    );

    return res.data.response;
  } catch (err) {
    console.error("Ollama error:", err.message);
    return null;
  }
};

export const cleanSkills = (aiResponse) => {
  try {
    const parsed = JSON.parse(aiResponse);

    return parsed.skills.map((skill) =>
      skill
        .split("(")[0]
        .replace(/[^a-zA-Z0-9+#. ]/g, "")
        .trim()
    );
  } catch {
    return [];
  }
};