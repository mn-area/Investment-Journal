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
let tradeType: 'BUY' | 'SELL' = 'BUY';

let valitationFlag = false;

// ======================
// 2. 定数
// ======================
const url = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades';
// ======================
// 3. 関数
// ======================
function registTradeValidation() {
    const formData = new FormData(form);
    const stockName = formData.get('stockName');
    const tradeDate = formData.get('tradeDate');
    const quantityStr = formData.get('quantity');
    const quantity = Number(quantityStr);
    const unitPriceStr = formData.get('unitPrice');
    const unitPrice = Number(unitPriceStr);
    const feeStr = formData.get('fee');
    const fee = Number(feeStr);
    valitationFlag = false;
    if (!stockName) {
        alert('銘柄名を入力してください');
        valitationFlag = true;
        return;
    }
    if (!buyTradeButton.classList.contains('btn-dash') && !sellTradeButton.classList.contains('btn-dash')) {
        alert('取引種類を選択してください');
        valitationFlag = true;
        return;
    }
    if (!tradeDate) {
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
    if (!Number(quantity)) {
        alert('数量は数値を入力してください');
        valitationFlag = true;
        return;
    }
    if (!Number(unitPrice)) {
        alert('単価は数値を入力してください');
        valitationFlag = true;
        return;
    }
    if (feeStr) {
        if (!Number(fee)) {
            alert('手数料は数値を入力してください');
            valitationFlag = true;
            return;
        }
    }
}

async function callApi(registData : CreateTradeRequest) {
    try {
        await fetch(url, {
            method : 'POST',
            body : JSON.stringify(registData)
        })
        .then(respnse => {
            if (respnse.ok) {
                showToast();
            }
        })
        .then(data => console.log(data));
    } catch (error){
        console.error('通信に失敗しました:', error);
    }
}

async function getData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error) {
        console.error('通信に失敗しました:', error);
    }
}

function showToast() {
    const toast = document.getElementById('toast') as HTMLButtonElement;
    toast.classList.remove('hidden') ;
    setTimeout(() => {
        toast.classList.add('hidden') ;
    },
    5000);
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

// ======================
// 5. イベント登録
// ======================
document.addEventListener('DOMContentLoaded', async () => {
    const tradeList = await getData();
    const tradeListTable = document.getElementById('trade-list-table') as HTMLTableElement;

    for (const trade of tradeList.data.Items) {
        const totalPrice = trade.unitPrice * trade.quantity + (trade.fee ?? 0);

        const rowData = [
            '',
            trade.stockName,
            trade.quantity,
            trade.unitPrice,
            trade.fee,
            totalPrice,
            trade.tradeType,
            trade.tradeDate,
            trade.reason
        ];

        const tr = document.createElement('tr');

        for (const value of rowData) {
            const td = document.createElement('td');
            td.textContent = String(value ?? '');
            tr.appendChild(td);
        }
        tradeListTable.appendChild(tr);
    }
});

openTradeButton?.addEventListener('click', () => {
    tradeRegistDialog.showModal();
});

closeTradeButton?.addEventListener('click', () => {
    tradeRegistDialog.close();
});

buyTradeButton?.addEventListener('click', () => {
    tradeType = 'BUY';
    buyTradeButton.classList.remove('btn-dash');
    sellTradeButton.classList.add('btn-dash');
});

sellTradeButton?.addEventListener('click', () => {
    tradeType = 'SELL';
    buyTradeButton.classList.add('btn-dash');
    sellTradeButton.classList.remove('btn-dash');
});

form?.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    registTradeValidation(); // TODO:validationを関数化
    if (valitationFlag) {
        return;
    }
    const formData = new FormData(form);
    const stockName = formData.get('stockName');
    const tradeDate = formData.get('tradeDate');
    const quantityStr = formData.get('quantity');
    const quantity = Number(quantityStr);
    const unitPriceStr = formData.get('unitPrice');
    const unitPrice = Number(unitPriceStr);
    const feeStr = formData.get('fee');
    const fee = Number(feeStr);
    
    loadingLayer?.classList.remove('hidden');
    const request: CreateTradeRequest = {
        stockName : stockName as string,
        tradeType : tradeType,
        tradeDate : tradeDate as string,
        quantity : quantity,
        unitPrice : unitPrice,
        fee : fee,
        reason : formData.get('reason') as string,
        memo : formData.get('memo') as string,
    }
    console.log(request);
    await callApi(request);
    loadingLayer?.classList.add('hidden');
    tradeRegistDialog.close();
});
// ======================
// 6. 初回実行
// ======================