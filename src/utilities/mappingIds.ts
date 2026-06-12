// mappingIds.ts

const idTitleMap: Record<number, string> = {
  1: "تجاري",
  2: "سكني",
  3: "شركات",
  4: "مشاريع",
  5: "بضائع",
  6: "مصانع",
  7: "أسهم",
  8: "علامات تجارية",
  9: "خدمي",
  10: "سكني",
  11: "مكاتب",
  12: "أسواق",
  13: "مباني خدمية",
  14: "فيلات خدمية",
  15: "أراضي خدمية",
  16: "محلات",
  17: "شقق",
  18: "فلل",
  19: "أراضي سكنية",
  20: "عمارات",
  21: "شاليهات",
  22: "مزارع",
  23: "عِزَب",
};

/**
 * Converts an id to its corresponding title.
 * @param id number
 * @returns string | undefined
 */
export function mapIdToTitle(id: number): string {
  return idTitleMap[id];
}
