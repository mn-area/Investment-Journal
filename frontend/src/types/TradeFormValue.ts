export interface TradeFormValue {
    stockName: FormDataEntryValue | null;
    tradeDate: FormDataEntryValue | null;
    quantity: number;
    unitPrice: number;
    fee: number;
    reason: FormDataEntryValue | null;
    memo: FormDataEntryValue | null;
}