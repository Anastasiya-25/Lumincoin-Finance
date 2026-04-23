import {HttpUtils} from "../../utils/http-utils.js";

export class IncomeEdit {
    constructor(route) {
        this.route = route;
        const urlParams = new URLSearchParams(window.location.search);

        this.id = urlParams.get('id');
        if (!this.id) {
            return this.route.open('/income/view');
        }
        this.incomeNameElement = document.getElementById('income-name');
        this.editBtnElement = document.getElementById('edit-income');
        this.editBtnElement.addEventListener('click', this.saveIncome.bind(this));
        this.getIncome(this.id).then();
    }

    async getIncome(id) {
        const result = await HttpUtils.request('/categories/income/' + id);
        if (result.error || !result.response) {
            alert('Не удалось загрузить категорию');
            return this.route.open('/income/view');
        }
        this.incomeNameElement.value = result.response.title;
    }

    async saveIncome(e) {
        e.preventDefault();
        const title = this.incomeNameElement.value.trim();

        if (title) {
            this.incomeNameElement.classList.remove('is-invalid');
            const result = await HttpUtils.request('/categories/income/' + this.id, 'PUT', true,
                {
                    title: title,
                });
            if (result.redirect) {
                return this.route.open(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка при редактировании категории. Обратитесь в службу поддержки.');
            }
            return this.route.open('/income/view');

        } else {
            this.incomeNameElement.classList.add('is-invalid');
        }
    }
}