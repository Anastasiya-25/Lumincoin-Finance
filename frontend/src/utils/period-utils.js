import { Datepicker } from 'vanillajs-datepicker';
import { DateRangePicker } from 'vanillajs-datepicker';
import ru from "vanillajs-datepicker/locales/ru";

export class PeriodUtils {
    constructor(callback) {
        this.callback = callback;
        if (!Datepicker.locales.ru) {
            Object.assign(Datepicker.locales, ru);
        }

        this.periodButtons = document.querySelectorAll('.period-filter');
        this.initPeriodFilters();
        this.initDatePicker();
    }

    initDatePicker() {
        const fromInput = document.getElementById('dateFrom');
        const toInput = document.getElementById('dateTo');
        const fromLink = document.getElementById('dateFromLink');
        const toLink = document.getElementById('dateToLink');

        if (!fromInput || !toInput) return;

        const options = {
            format: 'yyyy-mm-dd',
            autohide: true,
            language: 'ru'
        };

        const dpFrom = new Datepicker(fromInput, options);
        const dpTo = new Datepicker(toInput, options);

        if (fromLink) {
            fromLink.addEventListener('click', () => fromInput.focus());
        }
        if (toLink) {
            toLink.addEventListener('click', () => toInput.focus());
        }

        fromInput.addEventListener('changeDate', (e) => {
            if (fromLink && e.detail.date) {
                fromLink.innerText = e.detail.date.toLocaleDateString('ru-RU');
            }
            this.checkIntervalAndRefresh();
        });

        toInput.addEventListener('changeDate', (e) => {
            if (toLink && e.detail.date) {
                toLink.innerText = e.detail.date.toLocaleDateString('ru-RU');
            }
            this.checkIntervalAndRefresh();
        });
    }

    initPeriodFilters() {
        this.periodButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.periodButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const period = button.getAttribute('data-period');

                if (period !== 'interval') {
                    this.callback(period);
                } else {
                    this.checkIntervalAndRefresh();
                }
            });
        });
    }

    checkIntervalAndRefresh() {
        const fromInput = document.getElementById('dateFrom');
        const toInput = document.getElementById('dateTo');
        const intervalBtn = document.querySelector('.period-filter[data-period="interval"]');

        if (intervalBtn?.classList.contains('active') && fromInput?.value && toInput?.value) {
            this.callback('interval', fromInput.value, toInput.value);
        }
    }
}