// ============================================================
// BOQUploadArea.tsx
// Two upload drop-zones: BOQ file + supplier quotes.
// Accepts real File objects via hidden <input> or drag-and-drop.
// Calls parent handlers — no internal fetch logic.
// Fully RTL-aware and responsive.
// ============================================================
import { useRef } from "react";
import { FileSpreadsheet, Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import GlassCard         from "../../core/shared/components/GlassCard";
import { tBOQ }          from "../../core/i18n/boqComparison.i18n";
import type { BOQUploadAreaProps, UploadStatus } from "../../core/models/BOQComparison.types";

// ── Single zone ───────────────────────────────────────────────
interface ZoneProps {
  title:       string;
  subtitle:    string;
  hint:        string;
  icon:        React.ReactNode;
  accentClass: string;        // e.g. "text-orange-500"
  bgClass:     string;        // e.g. "bg-orange-500/10"
  borderHover: string;        // e.g. "hover:border-orange-500/50"
  status:      UploadStatus;
  successText: string;
  uploadingText: string;
  errorText:   string;
  accept:      string;
  multiple:    boolean;
  onFile:      (file: File) => void;
  isRtl:       boolean;
}

function UploadZone({
  title, subtitle, hint, icon, accentClass, bgClass, borderHover,
  status, successText, uploadingText, errorText,
  accept, multiple, onFile, isRtl,
}: ZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  const StatusBadge = () => {
    if (status === "uploading")
      return (
        <div className={`flex items-center gap-2 ${accentClass} opacity-80`}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">{uploadingText}</span>
        </div>
      );
    if (status === "success")
      return (
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm">{successText}</span>
        </div>
      );
    if (status === "error")
      return (
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{errorText}</span>
        </div>
      );
    return null;
  };

  const isIdle = status === "idle" || status === "error";

  return (
    <GlassCard className="p-4 sm:p-6">
      <div
        role="button"
        tabIndex={0}
        aria-label={title}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => isIdle && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && isIdle && inputRef.current?.click()}
        className={`
          border-2 border-dashed border-white/20 rounded-xl
          p-6 sm:p-8 text-center transition-all
          ${isIdle ? `${borderHover} hover:bg-white/5 cursor-pointer` : "cursor-default"}
          ${status === "success" ? "border-emerald-500/30 bg-emerald-500/5" : ""}
          ${status === "uploading" ? "border-white/10 opacity-70" : ""}
          ${status === "error" ? "border-red-500/30 bg-red-500/5" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />

        <div className={`flex flex-col items-center gap-3 sm:gap-4 ${isRtl ? "text-right" : "text-left"} items-center`}>
          {/* Icon */}
          <div className={`p-3 sm:p-4 rounded-full ${bgClass} shrink-0`}>
            {icon}
          </div>

          {/* Text */}
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
            <p className="text-xs text-gray-500">{hint}</p>
          </div>

          {/* Status badge */}
          <StatusBadge />
        </div>
      </div>
    </GlassCard>
  );
}

// ── Exported component ────────────────────────────────────────
export default function BOQUploadArea({
  boqStatus, quotesStatus, onBOQUpload, onQuotesUpload, lang,
}: BOQUploadAreaProps) {
  const isRtl = lang === "ar";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* BOQ file */}
      <UploadZone
        title={tBOQ(lang, "uploadBOQTitle")}
        subtitle={tBOQ(lang, "uploadBOQSub")}
        hint={tBOQ(lang, "uploadBOQHint")}
        icon={<FileSpreadsheet className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />}
        accentClass="text-orange-400"
        bgClass="bg-orange-500/10"
        borderHover="hover:border-orange-500/50"
        status={boqStatus}
        successText={tBOQ(lang, "uploadSuccess")}
        uploadingText={tBOQ(lang, "uploadUploading")}
        errorText={tBOQ(lang, "uploadError")}
        accept=".xlsx,.xls,.csv"
        multiple={false}
        onFile={onBOQUpload}
        isRtl={isRtl}
      />

      {/* Supplier quotes */}
      <UploadZone
        title={tBOQ(lang, "uploadQuotesTitle")}
        subtitle={tBOQ(lang, "uploadQuotesSub")}
        hint={tBOQ(lang, "uploadQuotesHint")}
        icon={<Upload className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />}
        accentClass="text-emerald-400"
        bgClass="bg-emerald-500/10"
        borderHover="hover:border-emerald-500/50"
        status={quotesStatus}
        successText={tBOQ(lang, "uploadSuccess")}
        uploadingText={tBOQ(lang, "uploadUploading")}
        errorText={tBOQ(lang, "uploadError")}
        accept=".xlsx,.xls,.pdf"
        multiple
        onFile={onQuotesUpload}
        isRtl={isRtl}
      />
    </div>
  );
}
