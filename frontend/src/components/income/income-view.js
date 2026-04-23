import {HttpUtils} from "../../utils/http-utils.js";
import * as bootstrap from "bootstrap";

export class IncomeView {
    constructor(route) {
        this.route = route;
        this.deleteId = null;
        this.getIncomes().then();
        const confirmBtn = document.getElementById('confirm-delete');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.incomeDelete());
        }
    }

    async getIncomes() {
        const result = await HttpUtils.request('/categories/income');

        if (result.redirect) {
            return this.route.open(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе категории доходов. Обратитесь в службу поддержки.');
        }

        this.showIncomes(result.response);
    }

    showIncomes(incomes) {
        const container = document.getElementById('cards-container');
        container.innerHTML = '';

        incomes.forEach(income => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card border-secondary-subtle';
            cardElement.style.width = '22rem';

            cardElement.innerHTML = `
            <div class="card-body p-4">
                <h3 class="h4 mb-4 title-post">${income.title}</h3>
                <div class="d-flex gap-2">
                    <a href="/income/edit?id=${income.id}" class="btn btn-primary w-50">Редактировать</a>
                    <button type="button" 
                       class="btn btn-danger w-50 text-white delete-btn" 
                       data-id="${income.id}">Удалить</button>
                </div>
            </div> `;

            cardElement.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteId = income.id;
                const myModal = new bootstrap.Modal(document.getElementById('deleteModal'));
                myModal.show();
            });
            container.appendChild(cardElement);
        });
        const createCardElement = document.createElement('div');
        createCardElement.className = 'card border-secondary-subtle d-flex align-items-center justify-content-center';
        createCardElement.style.width = '22rem';
        createCardElement.style.minHeight = '140px';

        createCardElement.innerHTML = `
        <div class="card-body d-flex align-items-center justify-content-center">
            <a href="/income/create" class="text-decoration-none link-secondary shadow-none">
                <i class="fa-solid fa-plus" style="font-size: 2rem; color: #ced4da;"></i>
            </a>
        </div>
    `;
        container.appendChild(createCardElement);
    }

    async incomeDelete() {
        if (this.deleteId) {
            const result = await HttpUtils.request('/categories/income/' + this.deleteId, 'DELETE', true);

            if (result.error) {
                alert('Возникла ошибка при удалении операции.');
                return;
            }

            const modalElement = document.getElementById('deleteModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            this.deleteId = null;

            await this.getIncomes();
        }
    }
}