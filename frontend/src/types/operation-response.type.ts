export type OperationResponseType = {
    id: number,
    user_id: number,
    category_expense_id: number | null,
    category_income_id: number | null,
    type: 'income' | 'expense',
    amount: number,
    date: string,
    comment: string
}
