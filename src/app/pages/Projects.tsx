import { useEffect, useState } from "react";

import Header from "../components/projects/Header";
import ProjectsStats from "../components/projects/ProjectStats";
import ProjectDetails from "../components/projects/ProjectDetails";
import ProjectTable from "../components/projects/ProjectsTable";

import { projectService } from "../core/services/project.service";
import type { Project } from "../core/models/projects.types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const data = await projectService.getProjects();
      setProjects(data);
      setSelectedProject(data[0] ?? null);
      setLoading(false);
    }

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Header />

      <ProjectsStats projects={projects} />

      <ProjectTable
        projects={projects}
        selectedProjectId={selectedProject?.id}
        onSelect={setSelectedProject}
      />

      {selectedProject && (
        <ProjectDetails
          key={selectedProject.id}
          project={selectedProject}
        />
      )}
    </div>
  );
}
