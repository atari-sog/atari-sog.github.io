document.addEventListener('DOMContentLoaded', function() {
    // フォームの参照
    const timerForm = document.getElementById('timerForm');
    const resetBtn = document.getElementById('resetBtn');
    const outputSection = document.getElementById('outputSection');
    const debugSection = document.getElementById('debugSection');
    
    // 出力要素の参照
    const htmlOutput = document.getElementById('htmlOutput');
    const jsOutput = document.getElementById('jsOutput');
    const debugOutput = document.getElementById('debugOutput');
    const cssOutput = document.getElementById('cssOutput');
    const previewFrame = document.getElementById('previewFrame');
    
    // HTMLテンプレート
    const htmlTemplate = `<!-- 固定タイマーバナー -->
<div class="timer-banner" id="{{TIMER_BANNER_ID}}">
    <div class="container">
        <div class="timer-content">
            <div class="timer-text">
                <p><strong>{{BANNER_TEXT}}</strong></p>
            </div>
            <div class="timer" id="countdown">
                <div class="timer-block">
                    <span id="{{HOURS_ELEMENT_ID}}">00</span>
                    <span class="timer-label">時間</span>
                </div>
                <div class="timer-divider">:</div>
                <div class="timer-block">
                    <span id="{{MINUTES_ELEMENT_ID}}">00</span>
                    <span class="timer-label">分</span>
                </div>
                <div class="timer-divider">:</div>
                <div class="timer-block">
                    <span id="{{SECONDS_ELEMENT_ID}}">00</span>
                    <span class="timer-label">秒</span>
                </div>
            </div>
            <div class="timer-cta">
                <a href="#" class="timer-button">{{CTA_BUTTON_TEXT}}</a>
            </div>
        </div>
    </div>
</div>`;

    // JSテンプレート
    const jsTemplate = `// ======== タイマー機能 ========

// タイマー機能の設定
const TIMER_DURATION = {{TIMER_DURATION}}; // {{TIMER_DURATION_COMMENT}}
const COOKIE_NAME = '{{COOKIE_NAME}}';
const COOKIE_DURATION = {{COOKIE_DURATION}}; // Cookie保持日数
const REDIRECT_PAGE = '{{REDIRECT_PAGE}}';

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
    const timerBanner = document.getElementById('{{TIMER_BANNER_ID}}');
    if (!timerBanner) return;
    
    const hoursElement = document.getElementById('{{HOURS_ELEMENT_ID}}');
    const minutesElement = document.getElementById('{{MINUTES_ELEMENT_ID}}');
    const secondsElement = document.getElementById('{{SECONDS_ELEMENT_ID}}');
    
    // 3. 初回アクセス時間をCookieから取得、なければ現在時刻を設定
    let firstAccess = getCookie(COOKIE_NAME);
    let endTime;
    
    if (!firstAccess) {
        firstAccess = Date.now();
        setCookie(COOKIE_NAME, firstAccess.toString(), COOKIE_DURATION);
    } else {
        firstAccess = parseInt(firstAccess); // 数値に変換
    }
    
    // 4. 終了時刻を計算（初回アクセスからTIMER_DURATION後）
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

// ページ読み込み時にタイマーを初期化
document.addEventListener('DOMContentLoaded', function() {
    // タイマー機能を初期化
    initializeTimer();
});`;

    // デバッグテンプレート
    const debugTemplate = `// タイマーのデバッグ機能
// 本番環境では読み込まないことを想定

// タイマー設定（timer.jsと同じ値にすること）
const DEBUG_TIMER_DURATION = {{TIMER_DURATION}}; // {{TIMER_DURATION_COMMENT}}
const DEBUG_COOKIE_NAME = '{{COOKIE_NAME}}';

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
    console.log(\`Cookieを削除しました: \${name}\`);
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
        
        html += \`<div style="margin-bottom: 8px;"><span style="color: #aaa;">Cookie:</span> \${DEBUG_COOKIE_NAME}</div>\`;
        html += \`<div style="margin-bottom: 8px;"><span style="color: #aaa;">初回アクセス:</span> \${firstAccessDate.toLocaleString()}</div>\`;
        html += \`<div style="margin-bottom: 8px;"><span style="color: #aaa;">終了時間:</span> \${endTimeDate.toLocaleString()}</div>\`;
        html += \`<div style="margin-bottom: 8px;"><span style="color: #aaa;">現在時間:</span> \${currentDate.toLocaleString()}</div>\`;
        html += \`<div style="margin-bottom: 8px;"><span style="color: #aaa;">残り時間:</span> \${info.formattedTime.hours}時間 \${info.formattedTime.minutes}分 \${info.formattedTime.seconds}秒</div>\`;
        
        // タイマー有効期限の状態
        if (info.remainingTime <= 0) {
            html += \`<div style="color: #ff3b30; font-weight: bold; margin-top: 10px;">タイマー期限切れ</div>\`;
        } else {
            html += \`<div style="color: #4cd964; font-weight: bold; margin-top: 10px;">タイマー有効中</div>\`;
        }
    } else {
        html += \`<div style="color: #ff9500;">Cookie未設定</div>\`;
        html += \`<div style="margin-top: 10px;">ページを再読み込みするとCookieが設定されます。</div>\`;
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
});`;

    // CSSテンプレート
    const cssTemplateBase = `/* タイマーバナー */
.timer-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    {{BANNER_STYLES}}
    padding: 15px 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
}

.timer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.timer-text {
    flex: 1;
    font-size: 1.1rem;
    text-align: left;
}

.timer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 20px;
}

.timer-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    {{TIMER_BLOCK_STYLES}}
    padding: 8px 12px;
    border-radius: 6px;
    min-width: 60px;
}

.timer-block span:first-child {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1;
}

.timer-label {
    font-size: 0.7rem;
    margin-top: 4px;
}

.timer-divider {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 8px;
}

.timer-cta {
    flex: 0 0 auto;
}

.timer-button {
    display: inline-block;
    {{CTA_BUTTON_STYLES}}
    font-size: 1rem;
    font-weight: 700;
    padding: 10px 24px;
    border-radius: 50px;
    transition: transform 0.3s, box-shadow 0.3s;
    {{CTA_BUTTON_SHADOW}}
}

.timer-button:hover {
    transform: translateY(-2px);
    {{CTA_BUTTON_HOVER_SHADOW}}
}

/* タイマーバナーのモバイル対応 */
@media (max-width: 768px) {
    .timer-content {
        flex-direction: column;
        text-align: center;
    }
    
    .timer-text {
        margin-bottom: 10px;
        text-align: center;
    }
    
    .timer {
        margin: 10px 0;
    }
    
    .timer-block {
        min-width: 50px;
        padding: 6px 10px;
    }
    
    .timer-cta {
        margin-top: 10px;
    }
}

@media (max-width: 480px) {
    .timer-block span:first-child {
        font-size: 1.2rem;
    }
    
    .timer-divider {
        font-size: 1.2rem;
        margin: 0 4px;
    }
    
    .timer-block {
        min-width: 40px;
        padding: 4px 8px;
    }
    
    .timer-button {
        font-size: 0.9rem;
        padding: 8px 16px;
    }
}`;
    
    // カラーバリエーション定義
    const colorVariations = {
        blue: {
            bannerStyles: 'background: linear-gradient(135deg, #0a51cc 0%, #0a84ff 100%);\n    color: white;',
            timerBlockStyles: 'background-color: rgba(255, 255, 255, 0.15);',
            ctaButtonStyles: 'background: linear-gradient(135deg, #ff3b30 0%, #ff9500 100%);\n    color: white;',
            ctaButtonShadow: 'box-shadow: 0 4px 10px rgba(255, 59, 48, 0.2);',
            ctaButtonHoverShadow: 'box-shadow: 0 6px 15px rgba(255, 59, 48, 0.3);'
        },
        white: {
            bannerStyles: 'background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);\n    color: #333;\n    border-top: 1px solid #e1e4e8;',
            timerBlockStyles: 'background-color: rgba(10, 132, 255, 0.1);\n    color: #0a84ff;',
            ctaButtonStyles: 'background: linear-gradient(135deg, #0a51cc 0%, #0a84ff 100%);\n    color: white;',
            ctaButtonShadow: 'box-shadow: 0 4px 10px rgba(10, 84, 255, 0.2);',
            ctaButtonHoverShadow: 'box-shadow: 0 6px 15px rgba(10, 84, 255, 0.3);'
        },
        orange: {
            bannerStyles: 'background: linear-gradient(135deg, #ff6b35 0%, #ff9500 100%);\n    color: white;',
            timerBlockStyles: 'background-color: rgba(255, 255, 255, 0.2);',
            ctaButtonStyles: 'background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);\n    color: #ff6b35;\n    border: 2px solid rgba(255, 255, 255, 0.3);',
            ctaButtonShadow: 'box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);',
            ctaButtonHoverShadow: 'box-shadow: 0 6px 15px rgba(255, 255, 255, 0.3);'
        },
        black: {
            bannerStyles: 'background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);\n    color: white;',
            timerBlockStyles: 'background-color: rgba(255, 255, 255, 0.1);',
            ctaButtonStyles: 'background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);\n    color: #333;',
            ctaButtonShadow: 'box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);',
            ctaButtonHoverShadow: 'box-shadow: 0 6px 15px rgba(255, 255, 255, 0.3);'
        }
    };
    
    // フォームの送信イベント
    timerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // タイマー設定値を取得
        const timerHours = parseInt(document.getElementById('timerHours').value) || 0;
        const timerMinutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const timerSeconds = parseInt(document.getElementById('timerSeconds').value) || 0;
        
        // 総時間をミリ秒に変換
        const totalMilliseconds = (timerHours * 60 * 60 * 1000) + (timerMinutes * 60 * 1000) + (timerSeconds * 1000);
        
        // 時間の説明文を作成
        let durationComment;
        if (timerHours > 0) {
            durationComment = `${timerHours}時間`;
            if (timerMinutes > 0) durationComment += `${timerMinutes}分`;
            if (timerSeconds > 0) durationComment += `${timerSeconds}秒`;
            durationComment += '（ミリ秒）';
        } else if (timerMinutes > 0) {
            durationComment = `${timerMinutes}分`;
            if (timerSeconds > 0) durationComment += `${timerSeconds}秒`;
            durationComment += '（ミリ秒）';
        } else {
            durationComment = `${timerSeconds}秒（ミリ秒）`;
        }
        
        // 他の設定値を取得
        const bannerText = document.getElementById('bannerText').value;
        const ctaButtonText = document.getElementById('ctaButtonText').value;
        const colorTheme = document.querySelector('input[name="colorTheme"]:checked').value;
        const cookieName = document.getElementById('cookieName').value;
        const cookieDuration = parseInt(document.getElementById('cookieDuration').value) || 90;
        const redirectPage = document.getElementById('redirectPage').value;
        const timerBannerId = document.getElementById('timerBannerId').value;
        const hoursElementId = document.getElementById('hoursElementId').value;
        const minutesElementId = document.getElementById('minutesElementId').value;
        const secondsElementId = document.getElementById('secondsElementId').value;
        const includeDebug = document.getElementById('includeDebug').checked;
        
        // HTMLを生成
        const generatedHtml = htmlTemplate
            .replace(/{{BANNER_TEXT}}/g, bannerText)
            .replace(/{{CTA_BUTTON_TEXT}}/g, ctaButtonText)
            .replace(/{{TIMER_BANNER_ID}}/g, timerBannerId)
            .replace(/{{HOURS_ELEMENT_ID}}/g, hoursElementId)
            .replace(/{{MINUTES_ELEMENT_ID}}/g, minutesElementId)
            .replace(/{{SECONDS_ELEMENT_ID}}/g, secondsElementId);
        
        // JSを生成
        const generatedJs = jsTemplate
            .replace(/{{TIMER_DURATION}}/g, totalMilliseconds)
            .replace(/{{TIMER_DURATION_COMMENT}}/g, durationComment)
            .replace(/{{COOKIE_NAME}}/g, cookieName)
            .replace(/{{COOKIE_DURATION}}/g, cookieDuration)
            .replace(/{{REDIRECT_PAGE}}/g, redirectPage)
            .replace(/{{TIMER_BANNER_ID}}/g, timerBannerId)
            .replace(/{{HOURS_ELEMENT_ID}}/g, hoursElementId)
            .replace(/{{MINUTES_ELEMENT_ID}}/g, minutesElementId)
            .replace(/{{SECONDS_ELEMENT_ID}}/g, secondsElementId);
        
        // デバッグJSを生成
        const generatedDebugJs = debugTemplate
            .replace(/{{TIMER_DURATION}}/g, totalMilliseconds)
            .replace(/{{TIMER_DURATION_COMMENT}}/g, durationComment)
            .replace(/{{COOKIE_NAME}}/g, cookieName);
        
        // 選択されたカラーバリエーションを取得
        const selectedColorVariation = colorVariations[colorTheme];
        
        // CSSを生成（カラーバリエーションを適用）
        const generatedCss = cssTemplateBase
            .replace(/{{BANNER_STYLES}}/g, selectedColorVariation.bannerStyles)
            .replace(/{{TIMER_BLOCK_STYLES}}/g, selectedColorVariation.timerBlockStyles)
            .replace(/{{CTA_BUTTON_STYLES}}/g, selectedColorVariation.ctaButtonStyles)
            .replace(/{{CTA_BUTTON_SHADOW}}/g, selectedColorVariation.ctaButtonShadow)
            .replace(/{{CTA_BUTTON_HOVER_SHADOW}}/g, selectedColorVariation.ctaButtonHoverShadow);
        
        // 出力を設定
        htmlOutput.textContent = generatedHtml;
        jsOutput.textContent = generatedJs;
        debugOutput.textContent = generatedDebugJs;
        cssOutput.textContent = generatedCss;
        
        // デバッグセクションの表示/非表示
        debugSection.style.display = includeDebug ? 'block' : 'none';
        
        // プレビューを生成
        generatePreview(generatedHtml, generatedJs, generatedCss, includeDebug ? generatedDebugJs : null);
        
        // 出力セクションを表示
        outputSection.style.display = 'block';
        
        // 出力セクションまでスクロール
        outputSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // リセットボタンのクリックイベント
    resetBtn.addEventListener('click', function() {
        timerForm.reset();
        outputSection.style.display = 'none';
    });
    
    // コピーボタンのイベント
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            // ターゲットの要素を取得
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            // テキストをクリップボードにコピー
            navigator.clipboard.writeText(targetElement.textContent)
                .then(() => {
                    // コピー成功
                    const originalText = this.textContent;
                    this.textContent = 'コピー完了！';
                    
                    // 2秒後に元のテキストに戻す
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('クリップボードへのコピーに失敗しました:', err);
                    alert('コピーに失敗しました。手動でコピーしてください。');
                });
        });
    });
    
    // プレビューを生成する関数
    function generatePreview(html, js, css, debugJs) {
        // プレビューHTMLの構造
        const previewHtml = `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>タイマープレビュー</title>
                <style>
                    body {
                        font-family: 'Noto Sans JP', sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 20px;
                    }
                    .preview-note {
                        background-color: #f8f9fa;
                        padding: 10px;
                        border-radius: 5px;
                        font-size: 0.9rem;
                        margin-bottom: 10px;
                    }
                    ${css}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="preview-note">
                        <p>※これはプレビューです。実際の動作はページに組み込んだ後に確認してください。</p>
                    </div>
                </div>
                ${html}
                <script>
                    ${js}
                </script>
                ${debugJs ? `<script>${debugJs}</script>` : ''}
            </body>
            </html>
        `;
        
        // プレビューフレームに挿入
        previewFrame.innerHTML = previewHtml;
    }
});