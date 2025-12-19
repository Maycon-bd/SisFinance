export interface User {
    id: number;
    email: string;
    full_name?: string;
    monthly_salary?: number;
    created_at: string;
}

export interface Bank {
    id: number;
    user_id: number;
    name: string;
    initial_balance: number;
    current_balance: number;
    icon_color?: string;
    created_at: string;
}

export interface Vault {
    id: number;
    user_id: number;
    bank_id?: number;
    name: string;
    currency: string;
    balance: number;
    created_at: string;
}

export interface CreditCard {
    id: number;
    user_id: number;
    name: string;
    limit: number;
    closing_day: number;
    due_day: number;
    color?: string;
    created_at: string;
}

export interface Category {
    id: number;
    user_id?: number;
    name: string;
    type: 'income' | 'expense';
    is_system: boolean;
    icon?: string;
    created_at: string;
}

export interface Transaction {
    id: number;
    user_id: number;
    category_id?: number;
    bank_id?: number;
    vault_id?: number;
    credit_card_id?: number;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    description?: string;
    installment_number?: number;
    total_installments?: number;
}

export interface RecurringTransaction {
    id: number;
    user_id: number;
    category_id?: number;
    bank_id?: number;
    credit_card_id?: number;
    amount: number;
    type: 'income' | 'expense';
    day_of_month: number;
    description?: string;
    is_active: boolean;
}
