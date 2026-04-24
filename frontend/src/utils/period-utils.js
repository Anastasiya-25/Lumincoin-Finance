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
        const intervalBtn = document.querySelector('.period-filter[data-period="interval"]');

        if (!fromInput || !toInput) return;

        const options = {
            format: 'yyyy-mm-dd',
            autohide: true,
            language: 'ru',
            container: 'body'
        };

        this.dpFrom = new Datepicker(fromInput, options);
        this.dpTo = new Datepicker(toInput, options);

        if (fromLink) {
            fromLink.addEventListener('click', () => fromInput.focus());
        }
        if (toLink) {
            toLink.addEventListener('click', () => toInput.focus());
        }

        fromInput.addEventListener('changeDate', (e) => {
            if (e.detail.date) {
                const dateString = e.detail.date.toLocaleDateString('ru-RU');

                if (intervalBtn) {
                    this.periodButtons.forEach(btn => btn.classList.remove('active'));
                    intervalBtn.classList.add('active');
                }
                fromLink.innerText = dateString;
                this.dpFrom.update();

            }
            this.checkIntervalAndRefresh();
        });

        toInput.addEventListener('changeDate', (e) => {
            if (e.detail.date) {
                const dateString = e.detail.date.toLocaleDateString('ru-RU');
                if (intervalBtn) {
                    this.periodButtons.forEach(btn => btn.classList.remove('active'));
                    intervalBtn.classList.add('active');
                }
                toLink.innerText = dateString;
                this.dpTo.update();
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

        if (intervalBtn && intervalBtn.classList.contains('active')) {
            const fromValue = fromInput.value;
            const toValue = toInput.value;

            if (fromValue && toValue) {
                console.log(`Обновляю график для интервала: ${fromValue} - ${toValue}`);
                this.callback('interval', fromValue, toValue);
            }
        }

    }
}