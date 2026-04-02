import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class SignUp {
    constructor(router) {
        this.router = router;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.router.open('/');
        }
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.confirmElement = document.getElementById('confirm');
        this.commonErrorElement = document.getElementById('common-error');
        this.popup = document.getElementById('signup-success-popup');
        this.goToLoginBtn = document.getElementById('goto-login-btn');
        document.getElementById('sign-up-button').addEventListener('click', this.signUp.bind(this));
    }
    validateForm() {
        let isValid = true;
        if (this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.lastNameElement.value) {
            this.lastNameElement.classList.remove('is-invalid');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.emailElement.value && this.emailElement.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.confirmElement.value && this.confirmElement.value === this.passwordElement.value) {
            this.confirmElement.classList.remove('is-invalid');
        } else {
            this.confirmElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }
    async signUp(e) {
        this.commonErrorElement.style.display = 'none';
        e.preventDefault();
        if (this.validateForm()) {
            const result = await HttpUtils.request('/signup', 'POST', false,
                {
                    name: this.nameElement.value,
                    lastName: this.lastNameElement.value,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.confirmElement.value,
                });

            if (result.error || !result.response || (result.response && !result.response.user)) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            this.popup.classList.remove('d-none');
            this.goToLoginBtn.onclick = () => {
                this.router.open('/login');
                console.log(result);

            };
        }
    }
}