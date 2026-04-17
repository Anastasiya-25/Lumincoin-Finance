import {HttpUtils} from "../../utils/http-utils.js";

export class OperationEdit {
    constructor(route) {
        this.route = route;
        const urlParams = new URLSearchParams(window.location.search);

        const id = urlParams.get('id');
        if (!id) {
            return this.route.open('/');
        }

        this.typeElement = document.getElementById('operation-type');
        this.categoryElement = document.getElementById('operation-category');
        this.sumElement = document.getElementById('operation-sum');
        this.dateElement = document.getElementById('operation-date');
        this.commentElement = document.getElementById('operation-comment');
        document.getElementById('edit-operation').addEventListener('click', this.saveOperation.bind(this));
        this.getOperations(id).then();

    }

    async getOperations(id) {
        const result = await HttpUtils.request('/operations/' + id);

        if (result.redirect) {
            return this.route.open(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error )) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в службу поддержки.');
        }

        await this.getAndShowCategories(result.response.type);
        this.operationOriginalData = result.response;
        this.showOperation(result.response);

        this.typeElement.addEventListener('change', (e) => {
            this.getAndShowCategories(e.target.value);
        });
    }

    async getAndShowCategories(type) {
        this.categoryElement.innerHTML = '<option value="" selected>Категория...</option>';

        if (!type) return;

        try {
            const categories = await HttpUtils.request(`/categories/${type}`, 'GET', true);

            if (categories.redirect) {
                return this.route = categories.redirect;
            }

            if (categories.error || !categories.response || (categories.response && categories.response.error)) {
                return alert('Возникла ошибка при запросе категорий. Обратитесь в службу поддержки.');
            }
            categories.response.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.text = category.title;
                this.categoryElement.appendChild(option);
            });
        } catch (e) {
            console.error(e);
        }
    }

    showOperation(operation) {
        this.typeElement.value = operation.type;
        //this.categoryElement.text = operation.category;
        this.sumElement.value = operation.amount;
        if (operation.date) {
            if (operation.date.includes('.')) {
                const parts = operation.date.split('.');
                this.dateElement.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
            } else {
                this.dateElement.value = operation.date;
            }
        }
        // this.dateElement.value = (new Date(operation.date)).toLocaleDateString('ru-RU');
        this.commentElement.value = operation.comment;

        const options = this.categoryElement.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].text === operation.category) {
                this.categoryElement.selectedIndex = i;
                break;
            }
        }
    }

    validateForm() {
        let isValid = true;
        let textInputArray = [this.typeElement, this.categoryElement, this.sumElement, this.dateElement];

        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    async saveOperation(e) {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (this.validateForm()) {
            const result = await HttpUtils.request('/operations/' + id, 'PUT', true,
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
            if (result.error || !result.response || (result.response && result.response.error )) {
                return alert('Возникла ошибка при редактировании операции. Обратитесь в службу поддержки.');
            }
            return this.route.open('/operations/view');
        }
    }
}