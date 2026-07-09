"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BadgeCheck,
  BrainCircuit,
  Copy,
  Download,
  Share2,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SessionAnalysis } from "@/types/shopper";
import type { SessionEvent } from "@/types/events";
import { AnalysisStateHeader } from "@/components/analyzer/analysis-state-header";
import { SessionTimeline } from "@/components/analyzer/session-timeline";
import { RecommendationCard } from "@/components/analyzer/recommendation-card";
import { ReasoningPanel } from "@/components/analyzer/reasoning-panel";

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

interface AiOutputCardProps {
  analysis: SessionAnalysis;
  events: SessionEvent[];
  /** When true, hides interactive chrome and applies print-friendly section wrapping for window.print(). */
  printMode?: boolean;
}

/** Escapes a single CSV field: wraps in quotes (doubling internal quotes) if it contains a comma, quote, or newline. */
function csvField(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(fields: (string | number)[]): string {
  return fields.map(csvField).join(",");
}

export function AiOutputCard({ analysis, events, printMode = false }: AiOutputCardProps) {
  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    toast.success("Analysis JSON copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cartguru-analysis-${analysis.sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Analysis downloaded");
  };

  const handleExportCsv = () => {
    const lines: string[] = [];

    lines.push(csvRow(["Field", "Value"]));
    lines.push(csvRow(["sessionId", analysis.sessionId]));
    lines.push(csvRow(["createdAt", analysis.createdAt]));
    lines.push(csvRow(["shopperState", analysis.shopperState]));
    lines.push(csvRow(["confidence", analysis.confidence]));
    lines.push(csvRow(["evidenceStrength", analysis.evidenceStrength]));
    lines.push(csvRow(["modelConfidence", analysis.modelConfidence]));
    lines.push(csvRow(["urgency", analysis.urgency]));
    lines.push(csvRow(["riskLevel", analysis.riskLevel]));
    lines.push(csvRow(["expectedLift", analysis.expectedLift]));
    lines.push(csvRow(["estimatedRevenueImpact", analysis.estimatedRevenueImpact]));
    lines.push("");

    lines.push(csvRow(["Evidence"]));
    for (const item of analysis.evidence) {
      lines.push(csvRow([item]));
    }
    lines.push("");

    lines.push(csvRow(["title", "type", "why", "expectedConversionLift", "confidence", "effort", "priority"]));
    for (const rec of analysis.recommendations) {
      lines.push(
        csvRow([rec.title, rec.type, rec.why, rec.expectedConversionLift, rec.confidence, rec.effort, rec.priority])
      );
    }

    const csv = lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cartguru-analysis-${analysis.sessionId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Analysis exported as CSV");
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleShare = async () => {
    const topRecommendations = analysis.recommendations
      .slice()
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3);

    const lines = [
      "CartGuru Session Analysis",
      `Shopper state: ${analysis.shopperState} (${analysis.confidence}% confidence)`,
      "",
      "Evidence:",
      ...analysis.evidence.map((item) => `- ${item}`),
      "",
      `Final decision: ${analysis.reasoning.finalDecision}`,
      `Business strategy: ${analysis.reasoning.businessStrategy}`,
      "",
      `Recommended action: ${analysis.recommendedAction}`,
      `Expected impact: ${analysis.expectedBusinessImpact} (${analysis.expectedLift})`,
      `Estimated revenue impact: ${formatCurrency(analysis.estimatedRevenueImpact)}`,
      "",
      "Top recommendations:",
      ...topRecommendations.map(
        (rec, i) => `${i + 1}. ${rec.title} — expected lift ${rec.expectedConversionLift} (${rec.confidence}% confidence)`
      ),
    ];

    await navigator.clipboard.writeText(lines.join("\n"));
    toast.success("Shareable summary copied to clipboard");
  };

  return (
    <motion.div
      key={analysis.id}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
      className="flex flex-col gap-6"
    >
      {/* Header card */}
      <motion.div variants={cardVariants} className="print-section">
        <AnalysisStateHeader analysis={analysis} />
      </motion.div>

      {/* Evidence + AI explanation */}
      <motion.div variants={cardVariants}>
      <Card className="border-border print-section">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-accent-blue" />
            <h3 className="font-display text-base font-semibold text-foreground">Evidence</h3>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-0">
          <ul className="space-y-2">
            {analysis.evidence.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-confidence-high" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Separator />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-accent-purple" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Explanation</span>
            </div>
            <motion.p
              key={analysis.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm leading-relaxed text-foreground/90"
            >
              {analysis.aiExplanation}
            </motion.p>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Recommended action callout */}
      <motion.div
        variants={cardVariants}
        className="gradient-border print-section relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-purple/10 via-surface to-accent-blue/5 shadow-glow-purple"
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-accent-purple" />
            <span className="text-xs font-semibold uppercase tracking-wide text-accent-purple">Recommended action</span>
          </div>
          <p className="font-display text-lg font-semibold leading-snug text-foreground">{analysis.recommendedAction}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{analysis.expectedBusinessImpact}</p>

          <div className="mt-2 flex flex-wrap items-center gap-6">
            <div>
              <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">Expected lift</span>
              <span className="font-display text-xl font-bold text-confidence-high">{analysis.expectedLift}</span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">Est. revenue impact</span>
              <span className="flex items-center gap-1 font-display text-xl font-bold text-foreground">
                <DollarSign className="h-4 w-4 text-confidence-high" />
                {formatCurrency(analysis.estimatedRevenueImpact)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={cardVariants}>
      <Card className="border-border print-section">
        <CardHeader>
          <h3 className="font-display text-base font-semibold text-foreground">Session timeline</h3>
          <p className="text-xs text-muted-foreground">
            Hover a node for event details. Highlighted nodes are the signals that drove this classification.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <SessionTimeline events={events} timelineEvidence={analysis.timelineEvidence} />
        </CardContent>
      </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={cardVariants} className="print-section">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-foreground">Personalization recommendations</h3>
          <span className="text-xs text-muted-foreground">{analysis.recommendations.length} suggested</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {analysis.recommendations
            .slice()
            .sort((a, b) => a.priority - b.priority)
            .map((rec, i) => (
              <RecommendationCard key={rec.id} recommendation={rec} index={i} />
            ))}
        </div>
      </motion.div>

      {/* Reasoning panel */}
      <motion.div variants={cardVariants} className="print-section">
        <h3 className="mb-3 font-display text-base font-semibold text-foreground">How the AI got here</h3>
        <ReasoningPanel reasoning={analysis.reasoning} />
      </motion.div>

      {/* Action buttons — always excluded from the print stylesheet so window.print() produces a clean report */}
      <motion.div
        variants={cardVariants}
        className={cn("no-print flex flex-wrap gap-2 border-t border-border pt-5", printMode && "opacity-90")}
      >
        <Button variant="outline" size="sm" onClick={handleCopyJson}>
          <Copy /> Copy JSON
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download /> Download analysis
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportCsv}>
          <FileSpreadsheet /> Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPdf}>
          <Printer /> Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 /> Share result
        </Button>
      </motion.div>
    </motion.div>
  );
}
