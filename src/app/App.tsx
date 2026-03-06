import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LangProvider } from "./core/context/LangContext";
import { ProjectProvider } from "./core/context/ProjectContext";

export default function App() {
  return (
    <LangProvider>
      <ProjectProvider>
        <div className="dark">
          <RouterProvider router={router} />
        </div>
      </ProjectProvider>
    </LangProvider>
  );
}
