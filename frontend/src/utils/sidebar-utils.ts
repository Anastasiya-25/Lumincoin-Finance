import {HttpUtils} from "./http-utils";
import {AuthUtils} from "./auth-utils";
import * as bootstrap from 'bootstrap';
import type {BalanceResponseType} from "../types/balance-response.type";
import type {UserInfoType} from "../types/user-info.type";
import type {Router} from "../router";
import type {ResultResponseType} from "../types/result-response.type";

export class SidebarUtils {
    public static async showBalance(): Promise<void> {
        const balanceElement: HTMLElement | null = document.getElementById('balance-amount');
        if (!balanceElement) {
            return;
        }
        const result: ResultResponseType<BalanceResponseType> = await HttpUtils.request<BalanceResponseType>('/balance');
        // const result: Response = await HttpUtils.request<BalanceResponseType>('/balance');
        if (result && result.response &&result.response.balance) {
            if (balanceElement) {
                balanceElement.innerText = result.response.balance + ' $';
            }
        }
    }

    public static showUserName(): void {
        const balanceElement = document.getElementById('balance-amount');
        if (!balanceElement) {
            return;
        }
        const userInfo: string = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (userInfo) {
            const user: UserInfoType = JSON.parse(userInfo);
            const userElement: HTMLElement | null = document.getElementById('user');
            if (user && userElement) {
                userElement.innerText = `${user.name} ${user.lastName}`;
            }
        }
    }

    public static initLogout(router: Router): void {
        const logoutElement: HTMLElement | null = document.getElementById('logout-button');
        const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
        new bootstrap.Tooltip(logoutElement);
        if (logoutElement) {
            logoutElement.addEventListener('click', (): void => {
                logoutModal.show();
            });
        }

        const confirmButtonElement: HTMLElement | null = document.getElementById('confirm-button');
        if (confirmButtonElement) {
            confirmButtonElement.addEventListener('click', (): void => {
                logoutModal.hide();
                router.open('/logout');
            });
        }
    }
}