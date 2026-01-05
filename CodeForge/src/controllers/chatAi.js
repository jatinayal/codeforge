const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMNI });
const conversationHistory = [];

async function generateAIResponse(prompt) {
  try {
    // Add user message to conversation history
    conversationHistory.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    // Generate response from Gemini
    const response = await ai.models.generateContent({ 
      model: "gemini-3-pro-preview",
      contents: conversationHistory,
    });

    const aiResponse = response.text;

    // Add AI response to conversation history
    conversationHistory.push({
      role: "model",
      parts: [{ text: aiResponse }]
    });
 
    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I'm having trouble responding right now. Please try again later.";
  }
}

const chatAi = async (req, res) => {
    
  const { question, problem, userCode, language } = req.body;

  try {
    const prompt = `You are CodeForge AI, an intelligent coding assistant for solving competitive programming problems. 
Your role is to guide the user step by step based on:
1. The given problem details.
2. The user's current code.
3. The user's specific question or doubt.

### Instructions:
- Always explain in clear, beginner-friendly language.
- Focus on helping the user fix their code and understand the problem, not just giving the final solution.
- If the code has errors, explain where and why, and suggest improvements.
- If the user's logic is incomplete, guide them toward the correct approach without directly giving the full solution unless asked.
- Provide code snippets only when necessary, and keep them short and relevant.
- Be encouraging and constructive, never dismissive.
- If the question is unrelated to the problem/code, politely remind them to stay focused.

### Input Format (from system):
Problem Details: ${problem?.description || 'No problem details provided'}
User Code: ${userCode || 'No code provided'}
Code Language: ${language || 'Not specified'}
User Question: ${question}

### Output:
Provide a helpful response tailored to the problem, user's code, and their question. Be concise but clear.`;

    const response = await generateAIResponse(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Chat AI error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
};

module.exports = chatAi;
