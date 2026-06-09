import axios from "axios";

// 🔹 Extract skills using Ollama
export const extractSkillsAI = async (text) => {
  try {
    const trimmedText = text.slice(0, 2500); // prevent overload

    const res = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "phi3",
        prompt: `
You are a strict JSON generator.

Extract ONLY technical skills from the text.

Rules:
- Return ONLY valid JSON
- No explanation
- No extra text
- Output must start with { and end with }

Format:
{"skills": ["skill1", "skill2"]}

Text:
${trimmedText}
        `,
        stream: false,
      }
    );

    const output = res.data.response.trim();

    console.log("🧠 RAW AI OUTPUT:", output); // debug

    return output;

  } catch (err) {
    console.error("Ollama error:", err.message);
    return null;
  }
};

// 🔹 Clean + safely parse skills
export const cleanSkills = (aiResponse) => {
  try {
    if (!aiResponse) return [];

    // ✅ Extract JSON from messy output
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn("⚠️ No JSON found in AI response");
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.skills || !Array.isArray(parsed.skills)) {
      return [];
    }

    // ✅ Clean each skill
    const cleaned = parsed.skills.map((skill) =>
      skill
        .toLowerCase()
        .split("(")[0]
        .replace(/[^a-z0-9+#. ]/gi, "")
        .trim()
    );

    // ✅ Remove duplicates
    return [...new Set(cleaned)].filter(Boolean);

  } catch (err) {
    console.error("❌ Skill parsing error:", err.message);
    return [];
  }
};