export type ResultResponseType<T> = {
    error: boolean,
    response: T | null,
    redirect?: string,
    message?: string,
}