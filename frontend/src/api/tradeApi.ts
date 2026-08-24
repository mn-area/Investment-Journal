import { registUrl } from "../costants/const";
import type { TradeResponse } from "../types/TradeResponse";
import callApi from "./common";

// データ取得API呼び出し
export default async function getData(): Promise<TradeResponse> {
    const res = await callApi(registUrl, 'GET');
    const data = await res.json()

    return data;
}