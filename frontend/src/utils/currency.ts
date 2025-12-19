/**
 * Currency formatting utilities for Brazilian Real (BRL)
 */

// Format a number to BRL currency display string
export function formatCurrency(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return ''

    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return ''

    return numValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

// Format input value as currency while typing (for controlled inputs)
export function formatCurrencyInput(value: string): string {
    // Remove everything except numbers
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''

    // Convert to number (in cents) and divide by 100
    const amount = parseInt(numbers, 10) / 100

    // Format to BRL
    return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

// Parse formatted currency string back to number
export function parseCurrency(formatted: string): number {
    if (!formatted) return 0
    const numbers = formatted.replace(/\D/g, '')
    if (!numbers) return 0
    return parseInt(numbers, 10) / 100
}

// Format number with thousand separators (without R$ symbol)
export function formatNumber(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '0,00'

    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0,00'

    return numValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}
