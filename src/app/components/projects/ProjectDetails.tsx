import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import GlassCard from "../../core/shared/components/GlassCard";
import { projectService } from "../../core/services/project.service";
import type { Project, ProjectDetailsModel } from "../../core/models/projects.types";

interface ProjectDetailsProps {
  project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const [details, setDetails] = useState<ProjectDetailsModel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!project?.id) return;

    async function loadDetails() {
      setLoading(true);
      setDetails(null);
      const data = await projectService.getProjectDetails(project.id);
      setDetails(data);
      setLoading(false);
    }

    loadDetails();
  }, [project.id]);

  if (!project) return null;

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        تفاصيل المشروع: {project.name}
      </h2>

      {loading || !details ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget vs Actual */}
          <GlassCard>
            <h3 className="text-xl font-bold text-white mb-6">الميزانية مقابل الفعلي</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={details.budgetVsActual}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="phase" stroke="#94A3B8" style={{ fontSize: "12px" }} />
                <YAxis stroke="#94A3B8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="budget" fill="#94A3B8" radius={[8, 8, 0, 0]} name="الميزانية" />
                <Bar dataKey="actual" fill="#F97316" radius={[8, 8, 0, 0]} name="الفعلي" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Cost Breakdown */}
          <GlassCard>
            <h3 className="text-xl font-bold text-white mb-6">توزيع التكاليف</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={details.costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {details.costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* AI Overrun Prediction */}
          <GlassCard className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">توقع تجاوز التكلفة (AI)</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  بناءً على معدل الإنفاق الحالي، هناك احتمالية{" "}
                  <span className="text-orange-400 font-bold">{details.overrunProbability}%</span>{" "}
                  لتجاوز الميزانية بمقدار{" "}
                  <span className="text-orange-400 font-bold">
                    {(details.overrunAmount / 1_000_000).toFixed(1)} مليون ر.س
                  </span>
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>آخر تحديث: منذ ساعتين</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* AI Delay Prediction */}
          <GlassCard className="bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">توقع التأخير (AI)</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  معدل الإنجاز الحالي أقل من المخطط بنسبة{" "}
                  <span className="text-red-400 font-bold">{details.delayPercent}%</span>، مما قد
                  يؤدي إلى تأخير{" "}
                  <span className="text-red-400 font-bold">{details.delayWeeks} أسابيع</span> في
                  التسليم النهائي
                </p>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm">
                  عرض الحلول المقترحة
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </motion.div>
  );
}
