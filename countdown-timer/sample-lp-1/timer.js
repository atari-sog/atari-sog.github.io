// ======== タイマー機能 ========

// タイマー機能の設定
const TIMER_DURATION = 24 * 60 * 60 * 1000; // 24時間（ミリ秒）
// テスト用に短く設定する場合
// const TIMER_DURATION = 5 * 60 * 1000; // 5分（ミリ秒）
const COOKIE_NAME = 'first_access_time';
const COOKIE_DURATION = 90; // Cookie保持日数
const REDIRECT_PAGE = '404.html';

// Cookie操作用のヘルパー関数
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * TIMER_DURATION);
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// タイマー機能の初期化
function initializeTimer() {
    // 1. まず404ページの確認
    if (window.location.pathname.endsWith(REDIRECT_PAGE)) {
        return; // 404ページでは何もしない
    }
    
    // 2. タイマーが存在するか確認
    const timerBanner = document.getElementById('timerBanner');
    if (!timerBanner) return;
    
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // 3. 初回アクセス時間をCookieから取得、なければ現在時刻を設定
    let firstAccess = getCookie(COOKIE_NAME);
    let endTime;
    
    if (!firstAccess) {
        firstAccess = Date.now();
        setCookie(COOKIE_NAME, firstAccess.toString(), COOKIE_DURATION);
    } else {
        firstAccess = parseInt(firstAccess); // 数値に変換
    }
    
    // 4. 終了時刻を計算（初回アクセスから24時間後）
    endTime = firstAccess + TIMER_DURATION;
    
    // 5. 現在時刻が終了時刻を過ぎていたら404ページにリダイレクト
    const currentTime = Date.now();
    if (currentTime >= endTime) {
        window.location.href = REDIRECT_PAGE;
        return;
    }
    
    // 6. タイマー更新関数
    function updateTimer() {
        const now = Date.now();
        let remainingTime = endTime - now;
        
        // 残り時間がなくなったらリダイレクト
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            window.location.href = REDIRECT_PAGE;
            return;
        }
        
        // 残り時間を時:分:秒に変換
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        
        // 表示を更新
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    // 7. 初回実行して1秒ごとに更新
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

// デバッグ用（コンソールにタイマー情報を表示）
function debugTimer() {
    const cookieValue = getCookie(COOKIE_NAME);
    if (cookieValue) {
        const firstAccess = parseInt(cookieValue);
        const endTime = firstAccess + TIMER_DURATION;
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        
        console.log('初回アクセス時間:', new Date(firstAccess).toLocaleString());
        console.log('終了時間:', new Date(endTime).toLocaleString());
        console.log('現在時間:', new Date(currentTime).toLocaleString());
        console.log('残り時間(ミリ秒):', remainingTime);
        console.log('残り時間(時:分:秒):', 
            Math.floor(remainingTime / (1000 * 60 * 60)) + '時間 ' +
            Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)) + '分 ' +
            Math.floor((remainingTime % (1000 * 60)) / 1000) + '秒'
        );
    } else {
        console.log('Cookie未設定');
    }
}

// ページ読み込み時に一度だけデバッグ情報を出力
document.addEventListener('DOMContentLoaded', function() {
    debugTimer();
    // タイマー機能の初期化
    initializeTimer();
});
