export type OperationPeriodResponseType = {
    id: number,
    type: 'income' | 'expense',
    amount: number,
    date: string,
    comment: string,
    category: string
}