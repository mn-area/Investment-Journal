import type { TradeFormValue } from "../types/TradeFormValue";

const form = document.getElementById('regist-trade-form') as HTMLFormElement;
const buyTradeButton = document.getElementById('buy-trade-btn')  as HTMLButtonElement;
const sellTradeButton = document.getElementById('sell-trade-btn') as HTMLButtonElement;

export default function registTradeValidation(formValue: TradeFormValue): boolean {
    const formData = new FormData(form);
    const quantityStr = formData.get('quantity');
    const unitPriceStr = formData.get('unitPrice');
    const feeStr = formData.get('fee');
    const tradeNameError = document.getElementById('trade-name-error');
    const tradeBtnError = document.getElementById('trade-btn-error');
    const tradeDateError = document.getElementById('trade-date-error');
    const tradeQuantityError = document.getElementById('trade-quantity-error');
    const tradePriceError = document.getElementById('trade-price-error');
    const tradeFeeError = document.getElementById('trade-fee-error');

    tradeNameError!.textContent = '';
    tradeBtnError!.textContent = '';
    tradeDateError!.textContent = '';
    tradeQuantityError!.textContent = '';
    tradePriceError!.textContent = '';
    tradeFeeError!.textContent = '';

    if (!formValue.stockName) {
        tradeNameError!.textContent = '銘柄名を入力してください';
        return true;
    }
    if (!buyTradeButton.classList.contains('btn-dash') && !sellTradeButton.classList.contains('btn-dash')) {
        tradeBtnError!.textContent = '取引種類を選択してください';
        return true;
    }
    if (!formValue.tradeDate) {
        tradeDateError!.textContent = '取引日を入力してください';
        return true;
    }
    if (!quantityStr) {
        tradeQuantityError!.textContent = '数量を入力してください';
        return true;
    }
    if (!unitPriceStr) {
        tradePriceError!.textContent = '単価を入力してください';
        return true;
    }

    if(formValue.quantity !== 0) {
        if (!Number(formValue.quantity)) {
            tradeQuantityError!.textContent = '数量は数値を入力してください';
            return true;
        }
    }

    if(formValue.unitPrice !== 0) {
        if (!Number(formValue.unitPrice)) {
            tradePriceError!.textContent = '単価は数値を入力してください';
            return true;
        }
    }

    if(formValue.fee !== 0) {
        if (feeStr) {
            if (!Number(formValue.fee)) {
                tradeFeeError!.textContent = '手数料は数値を入力してください';
                return true;
            }
        }
    }
    return false;
}