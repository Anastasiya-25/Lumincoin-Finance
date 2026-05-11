import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {IncomeExpenseResponseType} from "../../types/income-expense-response.type";

export class ExpenseEdit {
    private route: Router;
    readonly id: string | null = null;
    readonly expenseNameElement: HTMLInputElement | null = null;
    readonly editBtnElement: HTMLLinkElement | null = null;
    constructor(route: Router) {
        this.route = route;
        const urlParams = new URLSearchParams(window.location.search);

        this.id = urlParams.get('id');
        if (!this.id) {
            this.route.open('/expense/view');
            return;
        }
        this.expenseNameElement = document.getElementById('expense-name') as HTMLInputElement;
        this.editBtnElement = document.getElementById('edit-expense') as HTMLLinkElement;
        this.editBtnElement.addEventListener('click', this.saveExpense.bind(this));
        this.getExpense(this.id).then();
    }

    private async getExpense(id: string): Promise<void> {
        const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/categories/expense/' + id);
        if (result.error || !result.response) {
            alert('Не удалось загрузить категорию');
            return this.route.open('/expense/view');
        }
        if (this.expenseNameElement) {
            this.expenseNameElement.value = result.response.title;
        }
    }

    private async saveExpense(e: Event): Promise<void> {
        e.preventDefault();
        if (this.expenseNameElement) {
            const title: string = this.expenseNameElement.value.trim();

            if (title) {
                this.expenseNameElement.classList.remove('is-invalid');
                const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/categories/expense/' + this.id, 'PUT', true,
                    {
                        title: title,
                    });
                if (result.redirect) {
                    return this.route.open(result.redirect);
                }
                if (result.error || !result.response) {
                    return alert('Возникла ошибка при редактировании категории. Обратитесь в службу поддержки.');
                }
                return this.route.open('/expense/view');

            } else {
                this.expenseNameElement.classList.add('is-invalid');
            }
        }
    }
}