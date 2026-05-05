import {HttpUtils} from "../../utils/http-utils.js";

export class IncomeCreate {
    constructor(route) {
        this.route = route;
        this.incomeNameElement = document.getElementById('income-name');
        this.createBtnElement = document.getElementById('create-income');
        this.createBtnElement.addEventListener('click', this.saveIncome.bind(this));
    }

    async saveIncome(e) {
        e.preventDefault();
        const title = this.incomeNameElement.value.trim();

        if (title) {
            this.incomeNameElement.classList.remove('is-invalid');
            const result = await HttpUtils.request('/categories/income', 'POST', true,
                {
                    title: title,
                });
            if (result.redirect) {
                return this.route.open(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка при добавлении категории. Обратитесь в службу поддержки.');
            }
            return this.route.open('/income/view');

        } else {
            this.incomeNameElement.classList.add('is-invalid');
        }
    }
}