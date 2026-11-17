export type CategoryGroupType = "expense" | "income";

export type CategoryFilterTabId = "all" | CategoryGroupType;

export interface CategoryEnvelopeItem {
  id: string;
  group: CategoryGroupType;
  name: string;
  icon: string | null;
  color: string | null;
  isSystem: boolean;
  isCustom: boolean;
  monthlyVolume: number;
  txnCount: number;
}
