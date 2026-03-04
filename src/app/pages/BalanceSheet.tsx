// ============================================================
// BalanceSheet.tsx — page entry point
// ============================================================
import { BalanceSheetProvider }    from "../components/balance_sheet/BalanceSheetProvider";
import BalanceSheetHeader          from "../components/balance_sheet/BalanceSheetHeader";
import BalanceSheetDatePicker      from "../components/balance_sheet/BalanceSheetDatePicker";
import BalanceSheetStatus          from "../components/balance_sheet/BalanceSheetStatus";
import BalanceSheetAssets          from "../components/balance_sheet/BalanceSheetAssets";
import BalanceSheetLiabilities     from "../components/balance_sheet/BalanceSheetLiabilities";

export default function BalanceSheet() {
  return (
    <BalanceSheetProvider>
      <div className="space-y-8">
        <BalanceSheetHeader />
        <BalanceSheetDatePicker />
        <BalanceSheetStatus />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BalanceSheetAssets />
          <BalanceSheetLiabilities />
        </div>
      </div>
    </BalanceSheetProvider>
  );
}
