import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {IncomeExpenseResponseType} from "../../types/income-expense-response.type";

export class ExpenseCreate {
    private route: Router;
    readonly expenseNameElement: HTMLInputElement | null = null;
    readonly createBtnElement: HTMLLinkElement | null = null;
    constructor(route: Router) {
        this.route = route;
        this.expenseNameElement = document.getElementById('expense-name') as HTMLInputElement;
        this.createBtnElement = document.getElementById('create-expense') as HTMLLinkElement;
        this.createBtnElement.addEventListener('click', this.saveExpense.bind(this));
    }

    private async saveExpense(e: Event): Promise<void> {
        e.preventDefault();
        if (this.expenseNameElement) {
            const title: string = this.expenseNameElement.value.trim();

            if (title) {
                this.expenseNameElement.classList.remove('is-invalid');
                const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/categories/expense', 'POST', true,
                    {
                        title: title,
                    });
                if (result.redirect) {
                    return this.route.open(result.redirect);
                }
                if (result.error || !result.response) {
                    return alert('Возникла ошибка при добавлении категории. Обратитесь в службу поддержки.');
                }
                return this.route.open('/expense/view');

            } else {
                this.expenseNameElement.classList.add('is-invalid');
            }
        }
    }
}