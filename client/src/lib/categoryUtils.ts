/**
 * Utility function to map category codes to display names
 */

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    'housing': 'Housing & Relocation',
    'legal': 'Immigration & Administrative Support',
    'finance': 'Benefits & Financial Services',
    'daily': 'Integration & Daily Life',
};

/**
 * Get the display name for a category code
 * Falls back to the original value if not found
 */
export function getCategoryDisplayName(categoryCode: string): string {
    return CATEGORY_DISPLAY_NAMES[categoryCode] || categoryCode;
}
