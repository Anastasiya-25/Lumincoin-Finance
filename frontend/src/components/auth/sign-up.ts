import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";
import type {ResultResponseType} from "../../types/result-response.type";
import type {SignUpType} from "../../types/sign-up.type";

export class SignUp {
    readonly router: Router;
    readonly lastNameElement: HTMLInputElement | null;
    readonly emailElement: HTMLInputElement | null;
    readonly passwordElement: HTMLInputElement | null;
    readonly confirmElement: HTMLInputElement | null;
    readonly commonErrorElement: HTMLInputElement | null;
    readonly nameElement: HTMLInputElement | null;
    readonly goToLoginBtn: HTMLLinkElement | null;
    readonly popup: HTMLElement | null;

    constructor(router: Router) {
        this.router = router;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.router.open('/');
        }
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.lastNameElement = document.getElementById('last-name') as HTMLInputElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.confirmElement = document.getElementById('confirm') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error') as HTMLInputElement;
        this.popup = document.getElementById('signup-success-popup');
        this.goToLoginBtn = document.getElementById('goto-login-btn') as HTMLLinkElement;

        document.getElementById('sign-up-button')?.addEventListener('click', this.signUp.bind(this));
    }

    validateForm(): boolean {
        let isValid: boolean = true;
        if (this.nameElement && this.lastNameElement && this.emailElement && this.passwordElement && this.confirmElement) {
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
        }
        return isValid;
    }

    private async signUp(e: Event): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
            e.preventDefault();
            if (this.nameElement && this.lastNameElement && this.emailElement && this.passwordElement && this.confirmElement) {
                if (this.validateForm()) {
                    const result: ResultResponseType<SignUpType> = await HttpUtils.request('/signup', 'POST', false,
                        {
                            name: this.nameElement.value,
                            lastName: this.lastNameElement.value,
                            email: this.emailElement.value,
                            password: this.passwordElement.value,
                            passwordRepeat: this.confirmElement.value,
                        });

                    if (result.error || !result.response) {
                        this.commonErrorElement.style.display = 'block';
                        return;
                    }

                    if (this.popup) {
                        this.popup.classList.remove('d-none');
                    }
                    if (this.goToLoginBtn) {
                        this.goToLoginBtn.onclick = () => {
                            this.router.open('/login');
                        };
                    }
                }
            }
        }
    }
}