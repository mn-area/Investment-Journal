// データ登録完了メッセージ表示関数
export function showToast(message : string) {
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

// データ処理失敗メッセージ表示関数
export function showToastError(message : string) {
    const toast = document.getElementById('toast-error') as HTMLDivElement;
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

// 一覧画面用データ取得失敗メッセージ表示関数
export function showToastErrorMain(message : string) {
    const toast = document.getElementById('toast-error-main') as HTMLDivElement;
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