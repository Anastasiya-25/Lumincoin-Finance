import {HttpUtils} from "../../utils/http-utils.js";

export class OperationCreate {
    constructor(route) {
        this.route = route;
        this.typeElement = document.getElementById('operation-type');
        this.categoryElement = document.getElementById('operation-category');
        this.sumElement = document.getElementById('operation-sum');
        this.dateElement = document.getElementById('operation-date');
        this.commentElement = document.getElementById('operation-comment');
        this.init().then();
        //document.getElementById('create-operation').addEventListener('click', this.saveOperation.bind(this));
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam = urlParams.get('type');

        if (typeParam) {
            this.typeElement.value = typeParam;
            await this.getAndShowCategories(typeParam);
        }

        this.typeElement.addEventListener('change', (e) => {
            this.getAndShowCategories(e.target.value);
        });

        document.getElementById('create-operation').addEventListener('click', this.saveOperation.bind(this));
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
            console.log(categories.response);
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

    validateForm() {
        let isValid = true;
        let textInputArray = [this.typeElement, this.categoryElement, this.sumElement, this.dateElement, this.commentElement];

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
        if (this.validateForm()) {
            const result = await HttpUtils.request('/operations', 'POST', true,
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
            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка при добавлении операции. Обратитесь в службу поддержки.');
            }
            return this.route.open('/operations/view');
        }
    }
}