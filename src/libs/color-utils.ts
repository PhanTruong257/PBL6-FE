/**
 * Available class colors
 */
export type ClassColor =
  | 'blue'
  | 'pink'
  | 'purple'
  | 'gray'
  | 'green'
  | 'orange'
  | 'teal'
  | 'indigo'

export const CLASS_COLORS: ClassColor[] = [
  'blue',
  'pink',
  'purple',
  'gray',
  'green',
  'orange',
  'teal',
  'indigo',
]

/**
 * Generate a consistent color based on a number (e.g., class_id)
 * Same ID will always get the same color
 */
export function getColorFromId(id: number | string): ClassColor {
  const numId = typeof id === 'string' ? parseInt(id) : id
  const index = numId % CLASS_COLORS.length
  return CLASS_COLORS[index]
}

/**
 * Get random color (for fallback scenarios)
 */
export function getRandomColor(): ClassColor {
  return CLASS_COLORS[Math.floor(Math.random() * CLASS_COLORS.length)]
}
