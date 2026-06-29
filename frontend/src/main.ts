import './style.css'
// ======================
// 1. 状態
// ======================
const registData = {
    stockName : '',
    tradeDate : '1900-12-31',
    quantity : 0,
    unitPrice : 0,
    fee : 0,
    reason : '',
    memo : ''
}
// ======================
// 2. 定数
// ======================

// ======================
// 3. 関数
// ======================
function registTradeValidation() {
    
}

function callApi() {
    fetch('https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades', {
        method : 'POST'
    })
	.then(res => res.json())
	.then(data => console.log(data))
	.catch(error => console.error('Error:', error));
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

// ======================
// 5. イベント登録
// ======================
openTradeButton?.addEventListener('click', () => {
    tradeRegistDialog.showModal();
});

closeTradeButton?.addEventListener('click', () => {
    tradeRegistDialog.close();
});

buyTradeButton?.addEventListener('click', () => {
    buyTradeButton.classList.remove('btn-dash');
    sellTradeButton.classList.add('btn-dash');
});

sellTradeButton?.addEventListener('click', () => {
    buyTradeButton.classList.add('btn-dash');
    sellTradeButton.classList.remove('btn-dash');
});

form?.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const formData = new FormData(form);
    const stockName = formData.get('stockName');
    const tradeDate = formData.get('tradeDate');
    const quantityStr = formData.get('quantity');
    const quantity = Number(quantityStr);
    const unitPriceStr = formData.get('unitPrice');
    const unitPrice = Number(unitPriceStr);
    const feeStr = formData.get('fee');
    const fee = Number(feeStr);
    if (!stockName) {
        alert('銘柄名を入力してください');
        return;
    }
    if (!buyTradeButton.classList.contains('btn-dash') && !sellTradeButton.classList.contains('btn-dash')) {
        alert('取引種類を選択してください');
        return;
    }
    if (!tradeDate) {
        alert('取引日を入力してください');
        return;
    }
    if (!quantityStr) {
        alert('数量を入力してください');
        return;
    }
    if (!unitPriceStr) {
        alert('単価を入力してください');
        return;
    }
    if (!Number(quantity)) {
        alert('数量は数値を入力してください');
        return;
    }
    if (!Number(unitPrice)) {
        alert('単価は数値を入力してください');
        return;
    }
    if (!Number(fee)) {
        alert('手数料は数値を入力してください');
        return;
    }
    registData.stockName = stockName as string;
    registData.tradeDate = tradeDate as string;
    registData.quantity = quantity;
    registData.unitPrice = unitPrice;
    registData.reason = formData.get('reason') as string;
    registData.memo = formData.get('memo') as string;
    console.log(registData)
    callApi();
});
// ======================
// 6. 初回実行
// ======================