import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Cpu,
  Download,
  FolderOpen,
  Loader2,
  Music2,
  Send,
  Share2,
  Subtitles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { VideoJob } from "../backend.d.ts";
import { MUSIC_TRACKS, NO_MUSIC_ID } from "../data/musicTracks";
import {
  useAddComment,
  useAllJobs,
  useImageAsset,
  useJobComments,
} from "../hooks/useQueries";

interface ProjectsPageProps {
  onCreateNew: () => void;
}

function getStatusInfo(job: VideoJob) {
  // Simulate status based on job id parity
  const id = Number(job.id) % 4;
  const statuses = [
    {
      label: "Processing",
      color: "oklch(0.78 0.2 65)",
      bg: "oklch(0.78 0.2 65 / 0.1)",
      dot: "bg-yellow-400 animate-pulse",
    },
    {
      label: "Complete",
      color: "oklch(0.75 0.18 145)",
      bg: "oklch(0.75 0.18 145 / 0.1)",
      dot: "bg-green-400",
    },
    {
      label: "Pending",
      color: "oklch(0.72 0.22 210)",
      bg: "oklch(0.72 0.22 210 / 0.1)",
      dot: "bg-blue-400 animate-pulse",
    },
    {
      label: "Rendering",
      color: "oklch(0.62 0.28 295)",
      bg: "oklch(0.62 0.28 295 / 0.1)",
      dot: "bg-violet-400 animate-pulse",
    },
  ];
  return statuses[id];
}

function getMusicName(id: string) {
  if (!id || id === NO_MUSIC_ID || id === "") return "No Music";
  return MUSIC_TRACKS.find((t) => t.id === id)?.name || id;
}

/* ─── Job Card ─────────────────────────────────────────────────── */
function JobCard({
  job,
  index,
  onClick,
}: { job: VideoJob; index: number; onClick: () => void }) {
  const { data: imageUrl, isLoading } = useImageAsset(job.imageAssetId || null);
  const status = getStatusInfo(job);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-ocid={`projects.item.${index + 1}`}
      className="relative rounded-xl border border-border/60 bg-card/60 overflow-hidden cursor-pointer hover:border-border transition-all group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-video bg-muted/30 relative overflow-hidden">
        {isLoading ? (
          <Skeleton className="absolute inset-0 rounded-none" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={job.prompt.slice(0, 30)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <FolderOpen className="w-8 h-8 text-muted-foreground/40" />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Status badge */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
          style={{ background: status.bg, color: status.color }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
          {job.prompt || "No prompt provided"}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-xs border-border/50 text-muted-foreground px-2 py-0"
          >
            {job.resolution}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs border-border/50 text-muted-foreground px-2 py-0 capitalize"
          >
            {job.mode}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs border-border/50 text-muted-foreground px-2 py-0 capitalize"
          >
            {job.voiceGender} · {job.voiceLanguage === "en" ? "EN" : "HI"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          Job #{job.id.toString()}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Job Detail Modal ─────────────────────────────────────────── */
function JobDetailModal({ job }: { job: VideoJob; onClose: () => void }) {
  const { data: imageUrl } = useImageAsset(job.imageAssetId || null);
  const { data: comments = [], isLoading: commentsLoading } = useJobComments(
    job.id,
  );
  const addComment = useAddComment();
  const [commentText, setCommentText] = useState("");
  const status = getStatusInfo(job);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AI Video Studio",
          text: `Check out my AI video: ${job.prompt.slice(0, 60)}...`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Couldn't share");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment.mutateAsync({
        jobId: job.id,
        comment: commentText.trim(),
      });
      setCommentText("");
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  return (
    <DialogContent
      data-ocid="projects.job_detail.modal"
      className="max-w-lg max-h-[90dvh] overflow-y-auto bg-card border-border/60 p-0"
    >
      {/* Image */}
      {imageUrl && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt="Job"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 space-y-5">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
            <span>Job #{job.id.toString()}</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Prompt */}
        <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
            Prompt
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {job.prompt || "No prompt"}
          </p>
        </div>

        {/* Settings grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <Download className="w-3 h-3" />,
              label: "Resolution",
              value: job.resolution,
            },
            {
              icon: <Cpu className="w-3 h-3" />,
              label: "Mode",
              value: job.mode,
            },
            {
              icon: <Music2 className="w-3 h-3" />,
              label: "Music",
              value: getMusicName(job.musicTrackId),
            },
            {
              icon: <Subtitles className="w-3 h-3" />,
              label: "Subtitles",
              value: job.subtitlesEnabled ? "On" : "Off",
            },
            {
              icon: <Clock className="w-3 h-3" />,
              label: "Voice",
              value: `${job.voiceGender} · ${job.voiceLanguage === "en" ? "English" : "Hindi"}`,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="p-3 rounded-lg bg-muted/10 border border-border/30"
            >
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                {icon}
                <span className="text-xs capitalize">{label}</span>
              </div>
              <p className="text-xs font-medium text-foreground capitalize">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Share */}
        <Button
          variant="outline"
          onClick={handleShare}
          data-ocid="projects.job_detail.share_button"
          className="w-full border-border/60 gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Video
        </Button>

        {/* Comments */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Comments</p>

          {commentsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {comments.map((c) => (
                <div
                  key={c}
                  className="p-3 rounded-lg bg-muted/20 border border-border/30 text-xs text-foreground/80"
                >
                  {c}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No comments yet.
            </p>
          )}

          {/* Add comment */}
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              placeholder="Add a comment..."
              data-ocid="projects.job_detail.comment_input"
              className="flex-1 px-3 py-2 rounded-lg border border-border/60 bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button
              onClick={handleComment}
              disabled={addComment.isPending || !commentText.trim()}
              data-ocid="projects.job_detail.comment_submit_button"
              size="sm"
              className="text-white border-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
              }}
            >
              {addComment.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

/* ─── Projects Page ─────────────────────────────────────────────── */
export default function ProjectsPage({ onCreateNew }: ProjectsPageProps) {
  const { data: jobs = [], isLoading, isError } = useAllJobs();
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl mb-1">My Projects</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Loading..."
              : `${jobs.length} project${jobs.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          onClick={onCreateNew}
          size="sm"
          className="text-white border-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
          }}
        >
          + New Video
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="projects.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 overflow-hidden"
            >
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          data-ocid="projects.error_state"
          className="p-6 rounded-xl border border-destructive/40 bg-destructive/10 text-center"
        >
          <p className="text-destructive text-sm">
            Failed to load projects. Please try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          data-ocid="projects.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.22 210 / 0.1), oklch(0.62 0.28 295 / 0.1))",
              border: "1px solid oklch(0.72 0.22 210 / 0.2)",
            }}
          >
            <FolderOpen
              className="w-10 h-10"
              style={{ color: "oklch(0.72 0.22 210)" }}
            />
          </div>
          <h3 className="font-display font-bold text-lg mb-2">
            No projects yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Create your first AI video to see it here.
          </p>
          <Button
            onClick={onCreateNew}
            className="text-white border-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.22 210), oklch(0.62 0.28 295))",
            }}
          >
            Create Your First Video
          </Button>
        </motion.div>
      )}

      {/* Jobs grid */}
      {!isLoading && jobs.length > 0 && (
        <div
          data-ocid="projects.list"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {jobs.map((job, i) => (
            <JobCard
              key={job.id.toString()}
              job={job}
              index={i}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog
        open={!!selectedJob}
        onOpenChange={(open) => !open && setSelectedJob(null)}
      >
        <AnimatePresence>
          {selectedJob && (
            <JobDetailModal
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
            />
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
}
