export const registUrl = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades' as const;
export const updateUrl = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades/update' as const;
export const deleteUrl = 'https://wwy4qxr3pl.execute-api.ap-northeast-1.amazonaws.com/dev/trades/delete' as const;

export const successMessage = 'データの登録に成功しました。';
export const updateMessage = 'データの更新に成功しました。';
export const deleteMessage = 'データの削除に成功しました。';
export const errorMessage400 = 'リクエスト内容が不正です。管理者に問い合わせてください。' as const;
export const errorMessage404 = 'リクエストURLが見つかりません。管理者に問い合わせてください。' as const;
export const errorMessage500 = 'サーバーエラーが発生しました。管理者に問い合わせてください。' as const;
export const NetworkErrorMessage = 'ネットワークエラーが発生しました。管理者に問い合わせてください。' as const;
export const ExceptionErrorMessage = '例外エラーが発生しました。管理者に問い合わせてください。' as const;

export const BUY = '購入' as const;
export const SELL = '売却' as const;

export const STOCK_NAME = 1;
export const QUANTITY = 2;
export const UNIT_PRICE = 3;
export const FEE = 4;
export const UNIT_TYPE = 6;
export const TYPE_DATE = 7;
export const REASON = 8;
export const MEMO = 9;
