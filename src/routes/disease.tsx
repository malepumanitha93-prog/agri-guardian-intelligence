import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeDisease } from "@/lib/ai.functions";
import { Upload, Leaf, ShieldCheck, AlertTriangle, Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/disease")({
  head: () => ({
    meta: [
      { title: "Crop Disease Detection — AgroShield AI" },
      { name: "description", content: "Upload a plant leaf and get instant AI-powered disease diagnosis with treatment plans." },
    ],
  }),
  component: DiseasePage,
});

type Result = Awaited<ReturnType<typeof analyzeDisease>>;

function DiseasePage() {
  const analyze = useServerFn(analyzeDisease);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image too large (max 8MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await analyze({ data: { imageBase64: image } });
      setResult(r);
      toast.success("Diagnosis complete");
    } catch (e: any) {
      toast.error(e?.message ?? "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImage(null); setResult(null); };

  const isHealthy = result?.disease.toLowerCase() === "healthy";

  return (
    <div className="space-y-6 animate-fade-in-up max-w-7xl">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
          <Sparkles className="h-3 w-3" /> Vision AI · Gemini powered
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          AI Crop <span className="gradient-text">Disease Detection</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Upload a clear photo of an affected leaf. Our AI identifies the disease, confidence score, and a tailored treatment plan in seconds.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload */}
        <div className="glass rounded-2xl p-6 shadow-elegant">
          <h2 className="font-display font-semibold text-lg mb-4">1. Upload Leaf Image</h2>

          {!image ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/60 hover:bg-primary/5 transition flex flex-col items-center justify-center text-center p-8 group"
            >
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Upload className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="font-display font-semibold text-lg">Drop or click to upload</div>
              <div className="text-sm text-muted-foreground mt-1">JPG, PNG · up to 8MB</div>
            </button>
          ) : (
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border">
              <img src={image} alt="Leaf preview" className="absolute inset-0 w-full h-full object-cover" />
              {loading && (
                <>
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_8px_oklch(0.7_0.2_145/0.6)] animate-scan" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium">
                      <Loader2 className="h-4 w-4 animate-spin" /> Scanning...
                    </div>
                  </div>
                </>
              )}
              <button
                onClick={reset}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />

          <div className="mt-4 flex gap-3">
            <Button
              className="flex-1 h-11 gradient-primary text-primary-foreground border-0 hover:opacity-90 shadow-elegant"
              disabled={!image || loading}
              onClick={handleAnalyze}
            >
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing</> : <><Sparkles className="h-4 w-4 mr-2" /> Analyze Now</>}
            </Button>
            {image && (
              <Button variant="outline" className="h-11" onClick={() => fileRef.current?.click()}>
                Replace
              </Button>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="glass rounded-2xl p-6 shadow-elegant min-h-[400px]">
          <h2 className="font-display font-semibold text-lg mb-4">2. Diagnosis</h2>

          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-16">
              <Leaf className="h-12 w-12 mb-3 text-primary/40" />
              <div className="font-medium">Waiting for image...</div>
              <div className="text-sm">Results will appear here.</div>
            </div>
          )}

          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-8 rounded-lg bg-muted" />
              <div className="h-4 rounded bg-muted w-2/3" />
              <div className="h-24 rounded-xl bg-muted mt-6" />
              <div className="h-24 rounded-xl bg-muted" />
            </div>
          )}

          {result && (
            <div className="space-y-5 animate-fade-in-up">
              <div className={`rounded-2xl p-5 border ${isHealthy ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {result.crop} · {result.severity}
                    </div>
                    <div className="font-display text-2xl font-bold mt-1 flex items-center gap-2">
                      {isHealthy ? <ShieldCheck className="h-6 w-6 text-success" /> : <AlertTriangle className="h-6 w-6 text-warning" />}
                      {result.disease}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="font-display text-3xl font-bold gradient-text">{Math.round(result.confidence)}%</div>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-background/50 overflow-hidden">
                  <div
                    className="h-full gradient-primary transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Symptoms</h3>
                <ul className="space-y-1.5">
                  {result.symptoms.map((s, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-warning mt-2 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Recommended Treatment</h3>
                <ul className="space-y-1.5">
                  {result.treatment.map((t, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-accent/10 border border-accent/20 p-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-accent mb-1">Prevention</div>
                <div className="text-sm">{result.prevention}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
