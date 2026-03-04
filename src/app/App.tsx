import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LangProvider } from "./core/context/LangContext";

export default function App() {
  return (
    <LangProvider>
      <div className="dark">
        <RouterProvider router={router} />
      </div>
    </LangProvider>
  );
}
