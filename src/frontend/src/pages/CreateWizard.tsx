import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  ImageIcon,
  Loader2,
  Mic2,
  Music2,
  Send,
  Settings,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { MUSIC_TRACKS, NO_MUSIC_ID } from "../data/musicTracks";
import { useCreateJob, useUploadImageAsset } from "../hooks/useQueries";

interface CreateWizardProps {
  isOnlineMode: boolean;
  onDone: () => void;
  onCancel: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

interface WizardState {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  imageAssetId: string;
  prompt: string;
  voiceGender: "male" | "female";
  voiceLanguage: "en" | "hi";
  musicTrackId: string;
  resolution: "1080p" | "4K";
  subtitlesEnabled: boolean;
  mode: "basic" | "advanced";
}

const STEP_LABELS = [
  "Upload Image",
  "Prompt & Voice",
  "Music",
  "Export",
  "Generate",
];
const STEP_ICONS = [ImageIcon, Mic2, Music2, Settings, Send];

export default function CreateWizard({
  isOnlineMode,
  onDone,
  onCancel,
}: CreateWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [jobId, setJobId] = useState<bigint | null>(null);
  const [progress, setProgress] = useState(0);

  const [state, setState] = useState<WizardState>({
    imageFile: null,
    imagePreviewUrl: null,
    imageAssetId: crypto.randomUUID(),
    prompt: "",
    voiceGender: "female",
    voiceLanguage: "en",
    musicTrackId: "track-1",
    resolution: "1080p",
    subtitlesEnabled: true,
    mode: isOnlineMode ? "advanced" : "basic",
  });

  const createJob = useCreateJob();
  const uploadImage = useUploadImageAsset();

  const updateState = <K extends keyof WizardState>(
    key: K,
    value: WizardState[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    setState((prev) => ({ ...prev, imageFile: file, imagePreviewUrl: url }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const canAdvance = () => {
    if (step === 1) return !!state.imageFile;
    if (step === 2) return state.prompt.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 5) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async () => {
    if (!state.imageFile) {
      toast.error("No image selected");
      return;
    }

    try {
      // Upload image first
      await uploadImage.mutateAsync({
        id: state.imageAssetId,
        file: state.imageFile,
      });

      // Create job
      const id = await createJob.mutateAsync({
        imageAssetId: state.imageAssetId,
        musicTrackId:
          state.musicTrackId === NO_MUSIC_ID ? "" : state.musicTrackId,
        mode: state.mode,
        subtitlesEnabled: state.subtitlesEnabled,
        resolution: state.resolution,
        voiceLanguage: state.voiceLanguage,
        voiceGender: state.voiceGender,
        prompt: state.prompt,
      });

      setJobId(id);

      // Simulate progress
      const duration = state.mode === "basic" ? 30000 : 120000;
      const interval = 500;
      const steps = duration / interval;
      let current = 0;
      const timer = setInterval(() => {
        current++;
        const pct = Math.min(95, Math.round((current / steps) * 100));
        setProgress(pct);
        if (current >= steps) clearInterval(timer);
      }, interval);
    } catch {
      toast.error("Failed to create job. Please try again.");
    }
  };

  const selectedTrack = MUSIC_TRACKS.find((t) => t.id === state.musicTrackId);

  return (
    <div className="min-h-[calc(100dvh-56px)] flex flex-col">
      {/* Step Header */}
      <div className="border-b border-border/50 bg-card/40 backdrop-blur-sm px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Steps */}
          <div className="flex items-center justify-between mb-3">
            {STEP_LABELS.map((label, i) => {
              const stepNum = (i + 1) as Step;
              const Icon = STEP_ICONS[i];
              const isActive = step === stepNum;
              const isDone = step > stepNum;

              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "step-active shadow-glow"
                          : isDone
                            ? "step-done"
                            : "step-pending"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className="h-px w-6 sm:w-12 mx-1 transition-all duration-500"
                      style={{
                        background: isDone
                          ? "linear-gradient(90deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))"
                          : "oklch(0.28 0.04 285)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <Step1
                  state={state}
                  isDragging={isDragging}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onFileSelect={(f) => handleFile(f)}
                  onClearImage={() => {
                    if (state.imagePreviewUrl)
                      URL.revokeObjectURL(state.imagePreviewUrl);
                    setState((prev) => ({
                      ...prev,
                      imageFile: null,
                      imagePreviewUrl: null,
                      imageAssetId: crypto.randomUUID(),
                    }));
                  }}
                />
              )}
              {step === 2 && <Step2 state={state} onUpdate={updateState} />}
              {step === 3 && <Step3 state={state} onUpdate={updateState} />}
              {step === 4 && (
                <Step4
                  state={state}
                  onUpdate={updateState}
                  selectedTrack={selectedTrack}
                />
              )}
              {step === 5 && (
                <Step5
                  state={state}
                  jobId={jobId}
                  progress={progress}
                  isLoading={createJob.isPending || uploadImage.isPending}
                  isError={createJob.isError || uploadImage.isError}
                  onSubmit={handleSubmit}
                  onViewProjects={onDone}
                  selectedTrack={selectedTrack}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      {step < 5 && (
        <div className="border-t border-border/50 bg-card/40 backdrop-blur-sm px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={step === 1 ? onCancel : handleBack}
              data-ocid="wizard.back_button"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canAdvance()}
              data-ocid="wizard.next_button"
              className="relative overflow-hidden text-white border-0 disabled:opacity-40"
              style={{
                background: canAdvance()
                  ? "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))"
                  : undefined,
              }}
            >
              {step === 4 ? "Review & Generate" : "Next"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step 1: Upload Image ──────────────────────────────────────────── */
function Step1({
  state,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onClearImage,
}: {
  state: WizardState;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (f: File) => void;
  onClearImage: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">
          Upload Your Image
        </h2>
        <p className="text-muted-foreground text-sm">
          This image will be animated into a video
        </p>
      </div>

      {state.imagePreviewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-border/60 group">
          <img
            src={state.imagePreviewUrl}
            alt="Preview"
            className="w-full max-h-72 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearImage}
              className="gap-1"
            >
              <X className="w-3 h-3" />
              Change Image
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/60 text-white border-0 text-xs">
              {state.imageFile?.name}
            </Badge>
          </div>
        </div>
      ) : (
        <label
          data-ocid="wizard.step_1.dropzone"
          className={`
            flex flex-col items-center justify-center gap-4 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-all
            ${
              isDragging
                ? "border-neon-cyan/80 bg-neon-cyan/5 scale-[1.01]"
                : "border-border/60 hover:border-border hover:bg-muted/20"
            }
          `}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.22 210 / 0.15), oklch(0.62 0.28 295 / 0.15))",
              border: "1px solid oklch(0.72 0.22 210 / 0.3)",
            }}
          >
            <ImageIcon
              className="w-8 h-8"
              style={{ color: "oklch(0.72 0.22 210)" }}
            />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm mb-1">
              Drop your image here or{" "}
              <span style={{ color: "oklch(0.72 0.22 210)" }}>browse</span>
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, WebP up to 20MB
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            data-ocid="wizard.step_1.upload_button"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileSelect(f);
            }}
          />
        </label>
      )}

      <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Tip:</strong> Best results with
          high-contrast images, clear subjects, and good lighting. Portraits,
          landscapes, and products all work great.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 2: Prompt & Voice ────────────────────────────────────────── */
function Step2({
  state,
  onUpdate,
}: {
  state: WizardState;
  onUpdate: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">Prompt & Voice</h2>
        <p className="text-muted-foreground text-sm">
          Describe your video and choose a voice
        </p>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <label
          htmlFor="prompt-textarea"
          className="text-sm font-medium text-foreground"
        >
          Video Description
        </label>
        <Textarea
          id="prompt-textarea"
          value={state.prompt}
          onChange={(e) => onUpdate("prompt", e.target.value)}
          placeholder="A sweeping aerial view of mountain peaks at golden hour, cinematic slow motion, dramatic clouds parting..."
          data-ocid="wizard.step_2.prompt_input"
          className="min-h-[120px] bg-muted/20 border-border/60 focus:border-neon-cyan/50 resize-none text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {state.prompt.length} characters
        </p>
      </div>

      {/* Voice Gender */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground flex items-center gap-2">
          <Mic2 className="w-4 h-4 text-muted-foreground" />
          Voice Gender
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(["male", "female"] as const).map((gender) => (
            <button
              type="button"
              key={gender}
              onClick={() => onUpdate("voiceGender", gender)}
              data-ocid={`wizard.step_2.voice_gender.${gender}_button`}
              className={`
                py-3 px-4 rounded-xl border text-sm font-medium capitalize transition-all
                ${
                  state.voiceGender === gender
                    ? "text-white border-transparent"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }
              `}
              style={
                state.voiceGender === gender
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
                    }
                  : undefined
              }
            >
              {gender === "male" ? "👨 Male" : "👩 Female"}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Language */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Voice Language</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { code: "en" as const, label: "🇬🇧 English" },
            { code: "hi" as const, label: "🇮🇳 Hindi" },
          ].map(({ code, label }) => (
            <button
              type="button"
              key={code}
              onClick={() => onUpdate("voiceLanguage", code)}
              data-ocid={`wizard.step_2.voice_lang.${code}_button`}
              className={`
                py-3 px-4 rounded-xl border text-sm font-medium transition-all
                ${
                  state.voiceLanguage === code
                    ? "text-white border-transparent"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }
              `}
              style={
                state.voiceLanguage === code
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
                    }
                  : undefined
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* TTS Badge */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border/40">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-neon-violet/10 text-neon-violet border border-neon-violet/20">
          <Mic2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">
            Powered by Coqui TTS
          </p>
          <p className="text-xs text-muted-foreground">
            Open-source neural text-to-speech
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Music ─────────────────────────────────────────────────── */
function Step3({
  state,
  onUpdate,
}: {
  state: WizardState;
  onUpdate: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
}) {
  const categories = [
    "All",
    "Cinematic",
    "Epic",
    "Calm",
    "Upbeat",
    "Romantic",
  ] as const;
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? MUSIC_TRACKS
      : MUSIC_TRACKS.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">
          Background Music
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose a track for your video
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${
                activeCategory === cat
                  ? "text-white border-transparent"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
              }
            `}
            style={
              activeCategory === cat
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
                  }
                : undefined
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* No Music option */}
      <button
        type="button"
        onClick={() => onUpdate("musicTrackId", NO_MUSIC_ID)}
        data-ocid="wizard.step_3.no_music_button"
        className={`
          w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-all
          ${
            state.musicTrackId === NO_MUSIC_ID
              ? "border-neon-cyan/40 bg-neon-cyan/5 text-neon-cyan"
              : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
          }
        `}
      >
        <span className="text-xl">🔇</span>
        <div className="text-left">
          <p className="font-medium text-xs">No Music</p>
          <p className="text-xs opacity-70">Voice-over only</p>
        </div>
        {state.musicTrackId === NO_MUSIC_ID && (
          <Check className="w-4 h-4 ml-auto" />
        )}
      </button>

      {/* Track Grid */}
      <div className="grid grid-cols-1 gap-2">
        {filtered.map((track, i) => {
          const isSelected = state.musicTrackId === track.id;
          return (
            <button
              type="button"
              key={track.id}
              onClick={() => onUpdate("musicTrackId", track.id)}
              data-ocid={`wizard.step_3.music_item.${i + 1}`}
              className={`
                flex items-center gap-3 p-3 rounded-xl border text-left transition-all group
                ${
                  isSelected
                    ? "border-neon-cyan/40 bg-neon-cyan/5"
                    : "border-border/50 hover:border-border hover:bg-muted/20"
                }
              `}
            >
              <span className="text-2xl">{track.emoji}</span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-semibold ${isSelected ? "text-neon-cyan" : "text-foreground"}`}
                >
                  {track.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {track.category}
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {track.duration}
              </span>
              {isSelected && <Check className="w-4 h-4 text-neon-cyan" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 4: Export Settings ───────────────────────────────────────── */
function Step4({
  state,
  onUpdate,
  selectedTrack,
}: {
  state: WizardState;
  onUpdate: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
  selectedTrack: (typeof MUSIC_TRACKS)[0] | undefined;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">Export Settings</h2>
        <p className="text-muted-foreground text-sm">
          Configure quality and processing mode
        </p>
      </div>

      {/* Resolution */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Resolution</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onUpdate("resolution", "1080p")}
            data-ocid="wizard.step_4.resolution_hd_button"
            className={`
              py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1
              ${
                state.resolution === "1080p"
                  ? "text-white border-transparent"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
              }
            `}
            style={
              state.resolution === "1080p"
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
                  }
                : undefined
            }
          >
            <span className="font-bold text-base">HD</span>
            <span className="text-xs opacity-80">1080p · Faster</span>
          </button>
          <button
            type="button"
            onClick={() => onUpdate("resolution", "4K")}
            data-ocid="wizard.step_4.resolution_4k_button"
            className={`
              py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1
              ${
                state.resolution === "4K"
                  ? "text-white border-transparent"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
              }
            `}
            style={
              state.resolution === "4K"
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
                  }
                : undefined
            }
          >
            <span className="font-bold text-base">4K</span>
            <span className="text-xs opacity-80">Ultra HD · Slower</span>
          </button>
        </div>
      </div>

      {/* Mode */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Processing Mode</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onUpdate("mode", "basic")}
            data-ocid="wizard.step_4.mode_basic_button"
            className={`
              py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1
              ${
                state.mode === "basic"
                  ? "text-white border-transparent"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
              }
            `}
            style={
              state.mode === "basic"
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
                  }
                : undefined
            }
          >
            <span className="font-bold">Basic</span>
            <span className="text-xs opacity-80">Offline · ~30s</span>
          </button>
          <button
            type="button"
            onClick={() => onUpdate("mode", "advanced")}
            data-ocid="wizard.step_4.mode_advanced_button"
            className={`
              py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1
              ${
                state.mode === "advanced"
                  ? "text-white border-transparent"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
              }
            `}
            style={
              state.mode === "advanced"
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
                  }
                : undefined
            }
          >
            <span className="font-bold">Advanced AI</span>
            <span className="text-xs opacity-80">Online · ~2-3 min</span>
          </button>
        </div>
      </div>

      {/* Subtitles */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20">
        <div>
          <p className="text-sm font-medium text-foreground">Auto Subtitles</p>
          <p className="text-xs text-muted-foreground">
            AI-generated captions for your video
          </p>
        </div>
        <Switch
          checked={state.subtitlesEnabled}
          onCheckedChange={(v) => onUpdate("subtitlesEnabled", v)}
          data-ocid="wizard.step_4.subtitles_toggle"
        />
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl border border-border/40 bg-muted/10 space-y-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Summary
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Image: </span>
            <span className="text-foreground">
              {state.imageFile?.name.slice(0, 20) || "–"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Voice: </span>
            <span className="text-foreground capitalize">
              {state.voiceGender} (
              {state.voiceLanguage === "en" ? "English" : "Hindi"})
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Music: </span>
            <span className="text-foreground">
              {state.musicTrackId === NO_MUSIC_ID
                ? "None"
                : selectedTrack?.name || "–"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Resolution: </span>
            <span className="text-foreground">{state.resolution}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Subtitles: </span>
            <span className="text-foreground">
              {state.subtitlesEnabled ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Mode: </span>
            <span className="text-foreground capitalize">{state.mode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 5: Submit & Status ───────────────────────────────────────── */
function Step5({
  state,
  jobId,
  progress,
  isLoading,
  isError,
  onSubmit,
  onViewProjects,
  selectedTrack,
}: {
  state: WizardState;
  jobId: bigint | null;
  progress: number;
  isLoading: boolean;
  isError: boolean;
  onSubmit: () => void;
  onViewProjects: () => void;
  selectedTrack: (typeof MUSIC_TRACKS)[0] | undefined;
}) {
  const estimatedTime = state.mode === "basic" ? "~30 seconds" : "~2-3 minutes";

  if (jobId !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 text-center py-8"
      >
        {/* Animated icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.22 210 / 0.2), oklch(0.62 0.28 295 / 0.2))",
                border: "2px solid oklch(0.72 0.22 210 / 0.4)",
              }}
            >
              <Film
                className="w-12 h-12"
                style={{ color: "oklch(0.72 0.22 210)" }}
              />
            </div>
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ border: "2px solid oklch(0.72 0.22 210)" }}
            />
          </div>
        </div>

        <div>
          <h2 className="font-display font-bold text-2xl mb-2 gradient-text">
            Your video is generating!
          </h2>
          <p className="text-muted-foreground text-sm">
            Estimated time:{" "}
            <strong className="text-foreground">{estimatedTime}</strong>
          </p>
          <p className="text-muted-foreground text-xs mt-1 font-mono">
            Job #{jobId.toString()}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress
            value={progress}
            className="h-2"
            style={{
              background: "oklch(0.22 0.03 285)",
            }}
          />
          <p className="text-xs text-muted-foreground">{progress}% complete</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { label: "Animating", done: progress > 25 },
            { label: "Voice-over", done: progress > 55 },
            { label: "Rendering", done: progress > 85 },
          ].map(({ label, done }) => (
            <div
              key={label}
              className={`p-3 rounded-xl border text-center transition-all ${
                done
                  ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan"
                  : "border-border/40 text-muted-foreground"
              }`}
            >
              {done ? (
                <Check className="w-4 h-4 mx-auto mb-1" />
              ) : (
                <Loader2 className="w-4 h-4 mx-auto mb-1 animate-spin" />
              )}
              {label}
            </div>
          ))}
        </div>

        <Button
          onClick={onViewProjects}
          className="w-full text-white border-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
          }}
        >
          View My Projects
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">
          Ready to Generate
        </h2>
        <p className="text-muted-foreground text-sm">
          Review your settings and start processing
        </p>
      </div>

      {/* Image preview */}
      {state.imagePreviewUrl && (
        <div className="rounded-xl overflow-hidden border border-border/60 max-h-52">
          <img
            src={state.imagePreviewUrl}
            alt="Selected"
            className="w-full object-cover max-h-52"
          />
        </div>
      )}

      {/* Settings summary */}
      <div className="space-y-2">
        {[
          {
            label: "Prompt",
            value:
              state.prompt.slice(0, 80) +
              (state.prompt.length > 80 ? "..." : ""),
          },
          {
            label: "Voice",
            value: `${state.voiceGender === "male" ? "Male" : "Female"} — ${state.voiceLanguage === "en" ? "English" : "Hindi"}`,
          },
          {
            label: "Music",
            value:
              state.musicTrackId === NO_MUSIC_ID
                ? "No Music"
                : selectedTrack?.name || "–",
          },
          { label: "Resolution", value: state.resolution },
          {
            label: "Subtitles",
            value: state.subtitlesEnabled ? "Enabled" : "Disabled",
          },
          {
            label: "Mode",
            value: `${state.mode === "basic" ? "Basic (Offline)" : "Advanced AI (Online)"} · ${estimatedTime}`,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0"
          >
            <span className="text-xs text-muted-foreground w-20 flex-shrink-0">
              {label}
            </span>
            <span className="text-xs text-foreground">{value}</span>
          </div>
        ))}
      </div>

      {isError && (
        <div
          data-ocid="wizard.error_state"
          className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-sm text-destructive"
        >
          Something went wrong. Please try again.
        </div>
      )}

      <Button
        onClick={onSubmit}
        disabled={isLoading}
        data-ocid="wizard.step_5.submit_button"
        className="w-full text-white border-0 py-6 text-base font-semibold"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
          boxShadow: "0 0 30px oklch(0.72 0.22 210 / 0.3)",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Uploading & Creating Job...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Generate Video
          </>
        )}
      </Button>
    </div>
  );
}
