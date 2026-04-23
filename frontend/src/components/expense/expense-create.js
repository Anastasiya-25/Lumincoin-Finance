import {HttpUtils} from "../../utils/http-utils.js";

export class ExpenseCreate {
    constructor(route) {
        this.route = route;
        this.expenseNameElement = document.getElementById('expense-name');
        this.createBtnElement = document.getElementById('create-expense');
        this.createBtnElement.addEventListener('click', this.saveExpense.bind(this));
    }

    async saveExpense(e) {
        e.preventDefault();
        const title = this.expenseNameElement.value.trim();

        if (title) {
            this.expenseNameElement.classList.remove('is-invalid');
            const result = await HttpUtils.request('/categories/expense', 'POST', true,
                {
                    title: title,
                });
            if (result.redirect) {
                return this.route.open(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка при добавлении категории. Обратитесь в службу поддержки.');
            }
            return this.route.open('/expense/view');

        } else {
            this.expenseNameElement.classList.add('is-invalid');
        }
    }
}