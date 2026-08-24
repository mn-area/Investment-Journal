import type { TradeResponse } from '../types/TradeResponse';

const BUY = '購入';
const SELL = '売却';
const tradeListTable = document.getElementById('trade-list-body') as HTMLTableSectionElement;

export default function renderTradeList(tradeData : TradeResponse) {
    tradeListTable.innerHTML = '';
    const tradeCount =  document.getElementById('trade-count');
    const totalBuyAmount =  document.getElementById('total-buy-amount');
    const totalSellAmount =  document.getElementById('total-sell-amount');
    let totalBuy = 0;
    let totalSell = 0;

    // 取引一覧テーブルデータ生成
    for (const trade of tradeData.data) {
        const totalPrice = trade.unitPrice * trade.quantity + (trade.fee ?? 0);
        const rowData = [
            {text: ''},
            {text: trade.stockName, className :'stockName' },
            {text: trade.quantity, className :'quantity' },
            {text: trade.unitPrice, className :'unitPrice' },
            {text: trade.fee, className :'fee' },
            {text: totalPrice, className :'totalPrice' },
            {text: trade.tradeType, className :'' },
            {text: trade.tradeDate, className :'tradeDate' },
            {text: trade.reason, className :'reason' },
            {text: trade.memo, className :'memo' }
        ];

        if (trade.tradeType == 'BUY') {
            rowData[5].className  = 'text-green-500';
            rowData[6].text  = BUY;
            rowData[6].className  = 'bg-green-500';
            totalBuy += totalPrice;
        } else if (trade.tradeType == 'SELL') {
            rowData[5].className  = 'text-red-500';
            rowData[6].text  = SELL;
            rowData[6].className  = 'bg-red-500';
            totalSell += totalPrice;
        }
        const tr = document.createElement('tr');
        tr.setAttribute('data-trade-id',trade.tradeId);
        tr.classList.add('row');
        for (const cell of rowData) {
            const td = document.createElement('td');
            td.textContent = String(cell.text ?? '');
            
            if (cell.className) {
                td.className = cell.className;
            }
            tr.appendChild(td);
        }
        tradeListTable.appendChild(tr);
    }

    // 取引件数カード
    if (tradeCount) {
        tradeCount.textContent = `${tradeData.data.length}件`;
    }

    // 購入金額合計カード
    if (totalBuyAmount) {
        totalBuyAmount.textContent = `￥ ${totalBuy}`
    }
    
    // 売却金額合計カード
    if (totalSellAmount) {
    totalSellAmount.textContent = `￥ ${totalSell}`
    }
}