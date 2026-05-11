import * as bootstrap from 'bootstrap';
import {HttpUtils} from "../../utils/http-utils";
import {PeriodUtils} from "../../utils/period-utils";
import {SidebarUtils} from "../../utils/sidebar-utils";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {OperationPeriodResponseType} from "../../types/operation-period-response.type";
import type {IncomeExpenseResponseType} from "../../types/income-expense-response.type";

export class OperationsView {
    readonly route: Router;
    private deleteId: number | null;

    constructor(route: Router) {
        this.route = route;

        new PeriodUtils(this.getOperations.bind(this));
        this.deleteId = null;

        this.getOperations('all').then();
        const confirmBtn: HTMLElement | null = document.getElementById('confirm-delete');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', (): Promise<void> => this.operationDelete());
        }
    }

    private async getOperations(period: string, dateFrom?: string | null, dateTo?: string | null): Promise<void> {
        let url: string = `/operations?period=${period}`;

        if (period === 'interval' && dateFrom && dateTo) {
            url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }

        const result: ResultResponseType<OperationPeriodResponseType[]> = await HttpUtils.request(url);

        if (result.redirect) {
            return this.route.open(result.redirect);
        }

        if (result.error || !result.response) {
            return alert('Возникла ошибка при запросе операций. Обратитесь в службу поддержки.');
        }
        this.showOperations(result.response);
    }

    private showOperations(operations: OperationPeriodResponseType[]): void {
        const tableElement: HTMLElement | null = document.getElementById('table-body');
        if (tableElement) tableElement.innerHTML = '';
        for (let i: number = 0; i < operations.length; i++) {
            const trElement: HTMLTableRowElement | string = document.createElement('tr');
            if (operations[i]) {
                const newCell = trElement.insertCell();
                if (newCell) {
                    newCell.innerText = operations[i]?.id.toString() ?? '';
                }
            }

            const typeCell = trElement.insertCell();
            const op: OperationPeriodResponseType | undefined = operations[i];
            let typeText: string = '';
            let className: string = '';
            if (op) {
                switch (op.type) {
                    case 'expense':
                        typeText = 'расход';
                        className = 'text-danger';
                        break;
                    case 'income':
                        typeText = 'доход';
                        className = 'text-success';
                        break;
                }
                typeCell.innerText = typeText;
                typeCell.classList.add(className);
                trElement.insertCell().innerText = op.category;
                trElement.insertCell().innerText = op.amount.toString();
                trElement.insertCell().innerText = (new Date(op.date)).toLocaleDateString('ru-RU');
                trElement.insertCell().innerText = op.comment;

                const toolsCell = trElement.insertCell();
                const toolsDiv: HTMLElement | null = document.createElement('div');
                toolsDiv.className = 'order-tools';

                const deleteBtn: HTMLAnchorElement = document.createElement('a');
                deleteBtn.href = 'javascript:void(0)';
                deleteBtn.className = 'fa-solid fa-trash-can text-dark';
                deleteBtn.addEventListener('click', (): void => {
                    this.deleteId = op.id;
                    const myModal = new bootstrap.Modal(document.getElementById('deleteModal'));
                    myModal.show();
                });

                toolsDiv.appendChild(deleteBtn);
                toolsDiv.insertAdjacentHTML('beforeend', `<a href="/operation/edit?id=${op.id}" class="fa-solid fa-pen text-dark"></a>`);

                // toolsDiv.appendChild(deleteBtn);
                toolsCell.appendChild(toolsDiv);

                if (tableElement) {
                    tableElement.appendChild(trElement);
                }
            }
        }
    }

    private async operationDelete(): Promise<void> {
        if (this.deleteId) {
            const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/operations/' + this.deleteId, 'DELETE', true);

            if (result.error) {
                alert('Возникла ошибка при удалении операции.');
                return;
            }

            const modalElement: HTMLElement | null = document.getElementById('deleteModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            const activeBtn = document.querySelector('.period-filter.active');
            if (activeBtn) {
                const activePeriod = activeBtn.getAttribute('data-period');

               if (activePeriod) {
                   if (activePeriod === 'interval') {
                       const from = (document.getElementById('dateFrom') as HTMLInputElement).value;
                       const to = (document.getElementById('dateTo') as HTMLInputElement).value;
                       this.getOperations(activePeriod, from, to).then();
                   } else {
                       this.getOperations(activePeriod).then();
                   }
                   await SidebarUtils.showBalance();
               }

            }
        }
    }
}