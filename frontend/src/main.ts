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
    // tradeType: 'BUY' | 'SELL';
    tradeDate: string;
    quantity: number;
    unitPrice: number;
    fee: number;
    reason: string;
    memo: string;
}
let tradeType: 'BUY' | 'SELL' = 'BUY';

let valitationFlag = false;
let tradeId = '';
// ======================
// 2. 定数
// ======================
const url = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades';
const updateUrl = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades/update';

const BUY = '購入';
const SELL = '売却';

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

async function postData(registData : CreateTradeRequest) {
    try {
        await fetch(url, {
            method : 'POST',
            body : JSON.stringify(registData)
        })
        .then(respnse => {
            if (respnse.ok) {
                tradeRegistDialog.close();
                showToast();
            }
        })
        .then(data => console.log(data));
    } catch (error){
        console.error('通信に失敗しました:', error);
    }
}

async function updateData(registData : UpdateTradeRequest) {
        try {
        await fetch(updateUrl, {
            method : 'PUT',
            body : JSON.stringify(registData)
        })
        .then(respnse => {
            if (respnse.ok) {
                tradeRegistDialog.close();
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
        return data;
    } catch(error) {
        console.error('通信に失敗しました:', error);
    }
}

function showToast() {
    const toast = document.getElementById('toast') as HTMLDivElement;
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
const tradeListTable = document.getElementById('trade-list-body') as HTMLTableSectionElement;
const registTradeButton = document.getElementById('regist-trade-btn')  as HTMLButtonElement;
const updateTradeButton = document.getElementById('update-trade-btn')  as HTMLButtonElement;

// ======================
// 5. イベント登録
// ======================
// 取引データ描画処理
document.addEventListener('DOMContentLoaded', async () => {
    const tradeList = await getData();
    const tradeCount =  document.getElementById('trade-count') as HTMLFormElement;
    const totalBuyAmount =  document.getElementById('total-buy-amount') as HTMLFormElement;
    const totalSellAmount =  document.getElementById('total-sell-amount') as HTMLFormElement;
    let totalBuy = 0;
    let totalSell = 0;

    // 取引一覧テーブルデータ生成
    for (const trade of tradeList.data) {
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
        tradeCount.textContent = `${tradeList.data.length}件`;
    }

    // 購入金額合計カード
    if (totalBuyAmount) {
        totalBuyAmount.textContent = `￥ ${totalBuy}`
    }
    
    // 売却金額合計カード
    if (totalSellAmount) {
    totalSellAmount.textContent = `￥ ${totalSell}`
    }
});

// テーブル行押下処理
tradeListTable.addEventListener('click', async (event) => {
    registTradeButton.style.display = 'none';
    updateTradeButton.style.display = '';
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
        const tradeName = document.getElementById('trade-name') as HTMLInputElement;
        const tradeDate = document.getElementById('trade-date') as HTMLDataElement;
        const quantity = document.getElementById('quantity') as HTMLInputElement;
        const unitPrice = document.getElementById('unit-price') as HTMLInputElement;
        const fee = document.getElementById('fee') as HTMLInputElement;
        const reason = document.getElementById('reason') as HTMLTextAreaElement;
        const memo = document.getElementById('memo') as HTMLTextAreaElement;;
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
    registTradeButton.style.display = '';
    updateTradeButton.style.display = 'none';
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
    e.preventDefault();
    const submitter = e.submitter; 
    if (!submitter) {
        return;
    }
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


    if (submitter.textContent == '登録') {
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
        await postData(request);
        loadingLayer?.classList.add('hidden');
    } else if (submitter.textContent == '更新') {
        const request: UpdateTradeRequest = {
            tradeId : tradeId,
            stockName : stockName as string,
            // tradeType : tradeType,
            tradeDate : tradeDate as string,
            quantity : quantity,
            unitPrice : unitPrice,
            fee : fee,
            reason : formData.get('reason') as string,
            memo : formData.get('memo') as string,
        }
        console.log(request);
        console.log('更新')
        console.log(request)
        await updateData(request);
        loadingLayer?.classList.add('hidden');
    }
});

// ======================
// 6. 初回実行
// ======================