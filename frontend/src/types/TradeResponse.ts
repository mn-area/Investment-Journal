export interface TradeResponse {
    data: TradeData[];
    message: string;
}

interface TradeData {
    createdAt: string;
    fee: number;
    isDeleted: boolean;
    memo: string;
    quantity: number;
    reason: string;
    stockName: string;
    tradeDate: string;
    tradeId: string;
    tradeType: 'BUY' | 'SELL';
    unitPrice: number;
    updatedAt: string;
}