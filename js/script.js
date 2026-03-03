// --- DATA STATE ---
let skills = JSON.parse(localStorage.getItem('skills')) || [
    { id: 1, name: 'Laravel Refactoring', category: 'Logic', duration: 45 },
    { id: 2, name: 'English Listening A2', category: 'Language', duration: 25 },
    { id: 3, name: 'Boxing Training', category: 'Physical', duration: 15 }
];

let rewards = JSON.parse(localStorage.getItem('rewards')) || [
    { id: 1, name: '15m Jazz music' },
    { id: 2, name: 'A cup of milk coffee' }
];

let history = JSON.parse(localStorage.getItem('history')) || [];
let dailyGoal = parseInt(localStorage.getItem('dailyGoal')) || 4;
let streak = parseInt(localStorage.getItem('streak')) || 0;
let lastFinishedDate = localStorage.getItem('lastFinishedDate') || "";

let timerInterval = null;
let timeLeft = 0;
let currentActiveSkill = null;
let isActiveLocked = false;

const encouragements = [
    "Tuyệt vời! Bạn đang trở thành một phiên bản tốt hơn của chính mình.",
    "Giỏi lắm! Kỷ luật là chìa khóa thành công.",
    "1% tốt hơn mỗi ngày, bạn đang đi đúng hướng!",
    "Bộ não của bạn sẽ cảm ơn bạn vì phiên học tập tập trung này.",
    "Wow! Một thử thách khác đã được vượt qua. Hãy tiếp tục!",
    "Bạn làm rất tốt! Hãy tiếp tục với động lực này.",
    "Mỗi bước học tập nhỏ là bước tiến lớn.",
    "Bạn xứng đáng thành công vì sự nỗ lực này.",
    "Giữ tập trung, bạn đang gần hơn mục tiêu của mình.",
    "Học tập hôm nay là đầu tư cho tương lai của bạn.",
    "Bạn có khả năng làm được điều gì đó tuyệt vời.",
    "Hãy nhớ lý do bạn bắt đầu - bạn gần tới đó rồi!",
    "Sự kiên trì sẽ đem lại kết quả. Hãy tiếp tục!",
    "Bạn đang xây dựng thói quen tốt. Tuyệt vời!",
    "Mỗi phút học tập đều có giá trị lớn.",
    "Bạn mạnh mẽ hơn bạn tưởng. Hãy chứng minh điều đó!",
    "Thành công đến với những người không bỏ cuộc.",
    "Bạn đang trên con đường đúng. Hãy tiếp tục!",
    "Tập trung là phép thuật của những người thành công.",
    "Bạn xứng đáng có một phần thưởng tuyệt vời này!",
    "Hôm nay bạn đã làm tốt hơn hôm qua.",
    "Dự định của bạn là mục tiêu của bạn. Hãy hành động!",
    "Bạn có tất cả những gì cần thiết để thành công.",
    "Hãy tự hào vì sự cố gắng của bạn hôm nay.",
    "Chỉ cần tiếp tục, bạn sẽ đạt được điều tuyệt vời.",
    "Bạn là một học sinh đáng kinh ngạc!",
    "Mỗi ngày là cơ hội mới để trở nên tốt hơn.",
    "Không có gì không thể nếu bạn đủ quyết tâm.",
    "Bạn đã hoàn thành nhiệm vụ này với xuất sắc!",
    "Sự kiên nhẫn của bạn sẽ mang lại thành quả.",
    "Bạn đang tạo ra một phiên bản tốt nhất của chính mình.",
    "Hãy tiếp tục - bạn gần đến thành công rồi!",
    "Bạn xứng đáng được hạnh phúc vì sự cố gắng này.",
    "Mỗi ngày bạn học, bạn đều trở nên thông minh hơn.",
    "Bạn có sức mạnh để đạt được mọi mục tiêu.",
    "Hãy ghi nhớ: bạn là người duy nhất có thể ngăn cản mình.",
    "Bạn đã làm một điều tuyệt vời hôm nay!",
    "Sự nỗ lực của bạn sẽ được ghi nhận.",
    "Bạn đang xây dựng nền tảng cho một tương lai tuyệt vời.",
    "Tập trung của bạn là điểm mạnh lớn nhất!",
    "Bạn là một người bền bỉ - hãy tự hào!",
    "Mỗi bài học nhỏ là bước tiến lớn.",
    "Bạn đang biến mơ ước thành hiện thực!",
    "Hãy tiếp tục phát triển - bạn đang làm tuyệt vời!",
    "Bạn xứng đáng được thành công vì sự cam kết này.",
    "Hôm nay bạn đã chứng minh bạn có khả năng!",
    "Thành công không xa, chỉ cần tiếp tục cố gắng.",
    "Bạn là tác giả của câu chuyện thành công của chính mình.",
    "Mỗi phút bạn học là một phút được đầu tư cho tương lai.",
    "Bạn xứng đáng có tất cả những điều tốt đẹp nhất!",
    "Không bao giờ quên: bạn CÓ THỂ làm được!",
    "Bạn đang tạo ra những thay đổi tích cực trong cuộc sống.",
    "Sự kiên trì của bạn sẽ mang lại những kết quả lớn.",
    "Bạn là một anh hùng của chính mình!",
    "Hãy tiếp tục - những ngôi sao đang chờ bạn!",
    "Bạn đã vượt qua thách thức này một cách xuất sắc!",
    "Mỗi ngày bạn trở nên mạnh mẽ hơn.",
    "Bạn có toàn bộ potentials để thành công.",
    "Hãy nhớ: bạn được sinh ra để làm được điều gì đó tuyệt vời.",
    "Bạn đang xây dựng một quá khứ tuyệt vời cho tương lai!",
    "Sự nỗ lực hôm nay sẽ trở thành thành công ngày mai.",
    "Bạn xứng đáng có tất cả những gì bạn mong muốn.",
    "Bạn đang làm tốt lắm - hãy tiếp tục!",
    "Không có thứ gì gọi là thất bại, chỉ có bài học.",
    "Bạn đang chân chính tìm kiếm sự hoàn hảo.",
    "Mỗi bước đi trước là bước đi đúng hướng.",
    "Bạn là nguồn cảm hứng cho bản thân!",
    "Hãy tiếp tục - bạn đang gần đến đích!",
    "Bạn xứng đáng được hạnh phúc và thành công.",
    "Sự cam kết của bạn sẽ mang lại results tuyệt vời.",
    "Bạn có khả năng vượt qua bất kỳ thử thách nào.",
    "Hôm nay bạn đã tạo ra một sự khác biệt!",
    "Bạn là một người bất cứ - hãy tự hào!",
    "Mỗi ngày là một ngày mới để trở nên tuyệt vời.",
    "Bạn đang viết câu chuyện thành công của chính mình!",
    "Bạn xứng đáng có tất cả những giấc mơ của mình!",
    "Hãy tiếp tục - tương lai của bạn đang chờ!",
    "Sự kiên nhẫn sẽ mang lại những phần thưởng lớn.",
    "Bạn là một con người lừng danh!",
    "Mỗi phút tập trung của bạn đều có ý nghĩa.",
    "Bạn đang xây dựng một đời sống luar biệt!",
    "Bạn xứng đáng được công nhân vì sự nỗ lực này.",
    "Hãy nhớ: đó là cuộc hành trình, không phải điểm đến!",
    "Bạn có sức mạnh thần kỳ bên trong!",
    "Sự bền bỉ của bạn sẽ đưa bạn tới đỉnh cao!",
    "Bạn đang làm một công việc tuyệt vời!",
    "Mỗi bài học là một phần của hành trình của bạn.",
    "Bạn xứng đáng có một bộ óc sáng tạo và mạnh mẽ!",
    "Hãy tiếp tục phát triển - bạn đang trên đúng con đường!",
    "Bạn là một người chiến thắng - chứng minh điều đó!",
    "Sự nỗ lực của bạn hôm nay sẽ là thành công ngày mai!",
    "Bạn đang tạo ra một tương lai tuyệt vời!",
    "Mỗi thử thách là một cơ hội phát triển!",
    "Bạn xứng đáng được thành công vì bạn đã cố gắng!",
    "Hãy tự hào - bạn đang làm tuyệt vời!",
    "Bạn có toàn bộ năng lượng cần thiết để thành công!"
];


// --- CORE LOGIC ---
function saveData() {
    localStorage.setItem('skills', JSON.stringify(skills));
    localStorage.setItem('rewards', JSON.stringify(rewards));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('dailyGoal', dailyGoal);
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastFinishedDate', lastFinishedDate);
    updateStats();
}

async function callGemini(prompt, systemInstruction = "You are a minimalist study assistant. Respond very concisely in English.") {
    // Check if API key is set
    if (!CONFIG.GEMINI_API_KEY) {
        console.error('❌ API Key not configured! Please check Settings.');
        return "⚠️ API Key not set. Go to Settings to configure it.";
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
    try {
        // v1 API doesn't support systemInstruction field, so include it in the prompt
        const fullPrompt = `${systemInstruction}\n\n${prompt}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
            console.error('❌ Gemini API Error:', errorMsg);
            return `API Error: ${errorMsg}`;
        }

        const result = await response.json();
        if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.warn('⚠️ Unexpected API response format:', result);
            return "Unable to parse AI response.";
        }
        return result.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error('❌ Connection error:', e.message);
        return `Connection error: ${e.message}`;
    }
}

async function getAiMotivation() {
    const text = document.getElementById('motivationText');
    text.innerText = "Connecting to the stars... ✨";
    const prompt = `Write a very short motivational sentence in English (A2 level) for a student with a ${streak}-day streak.`;
    text.innerText = await callGemini(prompt);
}

async function breakDownSkill() {
    const area = document.getElementById('aiResponseArea');
    area.classList.remove('hidden');
    area.innerHTML = "<div class='ai-shimmer h-20 rounded-2xl'></div>";
    const prompt = `Break down the skill "${currentActiveSkill.name}" into 3 short bullet points to do in ${currentActiveSkill.duration} minutes. Respond in English.`;
    area.innerHTML = (await callGemini(prompt)).replace(/\n/g, '<br>');
}

async function generateEnglishPractice() {
    const area = document.getElementById('aiResponseArea');
    area.classList.remove('hidden');
    area.innerHTML = "<div class='ai-shimmer h-20 rounded-2xl'></div>";
    const prompt = `Create a very short English fill-in-the-blank exercise (A2 level) related to "${currentActiveSkill.name}". Include the answer below.`;
    area.innerHTML = (await callGemini(prompt)).replace(/\n/g, '<br>');
}

async function suggestAiReward() {
    showMessage("Finding ideas...");
    const res = await callGemini("Suggest one short, healthy reward after studying. Respond in English.");
    document.getElementById('rewardInput').value = res.replace(/^- |^\d\. /g, '').trim();
    showMessage("Try this reward!");
}

// --- UI ACTIONS ---
function switchTab(tab) {
    document.getElementById('view-dashboard').classList.toggle('hidden', tab !== 'dashboard');
    document.getElementById('view-settings').classList.toggle('hidden', tab !== 'settings');
    document.getElementById('tab-dashboard').classList.toggle('tab-active', tab === 'dashboard');
    document.getElementById('tab-settings').classList.toggle('tab-active', tab === 'settings');
}

function showMessage(text) {
    const box = document.getElementById('msgBox');
    document.getElementById('msgContent').innerText = text;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 3000);
}

function setDuration(mins, type) {
    document.getElementById('durationInput').value = mins;
    showMessage(`Selected ${mins}m (${type})`);
}

async function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input.value.trim();
    
    if (!key) {
        showMessage('❌ Please enter an API key');
        return;
    }
    
    if (key.length < 20) {
        showMessage('❌ API key seems too short');
        return;
    }
    
    try {
        // Save to localStorage and config
        setGeminiApiKey(key);
        input.value = ''; // Clear input for security
        
        // Update status
        updateApiStatus();
        showMessage('✅ API Key saved successfully!');
        console.log('✅ Gemini API Key configured');
    } catch (error) {
        console.error('❌ Error saving API key:', error);
        showMessage('❌ Error saving API key');
    }
}

function updateApiStatus() {
    const statusEl = document.getElementById('apiStatus');
    if (!statusEl) return;
    
    if (CONFIG.GEMINI_API_KEY) {
        const maskedKey = CONFIG.GEMINI_API_KEY.substring(0, 10) + '...' + CONFIG.GEMINI_API_KEY.substring(-4);
        statusEl.innerHTML = `<span class="text-green-600">✓ API Key configured: ${maskedKey}</span>`;
    } else {
        statusEl.innerHTML = `<span class="text-red-600">✗ API Key not configured. The app needs this to use AI features.</span>`;
    }
}

function toggleTimer() {
    const icon = document.getElementById('timerIcon');
    const finish = document.getElementById('finishBtn');
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    } else {
        finish.classList.remove('hidden');
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                document.getElementById('timerDisplay').classList.add('text-green-500');
                playBeep();
                showMessage("Time's up! Well done.");
            }
        }, 1000);
        icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    }
}

function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
}

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timerDisplay').innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function pickRandomSkill() {
    if (skills.length === 0) return switchTab('settings');
    if (isActiveLocked) return;
    
    currentActiveSkill = skills[Math.floor(Math.random() * skills.length)];
    timeLeft = currentActiveSkill.duration * 60;
    updateTimerDisplay();
    
    isActiveLocked = true;
    document.getElementById('skillBtn').disabled = true;
    document.getElementById('rewardBtn').disabled = true;
    document.getElementById('skillBtn').classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('rewardBtn').classList.add('opacity-50', 'cursor-not-allowed');
    
    document.getElementById('resultBox').classList.remove('hidden');
    document.getElementById('resultType').innerText = "Challenge";
    document.getElementById('resultValue').innerText = currentActiveSkill.name;
    document.getElementById('skillDurationInfo').innerText = `${currentActiveSkill.duration} mins • ${currentActiveSkill.category}`;
    document.getElementById('timerContainer').classList.remove('hidden');
    document.getElementById('aiResponseArea').classList.add('hidden');
    document.getElementById('btnPractice').classList.toggle('hidden', currentActiveSkill.category !== 'Language');
    document.getElementById('btnBreakdown').classList.remove('hidden');
    
    window.scrollTo({ top: document.getElementById('resultBox').offsetTop - 100, behavior: 'smooth' });
}

function pickRandomReward() {
    if (rewards.length === 0) return switchTab('settings');
    if (isActiveLocked) return;
    
    isActiveLocked = true;
    document.getElementById('skillBtn').disabled = true;
    document.getElementById('rewardBtn').disabled = true;
    document.getElementById('skillBtn').classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('rewardBtn').classList.add('opacity-50', 'cursor-not-allowed');
    
    _showRandomReward();
}

function _showRandomReward() {
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    document.getElementById('resultBox').classList.remove('hidden');
    document.getElementById('resultType').innerText = "Your Reward";
    document.getElementById('resultValue').innerText = reward.name;
    document.getElementById('timerContainer').classList.add('hidden');
    document.getElementById('skillDurationInfo').innerText = "";
    document.getElementById('aiResponseArea').classList.add('hidden');
    document.getElementById('btnBreakdown').classList.add('hidden');
}

function finishSkill() {
    const today = new Date().toLocaleDateString();
    if (lastFinishedDate !== today) {
        streak = (lastFinishedDate === new Date(Date.now() - 86400000).toLocaleDateString()) ? streak + 1 : 1;
        lastFinishedDate = today;
    }
    const randomEnc = encouragements[Math.floor(Math.random() * encouragements.length)];
    history.unshift({ name: currentActiveSkill.name, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), date: today, duration: currentActiveSkill.duration, msg: randomEnc });
    
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Unlock buttons
    isActiveLocked = false;
    document.getElementById('skillBtn').disabled = false;
    document.getElementById('rewardBtn').disabled = false;
    document.getElementById('skillBtn').classList.remove('opacity-50', 'cursor-not-allowed');
    document.getElementById('rewardBtn').classList.remove('opacity-50', 'cursor-not-allowed');
    
    saveData();
    
    // Show reward automatically
    _showRandomReward();
    showMessage("Well done! Here's your reward.");
}

// --- DATA MGMT ---
function addSkill() {
    const name = document.getElementById('skillInput').value.trim();
    if (!name) return;
    skills.push({ id: Date.now(), name, category: document.getElementById('categorySelect').value, duration: parseInt(document.getElementById('durationInput').value) || 45 });
    document.getElementById('skillInput').value = '';
    saveData(); renderAll();
}

function addReward() {
    const name = document.getElementById('rewardInput').value.trim();
    if (!name) return;
    rewards.push({ id: Date.now(), name });
    document.getElementById('rewardInput').value = '';
    saveData(); renderAll();
}

function updateDailyGoal(v) { dailyGoal = parseInt(v) || 4; saveData(); }
function clearHistory() { if(confirm("Clear history?")) { history = []; saveData(); renderAll(); } }
function deleteItem(type, id) { if (type === 'skill') skills = skills.filter(s => s.id !== id); else rewards = rewards.filter(r => r.id !== id); saveData(); renderAll(); }

function updateStats() {
    const today = new Date().toLocaleDateString();
    const todayLogs = history.filter(h => h.date === today);
    const totalMins = todayLogs.reduce((s, l) => s + (l.duration || 0), 0);
    
    document.getElementById('streakCount').innerText = streak;
    document.getElementById('todayTotal').innerText = totalMins;
    document.getElementById('goalText').innerText = `Goal: ${todayLogs.length}/${dailyGoal} sessions`;
    const p = Math.min((todayLogs.length / dailyGoal) * 100, 100);
    document.getElementById('goalProgress').style.width = p + "%";
    document.getElementById('goalPercent').innerText = Math.round(p) + "%";
    document.getElementById('skillCountBadge').innerText = skills.length;
}

function renderAll() {
    document.getElementById('skillList').innerHTML = skills.map(s => `
        <li class="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between group soft-shadow">
            <div>
                <p class="font-bold text-sm text-gray-800">${s.name}</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">${s.duration} MINS • ${s.category}</p>
            </div>
            <button onclick="deleteItem('skill', ${s.id})" class="text-gray-200 hover:text-red-400 transition">✕</button>
        </li>
    `).join('');

    document.getElementById('rewardList').innerHTML = rewards.map(r => `
        <li class="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between soft-shadow">
            <span class="text-sm font-medium text-gray-700">${r.name}</span>
            <button onclick="deleteItem('reward', ${r.id})" class="text-gray-200 hover:text-red-400 transition">✕</button>
        </li>
    `).join('');

    const hList = document.getElementById('historyList');
    const today = new Date().toLocaleDateString();
    const todayLogs = history.filter(h => h.date === today);
    
    hList.innerHTML = todayLogs.length ? todayLogs.map(h => `
        <div class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-50 soft-shadow">
            <div class="w-2 h-2 rounded-full bg-green-400"></div>
            <div class="flex-1">
                <div class="flex justify-between">
                    <p class="text-sm font-bold text-gray-800">${h.name}</p>
                    <span class="text-[10px] font-bold text-gray-400">${h.time}</span>
                </div>
                <p class="text-[10px] italic text-green-600 mt-1">${h.msg}</p>
            </div>
        </div>
    `).join('') : '<p class="text-center py-10 text-xs text-gray-300 font-medium">No activity today</p>';
    
    updateStats();
}

renderAll();

// Initialize API status display
updateApiStatus();
