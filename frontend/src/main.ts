import './style.css'

const tradeRegistbutton = document.querySelector('#regist-trade-btn');
const tradeRegistDialog = document.getElementById('regist-trade-dialog') as HTMLDialogElement;;

tradeRegistbutton?.addEventListener('click', () => {
    tradeRegistDialog.showModal();
});