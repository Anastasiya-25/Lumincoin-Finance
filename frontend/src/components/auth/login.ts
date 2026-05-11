import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";
import type {LoginType} from "../../types/login.type";
import type {LoginResponseType} from "../../types/login-response.type";

export class Login {
    readonly router: Router;
    readonly passwordElement: HTMLInputElement | null;
    readonly emailElement: HTMLInputElement | null;
    readonly rememberMeElement: HTMLInputElement | null;
    readonly commonErrorElement: HTMLElement | null;
    constructor(router: Router) {
        this.router = router;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.router.open('/');
        }
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('rememberMe') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error') as HTMLElement;
        document.getElementById('login-button')?.addEventListener('click', this.login.bind(this));
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.emailElement && this.passwordElement) {
            if (this.emailElement.value && this.emailElement.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                this.emailElement.classList.remove('is-invalid');
            } else {
                this.emailElement.classList.add('is-invalid');
                isValid = false;
            }

            if (this.passwordElement.value) {
                this.passwordElement.classList.remove('is-invalid');
            } else {
                this.passwordElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    private async login(e: Event): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
            e.preventDefault();
            if (this.emailElement && this.passwordElement && this.rememberMeElement) {
                if (this.validateForm()) {
                    const result: LoginResponseType<LoginType> = await HttpUtils.request('/login', 'POST', false,
                        {
                            email: this.emailElement.value,
                            password: this.passwordElement.value,
                            rememberMe: this.rememberMeElement.checked,
                        });

                    if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken
                        || !result.response.user))) {
                        this.commonErrorElement.style.display = 'block';
                        return;
                    }
                    AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, result.response.user);
                    this.router.open('/');
                }
            }
        }
    }
}