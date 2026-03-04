// ============================================================
// Depreciation.service.ts
// Fetch layer + context definition + hook + state hook.
// Provider JSX lives in DepreciationProvider.tsx
// ============================================================
import { createContext, useContext, useState, useEffect } from "react";
import type {
  DepreciationData,
  DepreciationAsset,
  DepreciationFormValues,
} from "../models/Depreciation.types";

// ── Helpers ───────────────────────────────────────────────────

function calcAnnualDepreciation(
  cost: number,
  salvageValue: number,
  usefulLife: number,
  method: DepreciationAsset["method"],
): number {
  if (method === "قسط ثابت") return Math.round((cost - salvageValue) / usefulLife);
  return Math.round((cost * 0.2)); // simplified declining balance
}

// ── Fetch layer ───────────────────────────────────────────────

export async function fetchDepreciationData(): Promise<DepreciationData> {
  // TODO: replace with real API call
  // const res = await fetch("/api/depreciation");
  // if (!res.ok) throw new Error("Failed to fetch");
  // return res.json();

  return {
    assets: [
      {
        id: 1,
        name: "مبنى المكتب الرئيسي",
        cost: 18_000_000,
        salvageValue: 2_000_000,
        usefulLife: 20,
        method: "قسط ثابت",
        annualDepreciation: 800_000,
        accumulated: 3_200_000,
        bookValue: 14_800_000,
        purchaseDate: "2022-01-15",
      },
      {
        id: 2,
        name: "معدات البناء",
        cost: 5_500_000,
        salvageValue: 500_000,
        usefulLife: 10,
        method: "قسط ثابت",
        annualDepreciation: 500_000,
        accumulated: 2_000_000,
        bookValue: 3_500_000,
        purchaseDate: "2022-06-20",
      },
      {
        id: 3,
        name: "أسطول النقل",
        cost: 1_500_000,
        salvageValue: 150_000,
        usefulLife: 5,
        method: "قسط متناقص",
        annualDepreciation: 270_000,
        accumulated: 810_000,
        bookValue: 690_000,
        purchaseDate: "2023-03-10",
      },
    ],
    trend: [
      { year: "2022", depreciation: 650_000 },
      { year: "2023", depreciation: 1_300_000 },
      { year: "2024", depreciation: 1_570_000 },
      { year: "2025", depreciation: 1_570_000 },
      { year: "2026", depreciation: 1_570_000 },
    ],
    summary: {
      totalAssetValue:    25_000_000,
      totalAccumulated:    6_010_000,
      totalBookValue:     18_990_000,
      annualDepreciation:  1_570_000,
    },
  };
}

export async function createAsset(values: DepreciationFormValues): Promise<DepreciationAsset> {
  // TODO: replace with real API call
  // const res = await fetch("/api/depreciation", { method: "POST", body: JSON.stringify(values) });
  // return res.json();

  const cost         = parseFloat(values.cost);
  const salvageValue = parseFloat(values.salvageValue);
  const usefulLife   = parseInt(values.usefulLife);
  const annual       = calcAnnualDepreciation(cost, salvageValue, usefulLife, values.method);

  return {
    id:                 Date.now(),
    name:               values.name,
    cost,
    salvageValue,
    usefulLife,
    method:             values.method,
    annualDepreciation: annual,
    accumulated:        0,
    bookValue:          cost,
    purchaseDate:       values.purchaseDate,
  };
}

export async function updateAsset(
  id: number,
  values: DepreciationFormValues,
): Promise<DepreciationAsset> {
  // TODO: replace with real API call
  // const res = await fetch(`/api/depreciation/${id}`, { method: "PUT", body: JSON.stringify(values) });
  // return res.json();

  const cost         = parseFloat(values.cost);
  const salvageValue = parseFloat(values.salvageValue);
  const usefulLife   = parseInt(values.usefulLife);
  const annual       = calcAnnualDepreciation(cost, salvageValue, usefulLife, values.method);

  return {
    id,
    name:               values.name,
    cost,
    salvageValue,
    usefulLife,
    method:             values.method,
    annualDepreciation: annual,
    accumulated:        0,
    bookValue:          cost,
    purchaseDate:       values.purchaseDate,
  };
}

export async function deleteAsset(id: number): Promise<void> {
  // TODO: replace with real API call
  // await fetch(`/api/depreciation/${id}`, { method: "DELETE" });
  console.log("Deleted asset", id);
}

// ── Context ───────────────────────────────────────────────────

export interface DepreciationContextValue {
  data:        DepreciationData | null;
  loading:     boolean;
  error:       string | null;
  modalOpen:   boolean;
  editAsset:   DepreciationAsset | null;
  openCreate:  () => void;
  openEdit:    (asset: DepreciationAsset) => void;
  closeModal:  () => void;
  handleSave:  (values: DepreciationFormValues) => Promise<void>;
  handleDelete:(id: number) => Promise<void>;
}

export const DepreciationContext = createContext<DepreciationContextValue | null>(null);

export function useDepreciation(): DepreciationContextValue {
  const ctx = useContext(DepreciationContext);
  if (!ctx) throw new Error("useDepreciation must be used inside <DepreciationProvider>");
  return ctx;
}

export function useDepreciationState(): DepreciationContextValue {
  const [data,      setData]      = useState<DepreciationData | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<DepreciationAsset | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDepreciationData()
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => { if (!cancelled) setError("تعذّر تحميل البيانات"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function openCreate() { setEditAsset(null); setModalOpen(true); }
  function openEdit(asset: DepreciationAsset) { setEditAsset(asset); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditAsset(null); }

  async function handleSave(values: DepreciationFormValues) {
    if (!data) return;
    if (editAsset) {
      const updated = await updateAsset(editAsset.id, values);
      setData({
        ...data,
        assets: data.assets.map((a) => (a.id === updated.id ? updated : a)),
      });
    } else {
      const created = await createAsset(values);
      setData({ ...data, assets: [...data.assets, created] });
    }
  }

  async function handleDelete(id: number) {
    if (!data) return;
    await deleteAsset(id);
    setData({ ...data, assets: data.assets.filter((a) => a.id !== id) });
    closeModal();
  }

  return { data, loading, error, modalOpen, editAsset, openCreate, openEdit, closeModal, handleSave, handleDelete };
}
