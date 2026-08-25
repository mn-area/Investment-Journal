import './styles/style.css';
import renderTradeList from './render/tradeList';
import registTradeValidation from './validation/tradeValidations';
import callApi from './api/common';
import { showToast, showToastError, showToastErrorMain} from './utils/toast'
import getData from './api/tradeApi';
import { getFormValue, resetFormvalue} from './form/tradeForm'
import * as consts from './const/const';
import type { TradeResponse } from './types/TradeResponse';
import type { CreateTradeRequest } from './types/CreateTrade';
import type { UpdateTradeRequest } from './types/UpdateTrade';
import type { DeleteTradeRequest } from './types/DeleteTrade';

// ======================
// 1. 状態
// ======================
let tradeType: 'BUY' | 'SELL' = 'BUY';
let tradeId = '';

// ======================
// 2. HTML要素取得
// ======================
const openTradeButton = document.getElementById('open-trade-btn');
const closeTradeButton = document.getElementById('close-trade-btn');
const buyTradeButton = document.getElementById('buy-trade-btn')  as HTMLButtonElement;
const sellTradeButton = document.getElementById('sell-trade-btn') as HTMLButtonElement;
const tradeRegistDialog = document.getElementById('regist-trade-dialog') as HTMLDialogElement;
const form = document.getElementById('regist-trade-form') as HTMLFormElement;
const loadingLayer = document.getElementById('loading-layer');
const tradeListTable = document.getElementById('trade-list-body') as HTMLTableSectionElement;
const registTradeButton = document.getElementById('regist-trade-btn')  as HTMLButtonElement;
const updateTradeButton = document.getElementById('update-trade-btn')  as HTMLButtonElement;
const deleteTradeButton = document.getElementById('delete-trade-btn')  as HTMLButtonElement;

// 登録ダイアログ入力欄要素
const tradeName = document.getElementById('trade-name') as HTMLInputElement;
const tradeDate = document.getElementById('trade-date') as HTMLInputElement;
const quantity = document.getElementById('quantity') as HTMLInputElement;
const unitPrice = document.getElementById('unit-price') as HTMLInputElement;
const fee = document.getElementById('fee') as HTMLInputElement;
const reason = document.getElementById('reason') as HTMLTextAreaElement;
const memo = document.getElementById('memo') as HTMLTextAreaElement;

// ======================
// 3. イベント登録
// ======================
// 取引データ描画処理
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const tradeList: TradeResponse = await getData();
        tradeList.data.sort((a, b) => Date.parse(a.tradeDate) - Date.parse(b.tradeDate));
        renderTradeList(tradeList);
    } catch (error) {
        if (error instanceof Error) {
            showToastErrorMain(error.message);
        } else {
            showToastErrorMain(consts.ExceptionErrorMessage);
        }
    }

});

// テーブル行押下処理
tradeListTable.addEventListener('click', async (event) => {
    resetFormvalue();
    registTradeButton.style.display = 'none';
    updateTradeButton.style.display = '';
    deleteTradeButton.style.display = '';
    const target = event.target as HTMLElement;
    const tr = target.closest('tr');
    if (!tr) return;
    if (!tr.dataset.tradeId)return;
    tradeId = tr.dataset.tradeId;

    const tds = tr.cells;
    const stockName = tds[consts.STOCK_NAME].textContent;
    const Quantity = tds[consts.QUANTITY].textContent;
    const UnitPrice = tds[consts.UNIT_PRICE].textContent;
    const Fee = tds[consts.FEE].textContent;
    const UnitType = tds[consts.UNIT_TYPE].textContent;
    const typeDate = tds[consts.TYPE_DATE].textContent;
    const Reason = tds[consts.REASON].textContent;
    const Memo = tds[consts.MEMO].textContent;

    if (tradeId) {
        tradeName!.value = stockName;
        tradeDate!.value = typeDate;
        quantity!.value = String(Quantity);
        unitPrice!.value = String(UnitPrice);
        if (UnitType == consts.BUY) {
            tradeType = 'BUY';
            buyTradeButton.classList.remove('btn-dash');
            sellTradeButton.classList.add('btn-dash');
        } else if (UnitType == consts.SELL){
            tradeType = 'SELL';
            buyTradeButton.classList.add('btn-dash');
            sellTradeButton.classList.remove('btn-dash');
        }
        if (Fee) {
            fee.value = String(Fee);
        }
        if (Reason) {
            reason.value = Reason;
        }
        if (memo) {
            memo.value =  Memo;
        }
        tradeRegistDialog.showModal();
    }
});

// 取引登録ダイアログ表示ボタン
openTradeButton?.addEventListener('click', () => {
    resetFormvalue();
    registTradeButton.style.display = '';
    updateTradeButton.style.display = 'none';
    deleteTradeButton.style.display = 'none';
    tradeRegistDialog.showModal();
});

// 取引登録ダイアログ閉じるボタン
closeTradeButton?.addEventListener('click', () => {
    tradeRegistDialog.close();
});

// 取引種類：購入ボタン
buyTradeButton?.addEventListener('click', () => {
    tradeType = 'BUY';
    buyTradeButton.classList.remove('btn-dash');
    sellTradeButton.classList.add('btn-dash');
});

// 取引種類：売却ボタン
sellTradeButton?.addEventListener('click', () => {
    tradeType = 'SELL';
    buyTradeButton.classList.add('btn-dash');
    sellTradeButton.classList.remove('btn-dash');
});

// 取引登録ダイアログ登録ボタン
form?.addEventListener('submit', async (e) => {
    let dispMessage = '';
    e.preventDefault();
    const submitter = e.submitter;
    if (!submitter) {
        return;
    }

    const formValue = getFormValue();

    if (registTradeValidation(formValue)) {
        return;
    }

    loadingLayer?.classList.remove('hidden');

    try {
        if (submitter.dataset.registType == 'regist') {
            const request: CreateTradeRequest = {
                stockName : formValue.stockName as string,
                tradeType : tradeType,
                tradeDate : formValue.tradeDate as string,
                quantity : formValue.quantity,
                unitPrice : formValue.unitPrice,
                fee : formValue.fee,
                reason : formValue.reason as string,
                memo : formValue.memo as string,
            }
            await callApi(consts.registUrl, 'POST', request);
            tradeRegistDialog.close();
            dispMessage = consts.successMessage;
        } else if (submitter.dataset.registType == 'update') {
            const request: UpdateTradeRequest = {
                tradeId : tradeId,
                stockName : formValue.stockName as string,
                tradeType : tradeType,
                tradeDate : formValue.tradeDate as string,
                quantity : formValue.quantity,
                unitPrice : formValue.unitPrice,
                fee : formValue.fee,
                reason : formValue.reason as string,
                memo : formValue.memo as string,
            }
            if (window.confirm("データを更新してよろしいですか?")) {
                await callApi(consts.updateUrl, 'PUT', request);
                tradeRegistDialog.close();
                dispMessage = consts.updateMessage;
            }
        } else if (submitter.dataset.registType == 'delete') {
            const request: DeleteTradeRequest = {
                tradeId: tradeId
            }
            if (window.confirm("データを削除してよろしいですか?")) {
                await callApi(consts.deleteUrl, 'DELETE', request);
                tradeRegistDialog.close();
                dispMessage = consts.deleteMessage;
            }
        }
        const tradeList: TradeResponse = await getData();
        showToast(dispMessage);
        tradeList.data.sort((a, b) => Date.parse(a.tradeDate) - Date.parse(b.tradeDate));
        renderTradeList(tradeList);
    } catch (error) {
        if (error instanceof Error) {
            showToastError(error.message);
        } else {
            showToastError(consts.ExceptionErrorMessage);
        }
        
    } finally {
        loadingLayer?.classList.add('hidden');
    }
});