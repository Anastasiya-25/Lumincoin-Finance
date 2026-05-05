import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Logout {
    constructor(router) {
        this.router = router;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.router.open('/login');
        }
        this.logout().then();
    }

    async logout() {
         await HttpUtils.request('/logout', 'POST', false,
            {
                refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
            });

        AuthUtils.removeAuthInfo();
        this.router.open('/login');
    }
}