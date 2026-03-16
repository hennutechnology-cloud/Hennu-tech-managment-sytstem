// ============================================================
// SubcontractorGrid.tsx
// ============================================================
import SubcontractorCard from "./SubcontractorCard";
import type { SubcontractorGridProps } from "../../core/models/subcontractor.types";

export default function SubcontractorGrid({ subcontractors, statsMap, onDetails }: SubcontractorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subcontractors.map((sub) => (
        <SubcontractorCard
          key={sub.id}
          subcontractor={sub}
          stats={statsMap[sub.id]}
          onDetails={() => onDetails(sub.id)}
        />
      ))}
    </div>
  );
}
