import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatAssistant } from "@/lib/ai.functions";
import { Send, Mic, MicOff, Volume2, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Farming Assistant — AgroShield AI" },
      { name: "description", content: "Ask farming questions in English or Telugu with voice input and AI-generated tips." },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Best fertilizer for tomatoes in summer?",
  "How to control aphids organically?",
  "మిరపకు ఏ ఎరువు మంచిది?",
  "When should I irrigate paddy fields?",
];

function AssistantPage() {
  const chat = useServerFn(chatAssistant);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "🌱 Hi, I'm AgroShield AI. Ask me anything about crops, soil, pests, or weather. Switch to తెలుగు anytime." },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "te">("en");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const newMsgs: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await chat({ data: { messages: newMsgs, language } });
      setMessages([...newMsgs, { role: "assistant", content: reply }]);
      speak(reply);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to respond");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = language === "te" ? "te-IN" : "en-US";
    u.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input not supported on this browser");
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = language === "te" ? "te-IN" : "en-US";
    r.interimResults = false;
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInput(t);
      setListening(false);
      send(t);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    recogRef.current = r;
    setListening(true);
  };

  return (
    <div className="space-y-4 animate-fade-in-up max-w-5xl mx-auto">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
            <Sparkles className="h-3 w-3" /> Voice · Multilingual
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            AI Farming <span className="gradient-text">Assistant</span>
          </h1>
        </div>
        <div className="glass rounded-full p-1 flex text-sm font-medium">
          {(["en", "te"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-4 py-1.5 rounded-full transition ${language === l ? "gradient-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              {l === "en" ? "English" : "తెలుగు"}
            </button>
          ))}
        </div>
      </header>

      <div className="glass rounded-2xl shadow-elegant flex flex-col h-[calc(100vh-260px)] min-h-[500px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                m.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted/60 rounded-tl-sm"
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                {m.role === "assistant" && (
                  <button onClick={() => speak(m.content)} className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition">
                    <Volume2 className="h-3 w-3" /> Listen
                  </button>
                )}
              </div>
              {m.role === "user" && (
                <div className="h-9 w-9 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground animate-pulse-glow">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="px-6 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-muted/70 hover:bg-primary/15 hover:text-primary transition border border-border/50">
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="p-4 border-t border-border/60 flex gap-2"
        >
          <button
            type="button"
            onClick={toggleMic}
            className={`h-11 w-11 rounded-xl flex items-center justify-center transition shrink-0 ${
              listening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-muted hover:bg-primary/15 hover:text-primary"
            }`}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === "te" ? "మీ ప్రశ్న టైప్ చేయండి..." : "Ask anything about farming..."}
            className="flex-1 h-11 px-4 rounded-xl bg-muted/50 border border-border/60 focus:outline-none focus:border-primary/60 focus:bg-background transition"
          />
          <Button type="submit" disabled={!input.trim() || loading} className="h-11 px-5 gradient-primary text-primary-foreground border-0 hover:opacity-90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
