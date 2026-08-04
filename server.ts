import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ==================== API ROUTES ==================== //

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "AI Success Hub", timestamp: new Date().toISOString() });
});

// 1. AI Chat Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    const lastUserMessage = messages[messages.length - 1]?.content || "Hello";

    // Format chat history
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: lastUserMessage,
      config: {
        systemInstruction: systemInstruction || "You are AI Success Hub Copilot, a helpful AI productivity assistant for documents, writing, coding, and workflow automation.",
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

// 2. AI Text Tools Endpoint (Summarize, Writer, Resume, Email, Blog, Script, Translator, etc.)
app.post("/api/ai/generate-text", async (req, res) => {
  try {
    const { toolType, prompt, contextText, tone, targetLanguage, length } = req.body;
    
    if (!prompt && !contextText) {
      return res.status(400).json({ error: "Prompt or context text is required." });
    }

    const ai = getGeminiClient();

    let systemPrompt = "You are an expert AI productivity assistant. Produce clear, professional, well-formatted output with markdown.";
    
    if (toolType === "summarize") {
      systemPrompt = "You are an expert document summarizer. Summarize the text clearly with executive summary, key bullet points, action items, and main takeaways.";
    } else if (toolType === "resume") {
      systemPrompt = "You are a professional executive resume builder and career strategist. Format output cleanly with sections: Summary, Core Competencies, Professional Experience, Education, and Skills.";
    } else if (toolType === "cover-letter") {
      systemPrompt = "You are an expert job application strategist. Write a persuasive, polished cover letter.";
    } else if (toolType === "email") {
      systemPrompt = "You are an executive communications specialist. Draft a compelling email with Subject line and Body.";
    } else if (toolType === "blog") {
      systemPrompt = "You are a senior content marketer and SEO copywriter. Generate a comprehensive, SEO-optimized blog post with subheadings (H2, H3), meta description, and conclusion.";
    } else if (toolType === "translator") {
      systemPrompt = `You are a professional translator. Translate the text accurately into ${targetLanguage || "English"} while maintaining natural tone and nuance.`;
    } else if (toolType === "grammar") {
      systemPrompt = "You are a meticulous proofreader and editor. Fix all grammatical, spelling, and punctuation errors. Provide the corrected version first, followed by a list of key corrections made.";
    } else if (toolType === "youtube-script") {
      systemPrompt = "You are a viral YouTube creator and scriptwriter. Write an engaging script with Hook, Intro, Key Sections with visual cues [Visual: ...], Call to Action, and Outro.";
    } else if (toolType === "social") {
      systemPrompt = "You are a social media viral growth marketer. Generate engaging posts tailored for LinkedIn, Twitter/X, and Instagram with hashtags.";
    } else if (toolType === "prompt-generator") {
      systemPrompt = "You are an AI prompt engineering specialist. Expand the user idea into 3 optimized, high-performing prompts (for LLMs, Midjourney/Gemini Image, and Automation).";
    }

    const fullPrompt = `Task: ${toolType || "content creation"}
${tone ? `Tone: ${tone}` : ""}
${length ? `Target Length: ${length}` : ""}
Input/Context:
${contextText || ""}

User Request/Details:
${prompt || ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/generate-text:", error);
    res.status(500).json({ error: error.message || "Failed to execute AI text task." });
  }
});

// 3. AI Image Generator Endpoint
app.post("/api/ai/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio, style } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required." });
    }

    const ai = getGeminiClient();
    const finalPrompt = style ? `${prompt}, style: ${style}, highly detailed, professional visual quality` : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
        },
      },
    });

    let imageUrl = null;
    let caption = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
        } else if (part.text) {
          caption += part.text;
        }
      }
    }

    if (!imageUrl) {
      // Fallback placeholder if image model generation isn't supported on current key
      return res.status(500).json({ error: "Image generation did not return image data. Check API key permissions." });
    }

    res.json({ imageUrl, caption });
  } catch (error: any) {
    console.error("Error in /api/ai/generate-image:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI image." });
  }
});

// 4. Simulated Stripe Checkout endpoint
app.post("/api/stripe/checkout", (req, res) => {
  const { planId, billingCycle, userEmail } = req.body;
  res.json({
    success: true,
    sessionId: `cs_test_${Math.random().toString(36).substring(2, 12)}`,
    message: `Subscription to ${planId} (${billingCycle}) initialized for ${userEmail || "user"}.`,
  });
});

// ==================== VITE SERVER INTEGRATION ==================== //

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AI Success Hub Server running at http://localhost:${PORT}`);
  });
}

startServer();
