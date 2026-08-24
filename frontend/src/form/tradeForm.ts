import type { TradeFormValue } from "../types/TradeFormValue";

const form = document.getElementById('regist-trade-form') as HTMLFormElement;

// ダイアログ入力値取得関数
export function getFormValue(): TradeFormValue {
    const formData = new FormData(form);
    const stockName = formData.get('stockName');
    const tradeDate = formData.get('tradeDate');
    const quantityStr = formData.get('quantity');
    const quantity = Number(quantityStr);
    const unitPriceStr = formData.get('unitPrice');
    const unitPrice = Number(unitPriceStr);
    const feeStr = formData.get('fee');
    const fee = Number(feeStr);
    const reason = formData.get('reason');
    const memo = formData.get('memo');

    const formValue = {
        stockName: stockName,
        tradeDate: tradeDate,
        quantity: quantity,
        unitPrice: unitPrice,
        fee: fee,
        reason: reason,
        memo: memo
    }
    return formValue;
}

const buyTradeButton = document.getElementById('buy-trade-btn')  as HTMLButtonElement;
const sellTradeButton = document.getElementById('sell-trade-btn') as HTMLButtonElement;
const tradeName = document.getElementById('trade-name') as HTMLInputElement;
const tradeDate = document.getElementById('trade-date') as HTMLDataElement;
const quantity = document.getElementById('quantity') as HTMLInputElement;
const unitPrice = document.getElementById('unit-price') as HTMLInputElement;
const fee = document.getElementById('fee') as HTMLInputElement;
const reason = document.getElementById('reason') as HTMLTextAreaElement;
const memo = document.getElementById('memo') as HTMLTextAreaElement;

// 登録ダイアログの入力値を初期化
export function resetFormvalue() {
    buyTradeButton.classList.remove('btn-dash');
    sellTradeButton.classList.remove('btn-dash');
    tradeName.value = '';
    tradeDate.value = '';
    quantity.value = '';
    unitPrice.value = '';
    fee.value = '';
    reason.value = '';
    memo.value = '';
}