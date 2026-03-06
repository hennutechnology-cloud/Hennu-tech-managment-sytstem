// ============================================================
// ProjectContext.tsx
// Shared context between Layout (project switcher) and the
// Projects page + its components.
//
// Holds:
//   • projects list   — source of truth for the sidebar switcher
//   • selectedProject — which project drives ProjectDetails
//
// Layout reads projects/selectedProject to render the switcher.
// Projects page reads/writes both via the context hooks.
// ============================================================
import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from "react";
import { projectsService } from "../services/project.service";
import type { Project } from "../models/projects.types";

interface ProjectContextValue {
  /** Full list — kept in sync after every create/update/delete */
  projects:         Project[];
  setProjects:      (projects: Project[]) => void;

  /** The project whose details are shown in ProjectDetails */
  selectedProject:  Project | null;
  setSelectedProject: (project: Project | null) => void;

  /** True while the initial fetch is running */
  projectsLoading:  boolean;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects,        setProjects]        = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Bootstrap: fetch projects once on mount so the sidebar
  // switcher is populated before the Projects page even renders.
  useEffect(() => {
    projectsService.fetchProjects()
      .then((projs) => {
        setProjects(projs);
        setSelectedProject(projs[0] ?? null);
      })
      .finally(() => setProjectsLoading(false));
  }, []);

  // When the projects list changes (after a mutation), keep
  // selectedProject in sync — if the selected one was deleted,
  // fall back to the first item.
  const handleSetProjects = useCallback((projs: Project[]) => {
    setProjects(projs);
    setSelectedProject((prev) => {
      if (!prev) return projs[0] ?? null;
      const stillExists = projs.find((p) => p.id === prev.id);
      return stillExists ?? projs[0] ?? null;
    });
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects:       handleSetProjects,
        selectedProject,
        setSelectedProject,
        projectsLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectContext must be used inside <ProjectProvider>");
  return ctx;
}
