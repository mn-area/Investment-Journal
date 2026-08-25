import { errorMessage400, errorMessage404, errorMessage500, ExceptionErrorMessage, NetworkErrorMessage } from "../const/const";
import type { HttpMethod } from "../types/HttpMethod";

export default async function callApi<T>(url : string, type : HttpMethod, registData?: T) {
    try {
        const option: RequestInit = {
            method : type,
        }

        if (registData !== undefined) {
            option.body = JSON.stringify(registData);
        }

        const res = await fetch(url, option);

        // HTTPステータスが成功ステータス（200〜299）以外の場合
        if (!res.ok) {
            if (res.status === 400) {
                throw new Error(errorMessage400);
            } else if (res.status === 404) {
                throw new Error(errorMessage404);
            } else if (res.status === 500) {
                throw new Error(errorMessage500);
            } else {
                throw new Error(ExceptionErrorMessage);
            }
        }
        return res;
    } catch (error){
        if (error instanceof TypeError) {
            throw new Error(NetworkErrorMessage);
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(ExceptionErrorMessage);
    }
}