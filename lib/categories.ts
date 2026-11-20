export const CATEGORY_LABELS: Record<string, string> = {
  coffee: 'Kopi',
  cold: 'Minuman dingin',
  equipment: 'Peralatan',
  merchandise: 'Merchandise & Hadiah',
}

export function formatCategoryLabel(cat: string) {
  return CATEGORY_LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)
}