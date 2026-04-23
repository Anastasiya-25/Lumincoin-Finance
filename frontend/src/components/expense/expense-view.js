import {HttpUtils} from "../../utils/http-utils.js";
import * as bootstrap from "bootstrap";

export class ExpenseView {
    constructor(route) {
        this.route = route;
        this.deleteId = null;
        this.getExpenses().then();
        const confirmBtn = document.getElementById('confirm-delete');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.expenseDelete());
        }
    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/expense');

        if (result.redirect) {
            return this.route.open(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе категории расходов. Обратитесь в службу поддержки.');
        }

        this.showExpenses(result.response);
    }

    showExpenses(expenses) {
        const container = document.getElementById('cards-container');
        container.innerHTML = '';

        expenses.forEach(expense => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card border-secondary-subtle';
            cardElement.style.width = '22rem';

            cardElement.innerHTML = `
            <div class="card-body p-4">
                <h3 class="h4 mb-4 title-post">${expense.title}</h3>
                <div class="d-flex gap-2">
                    <a href="/expense/edit?id=${expense.id}" class="btn btn-primary w-50">Редактировать</a>
                    <button type="button" 
                       class="btn btn-danger w-50 text-white delete-btn" 
                       data-id="${expense.id}">Удалить</button>
                </div>
            </div> `;

            cardElement.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteId = expense.id;
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
            <a href="/expense/create" class="text-decoration-none link-secondary shadow-none">
                <i class="fa-solid fa-plus" style="font-size: 2rem; color: #ced4da;"></i>
            </a>
        </div>
    `;
        container.appendChild(createCardElement);
    }

    async expenseDelete() {
        if (this.deleteId) {
            const result = await HttpUtils.request('/categories/expense/' + this.deleteId, 'DELETE', true);

            if (result.error) {
                alert('Возникла ошибка при удалении операции.');
                return;
            }

            const modalElement = document.getElementById('deleteModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            this.deleteId = null;

            await this.getExpenses();
        }
    }

}