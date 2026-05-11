import {HttpUtils} from "../../utils/http-utils";
import * as bootstrap from "bootstrap";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {IncomeExpenseResponseType} from "../../types/income-expense-response.type";

export class ExpenseView {
    readonly route: Router;
    private deleteId: number | null;
    constructor(route: Router) {
        this.route = route;
        this.deleteId = null;
        this.getExpenses().then();
        const confirmBtn: HTMLElement | null = document.getElementById('confirm-delete');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', (): Promise<void> => this.expenseDelete());
        }
    }

    private async getExpenses(): Promise<void> {
        const result: ResultResponseType<IncomeExpenseResponseType[]> = await HttpUtils.request('/categories/expense');

        if (result.redirect) {
            return this.route.open(result.redirect);
        }

        if (result.error || !result.response) {
            return alert('Возникла ошибка при запросе категории расходов. Обратитесь в службу поддержки.');
        }

        this.showExpenses(result.response);
    }

    private showExpenses(expenses: IncomeExpenseResponseType[]): void {
        const container: HTMLElement | null = document.getElementById('cards-container');
        if (container) {
            container.innerHTML = '';

            expenses.forEach((expense: IncomeExpenseResponseType): void => {
                const cardElement: HTMLElement | null = document.createElement('div');
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

                if (cardElement) {
                    cardElement.querySelector('.delete-btn')?.addEventListener('click', () => {
                        this.deleteId = expense.id;
                        const myModal = new bootstrap.Modal(document.getElementById('deleteModal'));
                        myModal.show();
                    });
                }
                container.appendChild(cardElement);
            });
            const createCardElement: HTMLElement | null = document.createElement('div');
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
    }

    private async expenseDelete(): Promise<void> {
        if (this.deleteId) {
            const result: ResultResponseType<IncomeExpenseResponseType[]> = await HttpUtils.request('/categories/expense/' + this.deleteId, 'DELETE', true);

            if (result.error) {
                alert('Возникла ошибка при удалении операции.');
                return;
            }

            const modalElement: HTMLElement | null = document.getElementById('deleteModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            this.deleteId = null;
            await this.getExpenses();
        }
    }
}