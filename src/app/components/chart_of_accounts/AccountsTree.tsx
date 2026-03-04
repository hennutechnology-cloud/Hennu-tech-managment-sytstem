import { useState } from "react";
import { ChevronDown, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { Account, AccountsTreeProps, AccountType } from "../../core/models/ChartOfAccounts.types";

const TYPE_BADGE: Record<AccountType, { label: string; className: string }> = {
  main:   { label: "رئيسي",  className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  sub:    { label: "فرعي",   className: "bg-blue-500/20   text-blue-400   border-blue-500/30"   },
  detail: { label: "تفصيلي", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
};

interface AccountRowProps {
  account: Account;
  level?: number;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

function AccountRow({ account, level = 0, onEdit, onDelete }: AccountRowProps) {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = !!account.children?.length;
  const badge = TYPE_BADGE[account.type];

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-white/5 hover:bg-white/5 transition-colors"
      >
        <td className="py-3 px-4" style={{ paddingRight: `${level * 40 + 16}px` }}>
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {expanded
                  ? <ChevronDown className="w-4 h-4 text-gray-400" />
                  : <ChevronLeft className="w-4 h-4 text-gray-400" />}
              </button>
            )}
            <span className="text-gray-400 font-mono text-sm">{account.code}</span>
          </div>
        </td>
        <td className="py-3 px-4">
          <span className="text-white font-medium">{account.name}</span>
        </td>
        <td className="py-3 px-4">
          <span className={`px-3 py-1 rounded-lg border text-sm ${badge.className}`}>
            {badge.label}
          </span>
        </td>
        <td className="py-3 px-4 text-white text-left font-medium">
          {account.balance.toLocaleString()} ر.س
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => onEdit(account)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Edit className="w-4 h-4 text-blue-400" />
            </button>
            <button onClick={() => onDelete(account)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </td>
      </motion.tr>

      <AnimatePresence>
        {expanded && hasChildren && account.children!.map((child) => (
          <AccountRow key={child.code} account={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </>
  );
}

export default function AccountsTree({ accounts = [], onEdit, onDelete }: AccountsTreeProps) {
  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-4 px-4 text-gray-400 font-medium">رمز الحساب</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">اسم الحساب</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">النوع</th>
              <th className="text-left  py-4 px-4 text-gray-400 font-medium">الرصيد</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(accounts) ? accounts : []).map((account) => (
              <AccountRow key={account.code} account={account} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
