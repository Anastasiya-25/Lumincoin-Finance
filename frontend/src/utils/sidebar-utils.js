import {HttpUtils} from "./http-utils.js";
import {AuthUtils} from "./auth-utils.js";
import * as bootstrap from 'bootstrap';

export class SidebarUtils {
    static async showBalance() {
        const balanceElement = document.getElementById('balance-amount');
        if (!balanceElement) {
            return;
        }
        const result = await HttpUtils.request('/balance');
        if (result.response) {
            document.getElementById('balance-amount').innerText = result.response.balance + ' $';
        }
    }

    static showUserName() {
        const balanceElement = document.getElementById('balance-amount');
        if (!balanceElement) {
            return;
        }
        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (userInfo) {
            const user = JSON.parse(userInfo);
            document.getElementById('user').innerText = `${user.name} ${user.lastName}`;
        }
    }

    static initLogout(router) {
        const logoutElement = document.getElementById('logout-button');
        const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
        new bootstrap.Tooltip(logoutElement);
        logoutElement.addEventListener('click', () => {
            logoutModal.show();
        });

        document.getElementById('confirm-logout').addEventListener('click', () => {
            logoutModal.hide();
            router.open('/logout');
        });
    }
}