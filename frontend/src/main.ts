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

// ======================
// 4. HTML要素取得
// ======================
const openTradeButton = document.getElementById('open-trade-btn');
const registTradeButton = document.getElementById('regist-trade-btn'); 
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

registTradeButton?.addEventListener('click', () => {
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
    const quantityStr = formData.get('quantity');
    const quantity = Number(quantityStr)
    const unitPriceStr = formData.get('unitPrice');
    const unitPrice = Number(unitPriceStr)

    registData.stockName = formData.get('stockName') as string;
    registData.tradeDate = formData.get('tradeDate') as string;
    registData.quantity = quantity;
    registData.unitPrice = unitPrice;
    registData.reason = formData.get('reason') as string;
    registData.memo = formData.get('memo') as string;
    console.log(registData)
});
// ======================
// 6. 初回実行
// ======================