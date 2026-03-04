import KPICards from "../components/dashboard/KPICards";
import AIAlertPanel from "../components/dashboard/AIAlertPanel";
import ChartsGrid from "../components/dashboard/ChartsGrid";
import AIHealthScore from "../components/dashboard/AIHealthScore";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header />

      {/* KPI Cards */}
      <KPICards />

      {/* AI Health Score */}
      <AIHealthScore />

      {/* Charts Grid */}
      <ChartsGrid></ChartsGrid>

      {/* AI Alert Panel */}
      <AIAlertPanel />
    </div>
  );
}
