import { Datepicker } from 'vanillajs-datepicker';
import ru from "vanillajs-datepicker/locales/ru";

export class PeriodUtils {
    readonly callback: ((period: string, fromValue?: string | null, toValue?: string | null) => void) | null;
    readonly periodButtons: NodeListOf<HTMLButtonElement>;
    private dpFrom: any;
    private dpTo: any;

    constructor(callback: ((period: string, fromValue?: string | null, toValue?: string | null) => void) | null) {
        this.callback = callback;
        if (!Datepicker.locales.ru) {
            Object.assign(Datepicker.locales, ru);
        }

        this.periodButtons = document.querySelectorAll('.period-filter');
        this.initPeriodFilters();
        this.initDatePicker();
    }

    private initDatePicker(): void {
        const fromInput: HTMLElement | null = document.getElementById('dateFrom');
        const toInput: HTMLElement | null = document.getElementById('dateTo');
        const fromLink: HTMLElement | null = document.getElementById('dateFromLink');
        const toLink: HTMLElement | null = document.getElementById('dateToLink');
        const intervalBtn: HTMLButtonElement | null = document.querySelector('.period-filter[data-period="interval"]');

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
            const customEvent = e as CustomEvent;
            if (customEvent.detail && customEvent.detail.date) {
                const dateString: string = customEvent.detail.date.toLocaleDateString('ru-RU');

               if (this.periodButtons) {
                   if (intervalBtn) {
                       this.periodButtons.forEach((btn: HTMLButtonElement): void => btn.classList.remove('active'));
                       intervalBtn.classList.add('active');
                   }
               }
                if (fromLink) {
                    fromLink.innerText = dateString;
                    this.dpFrom.update();
                }
            }
            this.checkIntervalAndRefresh();
        });

        toInput.addEventListener('changeDate', (e) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail && customEvent.detail.date) {
                const dateString: string = customEvent.detail.date.toLocaleDateString('ru-RU');

                if (this.periodButtons) {
                    if (intervalBtn) {
                        this.periodButtons.forEach((btn: HTMLButtonElement): void  => btn.classList.remove('active'));
                        intervalBtn.classList.add('active');
                    }
                }
                if (toLink) {
                    toLink.innerText = dateString;
                    this.dpTo.update();
                }
            }
            this.checkIntervalAndRefresh();
        });
    }

    private initPeriodFilters(): void {
        if (this.periodButtons) {
            this.periodButtons.forEach((button: HTMLButtonElement): void => {
                button.addEventListener('click', () => {
                    if (this.periodButtons) {
                        this.periodButtons.forEach((btn: HTMLButtonElement): void => btn.classList.remove('active'));
                        button.classList.add('active');
                    }
                    const period: string | null = button.getAttribute('data-period');

                    if (period !== 'interval') {
                        if (period) {
                            this.callback?.(period);
                        }
                    } else {
                        this.checkIntervalAndRefresh();
                    }
                });
            });
        }
    }

    private checkIntervalAndRefresh(): void {
        const fromInput = document.getElementById('dateFrom') as HTMLInputElement;
        const toInput = document.getElementById('dateTo') as HTMLInputElement;
        const intervalBtn: HTMLButtonElement | null = document.querySelector('.period-filter[data-period="interval"]');

        if (intervalBtn && intervalBtn.classList.contains('active')) {
            if (fromInput && toInput) {
                const fromValue: string = fromInput.value;
                const toValue: string = toInput.value;
                if (fromValue && toValue) {

                    this.callback?.('interval', fromValue, toValue);
                }
            }
        }

    }
}