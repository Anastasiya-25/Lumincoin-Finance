import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {IncomeExpenseResponseType} from "../../types/income-expense-response.type";

export class IncomeCreate {
    private route: Router;
    readonly incomeNameElement: HTMLInputElement | null = null;
    readonly createBtnElement: HTMLLinkElement | null = null;
    constructor(route: Router) {
        this.route = route;
        this.incomeNameElement = document.getElementById('income-name') as HTMLInputElement;
        this.createBtnElement = document.getElementById('create-income') as HTMLLinkElement;
        this.createBtnElement.addEventListener('click', this.saveIncome.bind(this));
    }

    private async saveIncome(e: Event): Promise<void> {
        e.preventDefault();
        if (this.incomeNameElement) {
            const title: string = this.incomeNameElement.value.trim();

            if (title) {
                this.incomeNameElement.classList.remove('is-invalid');
                const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/categories/income', 'POST', true,
                    {
                        title: title,
                    });
                if (result.redirect) {
                    return this.route.open(result.redirect);
                }
                if (result.error || !result.response) {
                    return alert('Возникла ошибка при добавлении категории. Обратитесь в службу поддержки.');
                }
                return this.route.open('/income/view');

            } else {
                this.incomeNameElement.classList.add('is-invalid');
            }
        }
    }
}