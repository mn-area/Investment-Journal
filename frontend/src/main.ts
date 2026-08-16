import './style.css'
// ======================
// 1. 状態
// ======================
interface CreateTradeRequest {
    stockName: string;
    tradeType: 'BUY' | 'SELL';
    tradeDate: string;
    quantity: number;
    unitPrice: number;
    fee: number;
    reason: string;
    memo: string;
}

interface UpdateTradeRequest {
    tradeId: string,
    stockName: string;
    tradeType: 'BUY' | 'SELL';
    tradeDate: string;
    quantity: number;
    unitPrice: number;
    fee: number;
    reason: string;
    memo: string;
}

interface DeteleTradeRequest {
    tradeId: string
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
    tradeType: string;
    unitPrice: number;
    updatedAt: string;
};

interface TradeResponce {
    data: TradeData[];
    message: string;
}

interface TradeFormValue {
    stockName: FormDataEntryValue | null;
    tradeDate: FormDataEntryValue | null;
    quantity: number;
    unitPrice: number;
    fee: number;
    reason: FormDataEntryValue | null;
    memo: FormDataEntryValue | null;
}

let tradeType: 'BUY' | 'SELL' = 'BUY';

let valitationFlag = false;
let tradeId = '';
// ======================
// 2. 定数
// ======================
const url = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades';
const updateUrl = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades/update';
const deleteUrl = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades/delete';

const BUY = '購入';
const SELL = '売却';

const successMeassage = 'データの登録に成功しました。';
const updateMeassage = 'データの更新に成功しました。';
const deleteMeassage = 'データの削除に成功しました。';
// ======================
// 3. 関数
// ======================

// 登録データバリデーションチェック
function registTradeValidation(formValue: TradeFormValue) {
    const formData = new FormData(form);
    const quantityStr = formData.get('quantity');
    const unitPriceStr = formData.get('unitPrice');
    const feeStr = formData.get('fee');
    valitationFlag = false;

    if (!formValue.stockName) {
        alert('銘柄名を入力してください');
        valitationFlag = true;
        return;
    }
    if (!buyTradeButton.classList.contains('btn-dash') && !sellTradeButton.classList.contains('btn-dash')) {
        alert('取引種類を選択してください');
        valitationFlag = true;
        return;
    }
    if (!formValue.tradeDate) {
        alert('取引日を入力してください');
        valitationFlag = true;
        return;
    }
    if (!quantityStr) {
        alert('数量を入力してください');
        valitationFlag = true;
        return;
    }
    if (!unitPriceStr) {
        alert('単価を入力してください');
        valitationFlag = true;
        return;
    }

    if(formValue.quantity !== 0) {
        if (!Number(formValue.quantity)) {
            alert('数量は数値を入力してください');
            valitationFlag = true;
            return;
        }
    }

    if(formValue.unitPrice !== 0) {
        if (!Number(formValue.unitPrice)) {
            alert('単価は数値を入力してください');
            valitationFlag = true;
            return;
        }
    }

    if(formValue.fee !== 0) {
        if (feeStr) {
            if (!Number(formValue.fee)) {
                alert('手数料は数値を入力してください');
                valitationFlag = true;
                return;
            }
        }
    }
}

// データ登録API呼び出し
async function postData(registData : CreateTradeRequest) {
    try {
        const res = await fetch(url, {
            method : 'POST',
            body : JSON.stringify(registData)
        });

        // HTTPステータスが成功ステータス（200〜299）以外の場合
        if (!res.ok) {
            if (res.status === 400) {
                throw new Error('入力内容を確認してください (400)');
            } else if (res.status === 404) {
                throw new Error('ページが見つかりません (404)');
            } else if (res.status === 500) {
                throw new Error('サーバーエラーです (500)');
            } else {
                throw new Error(`通信エラー: ${res.status}`);
            }
        }
        tradeRegistDialog.close();
    } catch (error){
        console.error('通信に失敗しました:', error);
        showToastError();
    }
}

// データ更新API呼び出し
async function updateData(registData : UpdateTradeRequest) {
    try {
        const res = await fetch(updateUrl, {
            method : 'PUT',
            body : JSON.stringify(registData)
        });

        // HTTPステータスが成功ステータス（200〜299）以外の場合
        if (!res.ok) {
            throw new Error(`HTTPエラー: ${res.status}`);
        }
        tradeRegistDialog.close();
    } catch (error){
        console.error('通信に失敗しました:', error);
        showToastError();
    }
}

// データ削除API呼び出し
async function deleteData(registData: DeteleTradeRequest) {
    try {
        const res = await fetch(deleteUrl, {
            method : 'DELETE',
            body : JSON.stringify(registData)
        });

        // HTTPステータスが成功ステータス（200〜299）以外の場合
        if (!res.ok) {
            throw new Error(`HTTPエラー: ${res.status}`);
        }
        tradeRegistDialog.close();
    } catch (error){
        console.error('通信に失敗しました:', error);
        showToastError();
    }
}

// データ取得API呼び出し
async function getData() {
    try {
        const response = await fetch(url);
        // HTTPステータスが成功ステータス（200〜299）以外の場合
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch(error) {
        console.error('通信に失敗しました:', error);
        showToastError();
    }
}

// データ登録完了メッセージ表示関数
function showToast(message : string) {
    const toast = document.getElementById('toast') as HTMLDivElement;
    const firstEl = toast.firstElementChild;
    const textEl = firstEl?.firstElementChild;
    if (textEl) {
        textEl.textContent = message
    }

    toast.classList.remove('hidden') ;
    setTimeout(() => {
        toast.classList.add('hidden') ;
    },
    5000);
}

// データ失敗メッセージ表示関数
function showToastError() {
    const toast = document.getElementById('toast-error') as HTMLDivElement;
    toast.classList.remove('hidden') ;
    setTimeout(() => {
        toast.classList.add('hidden') ;
    },
    5000);
}

// ダイアログ入力値取得関数
function getFormValue(): TradeFormValue {
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

// 登録ダイアログの入力値を初期化
function resetFormvalue() {
    tradeName.value = '';
    tradeDate.value = '';
    quantity.value = '';
    unitPrice.value = '';
    fee.value = '';
    reason.value = '';
    memo.value = '';
}

// 投資記録一覧画面描画
function renderTradeList(tradeData : TradeResponce) {
    tradeListTable.innerHTML = '';
    const tradeCount =  document.getElementById('trade-count') as HTMLFormElement;
    const totalBuyAmount =  document.getElementById('total-buy-amount') as HTMLFormElement;
    const totalSellAmount =  document.getElementById('total-sell-amount') as HTMLFormElement;
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

// ======================
// 4. HTML要素取得
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
const tradeDate = document.getElementById('trade-date') as HTMLDataElement;
const quantity = document.getElementById('quantity') as HTMLInputElement;
const unitPrice = document.getElementById('unit-price') as HTMLInputElement;
const fee = document.getElementById('fee') as HTMLInputElement;
const reason = document.getElementById('reason') as HTMLTextAreaElement;
const memo = document.getElementById('memo') as HTMLTextAreaElement;

// ======================
// 5. イベント登録
// ======================
// 取引データ描画処理
document.addEventListener('DOMContentLoaded', async () => {
    const tradeList: TradeResponce = await getData();
    tradeList.data.sort((a, b) => Date.parse(a.tradeDate) - Date.parse(b.tradeDate));
    renderTradeList(tradeList);
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
    const stockName = tds[1].textContent;
    const Quantity = tds[2].textContent;
    const UnitPrice = tds[3].textContent;
    const Fee = tds[4].textContent;
    const UnitType = tds[6].textContent;
    const typeDate = tds[7].textContent;
    const Reason = tds[8].textContent;
    const Memo = tds[9].textContent;
    if (tradeId) {
        tradeName!.value = stockName;
        tradeDate!.value = typeDate;
        quantity!.value = String(Quantity);
        unitPrice!.value = String(UnitPrice);
        if (UnitType == BUY) {
            buyTradeButton.classList.remove('btn-dash');
            sellTradeButton.classList.add('btn-dash');
        } else if (UnitType == SELL){
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
    registTradeValidation(formValue);
    if (valitationFlag) {
        return;
    }

    loadingLayer?.classList.remove('hidden');

    if (submitter.textContent == '登録') {
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
        await postData(request);
        dispMessage = successMeassage;
        loadingLayer?.classList.add('hidden');
    } else if (submitter.textContent == '更新') {
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
            await updateData(request);
            dispMessage = updateMeassage;
        }
        loadingLayer?.classList.add('hidden');
    } else if (submitter.textContent == '削除') {
        const request: DeteleTradeRequest = {
            tradeId: tradeId
        }
        if (window.confirm("データを削除してよろしいですか?")) {
            await deleteData(request);
            dispMessage = deleteMeassage;
        }
        loadingLayer?.classList.add('hidden');
    }
    const tradeList: TradeResponce = await getData();
    showToast(dispMessage);
    tradeList.data.sort((a, b) => Date.parse(a.tradeDate) - Date.parse(b.tradeDate));
    renderTradeList(tradeList);
});

// ======================
// 6. 初回実行
// ======================