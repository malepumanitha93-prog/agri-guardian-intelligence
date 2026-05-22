import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const DiseaseSchema = z.object({
  imageBase64: z.string().min(20),
});

export const analyzeDisease = createServerFn({ method: "POST" })
  .inputValidator((d) => DiseaseSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI not configured");

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert agronomist AI specialized in plant disease diagnosis. Analyze the leaf image and respond ONLY with the structured tool call.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Diagnose this plant leaf. Identify disease, severity, symptoms, and treatment." },
              { type: "image_url", image_url: { url: data.imageBase64 } },
            ],
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "report_diagnosis",
            description: "Report the plant disease diagnosis.",
            parameters: {
              type: "object",
              properties: {
                disease: { type: "string", description: "Disease name or 'Healthy'" },
                crop: { type: "string", description: "Crop type identified" },
                confidence: { type: "number", description: "Confidence 0-100" },
                severity: { type: "string", enum: ["None", "Mild", "Moderate", "Severe"] },
                symptoms: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
                treatment: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
                prevention: { type: "string" },
              },
              required: ["disease", "crop", "confidence", "severity", "symptoms", "treatment", "prevention"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "report_diagnosis" } },
      }),
    });

    if (res.status === 429) throw new Error("Rate limited. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits required. Add credits in Workspace settings.");
    if (!res.ok) throw new Error(`AI error: ${res.status}`);

    const json = await res.json();
    const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("No diagnosis returned");
    return JSON.parse(args) as {
      disease: string; crop: string; confidence: number; severity: string;
      symptoms: string[]; treatment: string[]; prevention: string;
    };
  });

const ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).min(1),
  language: z.enum(["en", "te"]).default("en"),
});

export const chatAssistant = createServerFn({ method: "POST" })
  .inputValidator((d) => ChatSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI not configured");

    const sysEn = "You are AgroShield AI, a friendly farming assistant. Give concise, practical advice on crops, soil, irrigation, fertilizers, pests, and weather. Use markdown lists when helpful. Keep responses under 180 words.";
    const sysTe = "మీరు AgroShield AI, తెలుగు రైతుల కోసం స్నేహపూర్వక AI సహాయకుడు. పంటలు, నేల, నీటిపారుదల, ఎరువులు, చీడపీడలు, వాతావరణం గురించి సంక్షిప్తంగా ఆచరణాత్మక సలహాలు ఇవ్వండి. తెలుగులో మాత్రమే సమాధానం ఇవ్వండి. 180 పదాల లోపు ఉంచండి.";

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: data.language === "te" ? sysTe : sysEn },
          ...data.messages,
        ],
      }),
    });

    if (res.status === 429) throw new Error("Rate limited. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits required.");
    if (!res.ok) throw new Error(`AI error: ${res.status}`);
    const json = await res.json();
    return { reply: json.choices?.[0]?.message?.content ?? "Sorry, I couldn't respond." };
  });
