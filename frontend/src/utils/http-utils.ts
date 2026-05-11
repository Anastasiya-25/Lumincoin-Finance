import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import type {ResultResponseType} from "../types/result-response.type";

export class HttpUtils {

    public static async request<T = any>(url: string, method: string = "GET", useAuth: boolean = true, body: any = null):
        Promise<ResultResponseType<T>> {
        const result: ResultResponseType<T> = {
            error: false,
            response: null
        }

        const params: RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }

        let token: string | null = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string | null;
            if (token) {
                (params.headers as Record<string, string>)['x-auth-token'] = token;
            }
        }
        if (body) {
            params.body = JSON.stringify(body);
        }
        let response: Response | null = null;

        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    result.redirect = '/login';
                } else {
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        console.log("REFRESH SUCCESS", updateTokenResult);
                        return await this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }
        return result;
    }
}