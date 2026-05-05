import {HttpUtils} from "../../utils/http-utils.js";

export class ExpenseEdit {
    constructor(route) {
        this.route = route;
        const urlParams = new URLSearchParams(window.location.search);

        this.id = urlParams.get('id');
        if (!this.id) {
            return this.route.open('/expense/view');
        }
        this.expenseNameElement = document.getElementById('expense-name');
        this.editBtnElement = document.getElementById('edit-expense');
        this.editBtnElement.addEventListener('click', this.saveExpense.bind(this));
        this.getExpense(this.id).then();
    }

    async getExpense(id) {
        const result = await HttpUtils.request('/categories/expense/' + id);
        if (result.error || !result.response) {
            alert('Не удалось загрузить категорию');
            return this.route.open('/expense/view');
        }
        this.expenseNameElement.value = result.response.title;
    }

    async saveExpense(e) {
        e.preventDefault();
        const title = this.expenseNameElement.value.trim();

        if (title) {
            this.expenseNameElement.classList.remove('is-invalid');
            const result = await HttpUtils.request('/categories/expense/' + this.id, 'PUT', true,
                {
                    title: title,
                });
            if (result.redirect) {
                return this.route.open(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка при редактировании категории. Обратитесь в службу поддержки.');
            }
            return this.route.open('/expense/view');

        } else {
            this.expenseNameElement.classList.add('is-invalid');
        }
    }
}