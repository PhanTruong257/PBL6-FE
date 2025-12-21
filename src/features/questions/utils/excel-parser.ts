import * as XLSX from 'xlsx'
import type { ExcelQuestionRow } from '@/types/question'

/**
 * Normalize boolean value from Excel
 * Excel can return: true, TRUE, "true", "TRUE", 1, "1", false, FALSE, "false", "FALSE", 0, "0"
 * We normalize to: "true" | "false" | ""
 */
function normalizeBooleanValue(value: any): string {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  // Handle boolean type
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  // Handle number type (1 = true, 0 = false)
  if (typeof value === 'number') {
    return value === 1 ? 'true' : 'false'
  }

  // Handle string type
  const strValue = String(value).toLowerCase().trim()
  if (strValue === 'true' || strValue === '1') {
    return 'true'
  }
  if (strValue === 'false' || strValue === '0') {
    return 'false'
  }

  // Return original for validation to catch
  return String(value)
}

/**
 * Parse Excel row to question data
 * Structure: F-G (Option A), H-I (Option B), J-K (Option C), L-M (Option D),
 *            N-O (Option E), P-Q (Option F), R-S (Option G), T-U (Option H),
 *            V (is_public), W (options_json), X (status)
 */
function parseExcelRow(row: any): ExcelQuestionRow {
  return {
    content: row.A || '',
    type: row.B || '',
    category_name: row.C || '',
    difficulty: row.D || '',
    is_multiple_answer: normalizeBooleanValue(row.E),
    // Option A (text + checkbox)
    F: row.F || '',
    G: normalizeBooleanValue(row.G),
    // Option B (text + checkbox)
    H: row.H || '',
    I: normalizeBooleanValue(row.I),
    // Option C (text + checkbox)
    J: row.J || '',
    K: normalizeBooleanValue(row.K),
    // Option D (text + checkbox)
    L: row.L || '',
    M: normalizeBooleanValue(row.M),
    // Option E (text + checkbox)
    N: row.N || '',
    O: normalizeBooleanValue(row.O),
    // Option F (text + checkbox)
    P: row.P || '',
    Q: normalizeBooleanValue(row.Q),
    // Option G (text + checkbox)
    R: row.R || '',
    S: normalizeBooleanValue(row.S),
    // Option H (text + checkbox)
    T: row.T || '',
    U: normalizeBooleanValue(row.U),
    // Other fields
    is_public: normalizeBooleanValue(row.V),
    options_json: row.W || '',
    status: row.X || '',
  }
}

/**
 * Parse Excel file and return questions array
 * @param file - Excel file to parse
 * @returns Promise<ExcelQuestionRow[]> - Array of parsed questions
 */
export async function parseExcelFile(file: File): Promise<ExcelQuestionRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          throw new Error('Failed to read file')
        }

        // Read workbook from ArrayBuffer
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get "Main" sheet
        const mainSheet = workbook.Sheets['Main']
        if (typeof mainSheet !== 'object') {
          throw new Error('Sheet "Main" not found in Excel file')
        }

        // Parse sheet to JSON
        const rawData: any[] = XLSX.utils.sheet_to_json(mainSheet, {
          header: 'A', // Use column letters as keys
          defval: '', // Default value for empty cells
          blankrows: false, // Skip completely blank rows
        })

        // Skip first 3 rows (title, header, notes)
        const dataRows = rawData.slice(3)

        // Parse all rows and filter out empty ones
        const parsedQuestions = dataRows
          .map((row) => parseExcelRow(row))
          .filter((row) => row.content && row.content.trim() !== '')

        resolve(parsedQuestions)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Validate Excel file type
 */
export function isValidExcelFile(file: File): boolean {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]
  return validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
}
