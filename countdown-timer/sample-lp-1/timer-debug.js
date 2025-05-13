// タイマーのデバッグ機能
// 本番環境では読み込まないことを想定

// タイマー設定（timer.jsと同じ値にすること）
const DEBUG_TIMER_DURATION = 24 * 60 * 60 * 1000; // 24時間（ミリ秒）
const DEBUG_COOKIE_NAME = 'first_access_time';

// Cookie取得関数
function getDebugCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Cookie削除関数
function deleteDebugCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log(`Cookieを削除しました: ${name}`);
    updateDebugInfo();
}

// デバッグ情報をコンソールに表示
function displayDebugInfo() {
    const cookieValue = getDebugCookie(DEBUG_COOKIE_NAME);
    if (cookieValue) {
        const firstAccess = parseInt(cookieValue);
        const endTime = firstAccess + DEBUG_TIMER_DURATION;
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        
        console.log('【タイマーデバッグ情報】');
        console.log('初回アクセス時間:', new Date(firstAccess).toLocaleString());
        console.log('終了時間:', new Date(endTime).toLocaleString());
        console.log('現在時間:', new Date(currentTime).toLocaleString());
        console.log('残り時間(ミリ秒):', remainingTime);
        console.log('残り時間(時:分:秒):', 
            Math.floor(remainingTime / (1000 * 60 * 60)) + '時間 ' +
            Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)) + '分 ' +
            Math.floor((remainingTime % (1000 * 60)) / 1000) + '秒'
        );
        
        return {
            firstAccess,
            endTime,
            currentTime,
            remainingTime,
            formattedTime: {
                hours: Math.floor(remainingTime / (1000 * 60 * 60)),
                minutes: Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((remainingTime % (1000 * 60)) / 1000)
            }
        };
    } else {
        console.log('Cookie未設定');
        return null;
    }
}

// ページに表示するデバッグパネルの作成
function createDebugPanel() {
    // 既存のパネルがあれば削除
    const existingPanel = document.getElementById('timer-debug-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // デバッグパネルのコンテナを作成
    const panel = document.createElement('div');
    panel.id = 'timer-debug-panel';
    panel.style.position = 'fixed';
    panel.style.bottom = '100px';
    panel.style.right = '20px';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    panel.style.color = 'white';
    panel.style.padding = '15px';
    panel.style.borderRadius = '8px';
    panel.style.fontSize = '12px';
    panel.style.fontFamily = 'monospace';
    panel.style.zIndex = '9999';
    panel.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    panel.style.backdropFilter = 'blur(5px)';
    panel.style.maxWidth = '300px';

    // タイトル
    const title = document.createElement('h3');
    title.textContent = 'タイマーデバッグパネル';
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '14px';
    title.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
    title.style.paddingBottom = '5px';
    panel.appendChild(title);

    // 内容を追加
    const content = document.createElement('div');
    content.id = 'debug-panel-content';
    panel.appendChild(content);

    // ボタンコンテナ
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '10px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    panel.appendChild(buttonContainer);

    // リセットボタン
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Cookieリセット';
    resetButton.style.padding = '5px 10px';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '4px';
    resetButton.style.backgroundColor = '#ff3b30';
    resetButton.style.color = 'white';
    resetButton.style.cursor = 'pointer';
    resetButton.onclick = () => deleteDebugCookie(DEBUG_COOKIE_NAME);
    buttonContainer.appendChild(resetButton);

    // 更新ボタン
    const updateButton = document.createElement('button');
    updateButton.textContent = '情報更新';
    updateButton.style.padding = '5px 10px';
    updateButton.style.border = 'none';
    updateButton.style.borderRadius = '4px';
    updateButton.style.backgroundColor = '#0a84ff';
    updateButton.style.color = 'white';
    updateButton.style.cursor = 'pointer';
    updateButton.onclick = updateDebugInfo;
    buttonContainer.appendChild(updateButton);

    // ページに追加
    document.body.appendChild(panel);
    
    // 情報を更新
    updateDebugInfo();
}

// デバッグパネルの情報を更新
function updateDebugInfo() {
    const contentElement = document.getElementById('debug-panel-content');
    if (!contentElement) return;
    
    const info = displayDebugInfo();
    let html = '';
    
    if (info) {
        const firstAccessDate = new Date(info.firstAccess);
        const endTimeDate = new Date(info.endTime);
        const currentDate = new Date(info.currentTime);
        
        html += `<div style="margin-bottom: 8px;"><span style="color: #aaa;">Cookie:</span> ${DEBUG_COOKIE_NAME}</div>`;
        html += `<div style="margin-bottom: 8px;"><span style="color: #aaa;">初回アクセス:</span> ${firstAccessDate.toLocaleString()}</div>`;
        html += `<div style="margin-bottom: 8px;"><span style="color: #aaa;">終了時間:</span> ${endTimeDate.toLocaleString()}</div>`;
        html += `<div style="margin-bottom: 8px;"><span style="color: #aaa;">現在時間:</span> ${currentDate.toLocaleString()}</div>`;
        html += `<div style="margin-bottom: 8px;"><span style="color: #aaa;">残り時間:</span> ${info.formattedTime.hours}時間 ${info.formattedTime.minutes}分 ${info.formattedTime.seconds}秒</div>`;
        
        // タイマー有効期限の状態
        if (info.remainingTime <= 0) {
            html += `<div style="color: #ff3b30; font-weight: bold; margin-top: 10px;">タイマー期限切れ</div>`;
        } else {
            html += `<div style="color: #4cd964; font-weight: bold; margin-top: 10px;">タイマー有効中</div>`;
        }
    } else {
        html += `<div style="color: #ff9500;">Cookie未設定</div>`;
        html += `<div style="margin-top: 10px;">ページを再読み込みするとCookieが設定されます。</div>`;
    }
    
    contentElement.innerHTML = html;
}

// 1秒ごとにデバッグ情報を更新
function startDebugUpdater() {
    // 最初に表示
    updateDebugInfo();
    
    // 1秒ごとに更新
    setInterval(updateDebugInfo, 1000);
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // デバッグパネルを作成
    createDebugPanel();
    
    // 自動更新を開始
    startDebugUpdater();
    
    // コンソールにも表示
    displayDebugInfo();
});
