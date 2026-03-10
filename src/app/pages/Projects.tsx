// ============================================================
// Projects.tsx — Main Projects page
// ProjectDetails now embeds CostBreakdownManager +
// BudgetActualManager so users manage those datasets inline.
// ============================================================
import { useEffect, useState, useCallback } from "react";
import { useLang }             from "../core/context/LangContext";
import { useProjectContext }   from "../core/context/ProjectContext";
import { projectsService }     from "../core/services/project.service";
import { tProj, dirAttr }      from "../core/i18n/projects.i18n";
import ProjectsHeader          from "../components/Projects/ProjectsHeader";
import ProjectStats            from "../components/Projects/ProjectStats";
import ProjectsTable           from "../components/Projects/ProjectsTable";
import ProjectDetails          from "../components/Projects/ProjectDetails";
import ProjectModal            from "../components/Projects/ProjectModal";
import DeleteConfirm           from "../components/Projects/DeleteConfirm";
import CostBreakdownManager    from "../components/projects/CostBreakdownManager";
import BudgetActualManager     from "../components/projects/BudgetActualManager";
import type {
  Project, ProjectStats as TStats,
  CostBreakdownItem, BudgetActualItem,
  ModalMode, ProjectFormValues,
} from "../core/models/projects.types";

function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-2xl bg-white/5 animate-pulse ${className}`} />;
}

export default function Projects() {
  const { lang }                                            = useLang();
  const { setProjects: setCtxProjects, setSelectedProject } = useProjectContext();

  const [projects,      setProjects]      = useState<Project[]>([]);
  const [stats,         setStats]         = useState<TStats | null>(null);
  const [selectedId,    setSelectedId]    = useState<number | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownItem[]>([]);
  const [budgetActual,  setBudgetActual]  = useState<BudgetActualItem[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(false);

  const [modalOpen,     setModalOpen]     = useState(false);
  const [modalMode,     setModalMode]     = useState<ModalMode>("add");
  const [modalProject,  setModalProject]  = useState<Project | null>(null);
  const [deleteOpen,    setDeleteOpen]    = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedId) ?? null;

  // ── Initial load ────────────────────────────────────────────
  useEffect(() => {
    Promise.all([projectsService.fetchProjects(), projectsService.fetchStats()])
      .then(([projs, s]) => {
        setProjects(projs);
        setCtxProjects(projs);
        setStats(s);
        if (projs[0]) { setSelectedId(projs[0].id); setSelectedProject(projs[0]); }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load chart data when selection changes ──────────────────
  useEffect(() => {
    if (selectedId == null) return;
    Promise.all([
      projectsService.fetchCostBreakdown(selectedId),
      projectsService.fetchBudgetActual(selectedId),
    ]).then(([cb, ba]) => { setCostBreakdown(cb); setBudgetActual(ba); });
  }, [selectedId]);

  const refreshStats = useCallback(async () => {
    const s = await projectsService.fetchStats();
    setStats(s);
  }, []);

  // ── Selection ───────────────────────────────────────────────
  const handleSelect = (project: Project) => {
    const newId = project.id === selectedId ? null : project.id;
    setSelectedId(newId);
    setSelectedProject(newId ? project : null);
  };

  // ── Modal openers ───────────────────────────────────────────
  const openAdd    = () => { setModalMode("add");  setModalProject(null);    setModalOpen(true); };
  const openView   = (p: Project) => { setModalMode("view"); setModalProject(p); setModalOpen(true); };
  const openEdit   = (p: Project) => { setModalMode("edit"); setModalProject(p); setModalOpen(true); };
  const openDelete = (p: Project) => { setDeleteProject(p); setDeleteOpen(true); };

  // ── Save project ────────────────────────────────────────────
  const handleSave = async (values: ProjectFormValues) => {
    if (modalMode === "add") {
      const created = await projectsService.createProject(values);
      const updated = [...projects, created];
      setProjects(updated);
      setCtxProjects(updated);
      setSelectedId(created.id);
      setSelectedProject(created);
      // Reset manager data for fresh project
      setCostBreakdown([]);
      setBudgetActual([]);
    } else if (modalMode === "edit" && modalProject) {
      const updatedP = await projectsService.updateProject(modalProject.id, values);
      const updated  = projects.map((p) => p.id === updatedP.id ? updatedP : p);
      setProjects(updated);
      setCtxProjects(updated);
      if (selectedId === updatedP.id) setSelectedProject(updatedP);
    }
    await refreshStats();
  };

  // ── Delete project ──────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteProject) return;
    await projectsService.deleteProject(deleteProject.id);
    const updated = projects.filter((p) => p.id !== deleteProject.id);
    setProjects(updated);
    setCtxProjects(updated);
    if (selectedId === deleteProject.id) {
      const next = updated[0] ?? null;
      setSelectedId(next?.id ?? null);
      setSelectedProject(next);
      setCostBreakdown([]);
      setBudgetActual([]);
    }
    setDeleteOpen(false);
    setDeleteProject(null);
    await refreshStats();
  };

  // ── Loading / error ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6" dir={dirAttr(lang)}>
        <Skeleton className="h-16" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
        <p className="text-center text-gray-500 text-sm">{tProj(lang, "loading")}</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tProj(lang, "loadError")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8" dir={dirAttr(lang)}>
      <ProjectsHeader lang={lang} onAddProject={openAdd} />

      {stats && <ProjectStats stats={stats} lang={lang} />}

      <ProjectsTable
        projects={projects}
        lang={lang}
        selectedProjectId={selectedId}
        onSelect={handleSelect}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {selectedProject && (
        <>
          {/* Core project KPIs / charts */}
          <ProjectDetails
            project={selectedProject}
            costBreakdown={costBreakdown}
            budgetActual={budgetActual}
            lang={lang}
          />

          {/* ── User-managed data panels ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <CostBreakdownManager
              projectId={selectedProject.id}
              items={costBreakdown}
              lang={lang}
              onSaved={setCostBreakdown}
            />
            <BudgetActualManager
              projectId={selectedProject.id}
              items={budgetActual}
              lang={lang}
              onSaved={setBudgetActual}
            />
          </div>
        </>
      )}

      <ProjectModal
        isOpen={modalOpen}
        mode={modalMode}
        project={modalProject}
        lang={lang}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onEdit={(p) => { setModalOpen(false); setTimeout(() => openEdit(p), 150); }}
      />

      <DeleteConfirm
        isOpen={deleteOpen}
        project={deleteProject}
        lang={lang}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteOpen(false); setDeleteProject(null); }}
      />
    </div>
  );
}
