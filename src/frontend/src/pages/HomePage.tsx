import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  Download,
  Film,
  Github,
  Mic2,
  Music,
  Sparkles,
  Star,
  Subtitles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onCreateClick: () => void;
  isOnlineMode: boolean;
  onToggleMode: () => void;
}

const features = [
  {
    icon: <Film className="w-5 h-5" />,
    title: "AnimateDiff Rendering",
    desc: "State-of-the-art image-to-video diffusion model",
    color: "oklch(0.72 0.22 210)",
  },
  {
    icon: <Mic2 className="w-5 h-5" />,
    title: "Coqui TTS Voice-over",
    desc: "Natural male/female voices in English & Hindi",
    color: "oklch(0.62 0.28 295)",
  },
  {
    icon: <Music className="w-5 h-5" />,
    title: "Curated Music Library",
    desc: "Cinematic, epic, calm & more background tracks",
    color: "oklch(0.68 0.25 335)",
  },
  {
    icon: <Subtitles className="w-5 h-5" />,
    title: "Auto Subtitles",
    desc: "AI-generated captions synchronized to voice",
    color: "oklch(0.75 0.18 145)",
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: "HD / 4K Export",
    desc: "Export without watermarks — free forever",
    color: "oklch(0.78 0.2 65)",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Open Source Models",
    desc: "Stable Diffusion, AnimateDiff, Coqui TTS",
    color: "oklch(0.72 0.22 210)",
  },
];

const examples = [
  { label: "Landscape → Cinematic flyover", tag: "Epic" },
  { label: "Portrait → Animated story reel", tag: "Cinematic" },
  { label: "Product photo → Promo video", tag: "Upbeat" },
  { label: "Nature shot → Peaceful ambient", tag: "Calm" },
];

export default function HomePage({
  onCreateClick,
  isOnlineMode,
  onToggleMode,
}: HomePageProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center justify-center px-4 pt-8 pb-16">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: "url(/assets/generated/hero-bg.dim_1400x800.jpg)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.62 0.28 295 / 0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 100%, oklch(0.72 0.22 210 / 0.1) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Mode Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <button
              type="button"
              onClick={onToggleMode}
              data-ocid="home.mode_toggle"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all
                ${
                  isOnlineMode
                    ? "border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20"
                    : "border-border text-muted-foreground bg-muted/20 hover:bg-muted/40"
                }
              `}
            >
              <span
                className={`w-2 h-2 rounded-full ${isOnlineMode ? "bg-neon-cyan animate-pulse" : "bg-muted-foreground"}`}
              />
              {isOnlineMode
                ? "Online — Advanced AI Mode"
                : "Offline — Basic Mode"}
              <span className="opacity-60">(click to switch)</span>
            </button>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight mb-6">
              <span className="block text-foreground/90">Transform</span>
              <span className="block gradient-text">Any Image</span>
              <span className="block text-foreground/90">Into Video</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-3 leading-relaxed"
          >
            AI-powered image-to-video with voice-over, background music & auto
            subtitles. Free, open source, no watermarks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-10"
          >
            {[
              "AnimateDiff",
              "Coqui TTS",
              "HD/4K Export",
              "No Watermark",
              "Open Source",
            ].map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-border/60 text-muted-foreground text-xs"
              >
                {tag}
              </Badge>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              onClick={onCreateClick}
              data-ocid="home.create_button"
              size="lg"
              className="relative overflow-hidden px-8 py-6 text-base font-semibold rounded-xl border-0 text-white group"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
                boxShadow:
                  "0 0 30px oklch(0.72 0.22 210 / 0.4), 0 0 80px oklch(0.72 0.22 210 / 0.15)",
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.22 210), oklch(0.68 0.28 295))",
                }}
              />
              <span className="relative flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Create Video Now
              </span>
            </Button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors text-sm font-medium"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">
            <span className="gradient-text">Everything you need</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            Professional-grade AI video creation, completely free
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative p-5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm hover:border-border transition-colors group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-white"
                style={{
                  background: `${feat.color}22`,
                  color: feat.color,
                  border: `1px solid ${feat.color}44`,
                }}
              >
                {feat.icon}
              </div>
              <h3 className="font-display font-semibold text-sm mb-1 text-foreground">
                {feat.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section className="px-4 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">
            What can you make?
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {examples.map((ex, i) => (
            <motion.div
              key={ex.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={onCreateClick}
            >
              <Badge
                variant="outline"
                className="text-xs mb-2"
                style={{
                  borderColor: "oklch(0.72 0.22 210 / 0.4)",
                  color: "oklch(0.72 0.22 210)",
                }}
              >
                {ex.tag}
              </Badge>
              <p className="text-foreground/80 text-xs font-medium leading-snug">
                {ex.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl p-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.22 210 / 0.1), oklch(0.62 0.28 295 / 0.1))",
            border: "1px solid oklch(0.72 0.22 210 / 0.2)",
          }}
        >
          <Sparkles
            className="w-8 h-8 mx-auto mb-4"
            style={{ color: "oklch(0.72 0.22 210)" }}
          />
          <h2 className="font-display font-bold text-xl sm:text-2xl mb-2">
            Ready to create something amazing?
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            No sign-up required. No watermarks. Truly free.
          </p>
          <Button
            onClick={onCreateClick}
            size="lg"
            className="px-8 font-semibold text-white border-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
            }}
          >
            <Star className="w-4 h-4 mr-2" />
            Start Creating
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-4 py-6 text-center">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
