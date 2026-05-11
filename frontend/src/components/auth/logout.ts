import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import type {Router} from "../../router";

export class Logout {
    readonly router: Router;
    constructor(router: Router) {
        this.router = router;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.router.open('/login');
        }
        this.logout().then();
    }

    private async logout(): Promise<void> {
         await HttpUtils.request('/logout', 'POST', false,
            {
                refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
            });

        AuthUtils.removeAuthInfo();
        this.router.open('/login');
    }
}