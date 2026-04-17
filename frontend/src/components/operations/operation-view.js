import * as bootstrap from 'bootstrap';
import {HttpUtils} from "../../utils/http-utils.js";
import {AuthUtils} from "../../utils/auth-utils.js";
import { Datepicker, DateRangePicker } from 'vanillajs-datepicker';
import ru from 'vanillajs-datepicker/locales/ru';

export class OperationsView {
    constructor(route) {
        this.route = route;
        this.deleteId = null;
        Object.assign(Datepicker.locales, ru);
        this.initDatePicker(this);

        this.periodButtons = document.querySelectorAll('.period-filter');
        this.initPeriodFilters();

        this.getOperations('all').then();
        const confirmBtn = document.getElementById('confirm-delete');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.operationDelete());
        }
    }

    initDatePicker() {
        const rangeElement = document.getElementById('datepicker-range');
        const fromLink = document.getElementById('dateFromLink');
        const toLink = document.getElementById('dateToLink');

        // Инициализация
        new DateRangePicker(rangeElement, {
            format: 'yyyy-mm-dd',
            autohide: true,
            language: 'ru'
        });

        fromLink.addEventListener('click', () => document.getElementById('dateFrom').focus());
        toLink.addEventListener('click', () => document.getElementById('dateTo').focus());

        rangeElement.addEventListener('changeDate', (e) => {
            const input = e.target; //
            const fromInput = document.getElementById('dateFrom');
            const toInput = document.getElementById('dateTo');
            const fromLink = document.getElementById('dateFromLink');
            const toLink = document.getElementById('dateToLink');

            const link = (input.id === 'dateFrom') ? fromLink : toLink;
            if (input.value) {
                const date = new Date(input.value);
                link.innerText = date.toLocaleDateString('ru-RU');
            }
            this.checkIntervalAndRefresh();
        });
    }

    checkIntervalAndRefresh() {

        const fromInput = document.getElementById('dateFrom');
        const toInput = document.getElementById('dateTo');

        const intervalBtn = document.querySelector('.period-filter[data-period="interval"]');

        const from = fromInput.value;
        const to = toInput.value;
        if (intervalBtn && intervalBtn.classList.contains('active') && from && to) {
            this.getOperations('interval', from, to).then();
        }
    }

    initPeriodFilters() {
        this.periodButtons.forEach(button => {
            button.addEventListener('click', (e) => {

                this.periodButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const period = button.getAttribute('data-period');

                if (period === 'interval') {
                    this.checkIntervalAndRefresh();
                } else {
                    this.getOperations(period).then();
                }
            });
        });
    }

    async getOperations(period, dateFrom = null, dateTo = null) {
        let url = `/operations?period=${period}`;

        if (period === 'interval' && dateFrom && dateTo) {
            url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }

        const result = await HttpUtils.request(url);

        if (result.redirect) {
            return this.route = result.redirect;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе операций. Обратитесь в службу поддержки.');
        }

        this.showOperations(result.response);

    }

    showOperations(operations) {
        const tableElement = document.getElementById('table-body');
        if (tableElement) tableElement.innerHTML = '';
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = operations[i].id;

            const typeCell = trElement.insertCell();
            let typeText = '';
            let className = '';
            switch (operations[i].type) {
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
            trElement.insertCell().innerText = operations[i].category;
            trElement.insertCell().innerText = operations[i].amount;
            trElement.insertCell().innerText = (new Date(operations[i].date)).toLocaleDateString('ru-RU');
            trElement.insertCell().innerText = operations[i].comment;

            // trElement.insertCell().innerHTML = '<div class="order-tools">' +
            //     '<a href="/operation/edit?id=' + operations[i].id + '" class="fa-solid fa-pen"></a>' +
            //     '<a href="/operation/delete?id=' + operations[i].id + '" class="fa-solid fa-trash-can"></a>' + '</div>';
            const toolsCell = trElement.insertCell();
            const toolsDiv = document.createElement('div');
            toolsDiv.className = 'order-tools';
            toolsDiv.innerHTML = `<a href="/operation/edit?id=${operations[i].id}" class="fa-solid fa-pen"></a>`;
            const deleteBtn = document.createElement('a');
            deleteBtn.href = 'javascript:void(0)';
            deleteBtn.className = 'fa-solid fa-trash-can';
            deleteBtn.addEventListener('click', () => {
                this.deleteId = operations[i].id;
                const myModal = new bootstrap.Modal(document.getElementById('deleteModal'));
                myModal.show();
            });
            toolsDiv.appendChild(deleteBtn);
            toolsCell.appendChild(toolsDiv);
            tableElement.appendChild(trElement);
        }

    }
    async operationDelete() {
        if (this.deleteId) {
            const result = await HttpUtils.request('/operations/' + this.deleteId, 'DELETE', true);

            if (result.error) {
                alert('Возникла ошибка при удалении операции.');
                return;
            }

            const modalElement = document.getElementById('deleteModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            const activePeriod = document.querySelector('.period-filter.active').getAttribute('data-period');
            this.getOperations(activePeriod).then();
        }
    }
}