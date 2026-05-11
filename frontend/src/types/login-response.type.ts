export type UserType = {
    id: string;
    name: string;
};

type TokensType = {
    accessToken: string;
    refreshToken: string;
};

export type LoginResponseType<T> = {
    error: boolean;
    response: {
        tokens: TokensType;
        user: UserType;
        data?: T;
    } | null;
    redirect?: string;
    message?: string;
};