import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {IncomeExpenseResponseType} from "../../types/income-expense-response.type";

export class OperationCreate {
    readonly route: Router;
    readonly typeElement: HTMLInputElement | null = null;
    readonly categoryElement: HTMLSelectElement | null = null;
    readonly sumElement: HTMLInputElement | null = null;
    readonly dateElement: HTMLInputElement | null = null;
    readonly commentElement: HTMLInputElement | null = null;
    readonly createElement: HTMLElement | null = null;
    constructor(route: Router) {
        this.route = route;
        this.typeElement = document.getElementById('operation-type') as HTMLInputElement | null;
        this.categoryElement = document.getElementById('operation-category') as HTMLSelectElement | null;
        this.sumElement = document.getElementById('operation-sum') as HTMLInputElement | null;
        this.dateElement = document.getElementById('operation-date') as HTMLInputElement | null;
        this.commentElement = document.getElementById('operation-comment') as HTMLInputElement | null;
        this.createElement = document.getElementById('create-operation');
        this.init().then();
    }

    private async init(): Promise<void> {
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam: string | null = urlParams.get('type');

        if (typeParam) {
            if (this.typeElement) {
                this.typeElement.value = typeParam;
                await this.getAndShowCategories(typeParam as "income" | "expense");
                this.typeElement.addEventListener('change', (e) => {
                    const val = this.typeElement?.value;

                    if (val === "income" || val === "expense") {
                        this.getAndShowCategories(val);
                    }
                });
            }
        }
        if (this.createElement) {
            this.createElement.addEventListener('click', this.saveOperation.bind(this));
        }
    }

    private async getAndShowCategories(type: 'income' | 'expense'): Promise<void> {
        if (this.categoryElement) {
            this.categoryElement.innerHTML = '<option value="" selected>Категория...</option>';
        }

        if (!type) return;

        try {
            const categories: ResultResponseType<IncomeExpenseResponseType[]> = await HttpUtils.request(`/categories/${type}`, 'GET', true);

            if (categories.redirect) {
                this.route.open(categories.redirect);
                return;
            }

            if (categories.error || !categories.response) {
                return alert('Возникла ошибка при запросе категорий. Обратитесь в службу поддержки.');
            }

            categories.response.forEach((category: IncomeExpenseResponseType): void => {
                const option = document.createElement('option');
                option.value = category.id.toString();
                option.text = category.title;
                if (this.categoryElement) {
                    this.categoryElement.appendChild(option);
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    validateForm(): boolean {
        let isValid: boolean = true;
        let textInputArray = [this.typeElement, this.categoryElement, this.sumElement, this.dateElement, this.commentElement];

        for (let i: number = 0; i < textInputArray.length; i++) {
            const textInput = textInputArray[i];
            if ((textInput != null) || (textInput != undefined)) {
                if (textInput.value) {
                    textInput.classList.remove('is-invalid');
                } else {
                    textInput.classList.add('is-invalid');
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    private async saveOperation(e: Event): Promise<void> {
        e.preventDefault();
        if (this.validateForm()) {
            if (this.typeElement && this.sumElement && this.dateElement && this.commentElement && this.categoryElement) {
                const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/operations', 'POST', true,
                    {
                        type: this.typeElement.value,
                        amount: parseInt(this.sumElement.value),
                        date: this.dateElement.value,
                        comment: this.commentElement.value,
                        category_id: parseInt(this.categoryElement.value),
                    });
                if (result.redirect) {
                    return this.route.open(result.redirect);
                }
                if (result.error || !result.response) {
                    return alert('Возникла ошибка при добавлении операции. Обратитесь в службу поддержки.');
                }
                return this.route.open('/operations/view');
            }
        }
    }
}