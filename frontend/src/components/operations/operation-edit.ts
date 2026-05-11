import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {OperationPeriodResponseType} from "../../types/operation-period-response.type";
import type {IncomeExpenseResponseType} from "../../types/income-expense-response.type";

export class OperationEdit {
    private route: Router;
    readonly typeElement: HTMLInputElement | null = null;
    readonly categoryElement: HTMLSelectElement | null = null;
    readonly sumElement: HTMLInputElement | null = null;
    readonly dateElement: HTMLInputElement | null = null;
    readonly commentElement: HTMLInputElement | null = null;
    readonly editElement: HTMLElement | null = null;
    constructor(route: Router) {
        this.route = route;
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);

        const id: string | null = urlParams.get('id');
        if (!id) {
            this.route.open('/');
            return;
        }

        this.typeElement = document.getElementById('operation-type') as HTMLInputElement | null;
        this.categoryElement = document.getElementById('operation-category') as HTMLSelectElement | null;
        this.sumElement = document.getElementById('operation-sum') as HTMLInputElement | null;
        this.dateElement = document.getElementById('operation-date') as HTMLInputElement | null;
        this.commentElement = document.getElementById('operation-comment') as HTMLInputElement | null;
        this.editElement = document.getElementById('edit-operation');
        if (this.editElement) {
            this.editElement.addEventListener('click', this.saveOperation.bind(this));
        }
        this.getOperations(id).then();
    }

    private async getOperations(id: string): Promise<void> {
        const result: ResultResponseType<OperationPeriodResponseType> = await HttpUtils.request('/operations/' + id);

        if (result.redirect) {
            return this.route.open(result.redirect);
        }

        if (result.error || !result.response) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в службу поддержки.');
        }

        await this.getAndShowCategories(result.response.type);
        // this.operationOriginalData = result.response;
        this.showOperation(result.response);

        if (this.typeElement) {
            this.typeElement.addEventListener('change', (e: Event): void => {
                const val = this.typeElement?.value;

                if (val === "income" || val === "expense") {
                    this.getAndShowCategories(val);
                }
            });
        }
    }

    private async getAndShowCategories(type:  'income' | 'expense'): Promise<void> {
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
            categories.response.forEach((category: IncomeExpenseResponseType) => {
                const option: HTMLOptionElement = document.createElement('option');
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

    private showOperation(operation: OperationPeriodResponseType): void {
        if (this.typeElement) {
            this.typeElement.value = operation.type;
        }
        if (this.sumElement) {
            this.sumElement.value = operation.amount.toString();
        }

        if (this.dateElement) {
            if (operation.date) {
                if (operation.date.includes('.')) {
                    const parts: string[] = operation.date.split('.');
                    this.dateElement.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
                } else {
                    this.dateElement.value = operation.date;
                }
            }
        }
        if (this.commentElement) {
            this.commentElement.value = operation.comment;
        }

        if (this.categoryElement) {
            const options = this.categoryElement.options;
            for (let i: number = 0; i < options.length; i++) {
                const option = options[i];
                if (option && option.text === operation.category) {
                    this.categoryElement.selectedIndex = i;
                    break;
                }
            }
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        let textInputArray = [this.typeElement, this.categoryElement, this.sumElement, this.dateElement];

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
        const urlParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get('id');
        if (this.validateForm()) {
            if (this.typeElement && this.sumElement && this.dateElement && this.commentElement && this.categoryElement) {
                const result: ResultResponseType<IncomeExpenseResponseType> = await HttpUtils.request('/operations/' + id, 'PUT', true,
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
                    return alert('Возникла ошибка при редактировании операции. Обратитесь в службу поддержки.');
                }
                return this.route.open('/operations/view');
            }
        }
    }
}