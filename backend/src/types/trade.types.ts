export interface Trade {
    tradeId: string;
    stockName: string;
    tradeType: string;
    tradeDate: string;
    quantity: number;
    unitPrice: number;
    fee: number;
    reason: string;
    memo: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}