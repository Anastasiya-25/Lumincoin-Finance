import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {IncomeExpenseResponseType} from "../../types/income-expense-response.type";

export class IncomeEdit {
    private route: Router;
    readonly id: string | null = null;
    readonly incomeNameElement: HTMLInputElement | null = null;
    readonly editBtnElement: HTMLLinkElement | null = null;
    constructor(route: Router) {
        this.route = route;
        const urlParams = new URLSearchParams(window.location.search);

        this.id = urlParams.get('id');
        if (!this.id) {
            this.route.open('/income/view');
            return;
        }
        this.incomeNameElement = document.getElementById('income-name') as HTMLInputElement;
        this.editBtnElement = document.getElementById('edit-income') as HTMLLinkElement;
        this.editBtnElement.addEventListener('click', this.saveIncome.bind(this));
        this.getIncome(this.id).then();
    }

    private async getIncome(id: string): Promise<void> {
        const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/categories/income/' + id);
        if (result.error || !result.response) {
            alert('Не удалось загрузить категорию');
            return this.route.open('/income/view');
        }
        if (this.incomeNameElement) {
            this.incomeNameElement.value = result.response.title;
        }
    }

    private async saveIncome(e: Event): Promise<void> {
        e.preventDefault();
        if (this.incomeNameElement) {
            const title: string = this.incomeNameElement.value.trim();
            if (title) {
                this.incomeNameElement.classList.remove('is-invalid');
                const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/categories/income/' + this.id, 'PUT', true,
                    {
                        title: title,
                    });
                if (result.redirect) {
                    return this.route.open(result.redirect);
                }
                if (result.error || !result.response) {
                    return alert('Возникла ошибка при редактировании категории. Обратитесь в службу поддержки.');
                }
                return this.route.open('/income/view');

            } else {
                this.incomeNameElement.classList.add('is-invalid');
            }
        }
    }
}