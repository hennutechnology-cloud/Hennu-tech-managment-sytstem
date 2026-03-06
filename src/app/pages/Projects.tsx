// ============================================================
// Projects.tsx — page orchestrator
// Reads/writes projects and selectedProject via ProjectContext
// so the Layout sidebar switcher stays in sync automatically.
// ============================================================
import { useEffect, useState, useCallback } from "react";
import { useLang }             from "../core/context/LangContext";
import { useProjectContext }   from "../core/context/ProjectContext";
import { tProj }               from "../core/i18n/projects.i18n";
import { projectsService }     from "../core/services/project.service";
import ProjectsHeader          from "../components/projects/ProjectsHeader";
import ProjectsTable           from "../components/projects/ProjectsTable";
import ProjectDetails          from "../components/projects/ProjectDetails";
import ProjectStats            from "../components/projects/ProjectStats";
import ProjectModal            from "../components/projects/ProjectModal";
import DeleteConfirm           from "../components/projects/DeleteConfirm";
import type {
  Project, ProjectFormValues, ProjectStats as Stats,
  CostBreakdownItem, BudgetActualItem, ModalMode,
} from "../core/models/projects.types";

function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-2xl bg-white/5 animate-pulse ${className}`} />;
}

export default function Projects() {
  const { lang } = useLang();

  // ── Shared context ───────────────────────────────────────────
  // projects + selectedProject live in context so the Layout
  // sidebar switcher is always in sync with this page.
  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    projectsLoading,
  } = useProjectContext();

  // ── Page-local state ─────────────────────────────────────────
  const [stats,         setStats]         = useState<Stats | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownItem[]>([]);
  const [budgetActual,  setBudgetActual]  = useState<BudgetActualItem[]>([]);
  const [statsLoading,  setStatsLoading]  = useState(true);
  const [error,         setError]         = useState(false);

  const [modalOpen,    setModalOpen]    = useState(false);
  const [modalMode,    setModalMode]    = useState<ModalMode>("add");
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // ── Fetch stats (projects list already loaded by context) ────
  useEffect(() => {
    projectsService.fetchStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Fetch charts when selected project changes ────────────────
  useEffect(() => {
    if (!selectedProject) return;
    Promise.all([
      projectsService.fetchCostBreakdown(selectedProject.id),
      projectsService.fetchBudgetActual(selectedProject.id),
    ]).then(([cb, ba]) => {
      setCostBreakdown(cb);
      setBudgetActual(ba);
    });
  }, [selectedProject]);

  // ── Modal openers ────────────────────────────────────────────
  const openAdd = () => {
    setModalProject(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const openView = (project: Project) => {
    setModalProject(project);
    setModalMode("view");
    setModalOpen(true);
    // Eye button also selects the project for the details section
    setSelectedProject(project);
  };

  const openEdit = (project: Project) => {
    setModalProject(project);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openDelete = (project: Project) => {
    setDeleteTarget(project);
    setDeleteOpen(true);
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = useCallback(async (values: ProjectFormValues) => {
    let updated: Project[];
    if (modalMode === "add" || !modalProject) {
      updated = await projectsService.createProject(values);
    } else {
      updated = await projectsService.updateProject(modalProject.id, values);
    }
    // setProjects in context handles selectedProject sync automatically
    setProjects(updated);
  }, [modalMode, modalProject, setProjects]);

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const updated = await projectsService.deleteProject(deleteTarget.id);
    setProjects(updated); // context auto-updates selectedProject
    setDeleteOpen(false);
    setDeleteTarget(null);
  }, [deleteTarget, setProjects]);

  // ── Render ───────────────────────────────────────────────────
  const isLoading = projectsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-16" />
        <Skeleton className="h-56" />
        <Skeleton className="h-80" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
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
    <div className="space-y-8">

      <ProjectsHeader lang={lang} onAddProject={openAdd} />

      <ProjectsTable
        projects={projects}
        lang={lang}
        selectedProjectId={selectedProject?.id ?? null}
        onSelect={setSelectedProject}       // row click → update details
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          costBreakdown={costBreakdown}
          budgetActual={budgetActual}
          lang={lang}
        />
      )}

      {stats && <ProjectStats stats={stats} lang={lang} />}

      <ProjectModal
        isOpen={modalOpen}
        mode={modalMode}
        project={modalProject}
        lang={lang}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onEdit={openEdit}
      />

      <DeleteConfirm
        isOpen={deleteOpen}
        project={deleteTarget}
        lang={lang}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteOpen(false); setDeleteTarget(null); }}
      />

    </div>
  );
}
