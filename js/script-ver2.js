// --- DATA STATE (IndexedDB) ---
let skills = [];
let rewards = [];
let history = [];
let dailyGoal = 4;
let streak = 0;
let lastFinishedDate = "";

const DEFAULT_SKILLS = [
    { id: 1, name: 'Laravel Refactoring', category: 'Logic', duration: 45 },
    { id: 2, name: 'English Listening A2', category: 'Language', duration: 25 },
    { id: 3, name: 'Boxing Training', category: 'Physical', duration: 15 }
];

const DEFAULT_REWARDS = [
    { id: 1, name: '15m Jazz music' },
    { id: 2, name: 'A cup of milk coffee' }
];

let timerInterval = null;
let timeLeft = 0;
let currentActiveSkill = null;
let isActiveLocked = false;

// --- CONFETTI EFFECT ---
function triggerConfetti() {
    if (typeof confetti === 'undefined') return;
    
    // Multiple bursts for more dramatic effect
    const confettiConfig = {
        particleCount: 100,
        spread: 70,
        gravity: 0.5,
        decay: 0.94,
        scalar: 1.2
    };
    
    // Center burst
    confetti({
        ...confettiConfig,
        origin: { x: 0.5, y: 0.5 }
    });
    
    // Left burst
    setTimeout(() => {
        confetti({
            ...confettiConfig,
            origin: { x: 0.2, y: 0.3 },
            angle: 60
        });
    }, 100);
    
    // Right burst
    setTimeout(() => {
        confetti({
            ...confettiConfig,
            origin: { x: 0.8, y: 0.3 },
            angle: 120
        });
    }, 200);
}

// --- UI & INTERACTION ---
function switchTab(tab) {
    document.getElementById('view-dashboard').classList.toggle('hidden', tab !== 'dashboard');
    document.getElementById('view-settings').classList.toggle('hidden', tab !== 'settings');
    document.getElementById('tab-dashboard').classList.toggle('tab-active', tab === 'dashboard');
    document.getElementById('tab-dashboard').classList.toggle('tab-inactive', tab !== 'dashboard');
    document.getElementById('tab-settings').classList.toggle('tab-active', tab === 'settings');
    document.getElementById('tab-settings').classList.toggle('tab-inactive', tab !== 'settings');
}

function showMessage(msg) {
    const box = document.getElementById('msgBox');
    document.getElementById('msgContent').innerText = msg;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 3000);
}

function setDuration(mins, type) {
    document.getElementById('durationInput').value = mins;
    showMessage(`Selected ${mins}m (${type})`);
}

function toggleTimer() {
    const icon = document.getElementById('timerBtn');
    const finish = document.getElementById('finishBtn');
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        icon.innerText = '▶';
    } else {
        finish.classList.remove('hidden');
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                document.getElementById('timerDisplay').classList.add('neon-yellow');
                playBeep();
                showMessage("⏰ Time's up! Well done.");
            }
        }, 1000);
        icon.innerText = '⏸';
    }
}

function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
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
    
    // Close reward modal if open
    document.getElementById('rewardModal').classList.add('hidden');
    
    currentActiveSkill = skills[Math.floor(Math.random() * skills.length)];
    timeLeft = currentActiveSkill.duration * 60;
    updateTimerDisplay();
    
    isActiveLocked = true;
    document.getElementById('skillBtn').disabled = true;
    document.getElementById('skillBtn').classList.add('opacity-50', 'cursor-not-allowed');
    
    document.getElementById('resultBox').classList.remove('hidden');
    
    // Reset reward display if it was showing
    document.getElementById('aiAssistantBox').classList.add('hidden');
    document.getElementById('treasureChestBox').classList.add('hidden');
    
    document.getElementById('resultType').innerText = "▶ MISSION SELECTED";
    document.getElementById('resultValue').innerText = currentActiveSkill.name;
    document.getElementById('skillDurationInfo').innerText = `${currentActiveSkill.duration} MINS • ${currentActiveSkill.category}`;
    document.getElementById('timerContainer').classList.remove('hidden');
    
    // Make sure timer elements are visible
    document.getElementById('timerDisplay').classList.remove('hidden');
    document.getElementById('timerControls').classList.remove('hidden');
    document.getElementById('timerBtn').classList.remove('hidden');
    document.getElementById('finishBtn').classList.add('hidden');
    
    window.scrollTo({ top: document.getElementById('resultBox').offsetTop - 100, behavior: 'smooth' });
}

async function finishSkill() {
    const today = new Date().toLocaleDateString();
    if (lastFinishedDate !== today) {
        streak = (lastFinishedDate === new Date(Date.now() - 86400000).toLocaleDateString()) ? streak + 1 : 1;
        lastFinishedDate = today;
    }
    
    history.unshift({ 
        name: currentActiveSkill.name, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        date: today, 
        duration: currentActiveSkill.duration
    });
    
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Hide timer/controls elements
    document.getElementById('timerDisplay').classList.add('hidden');
    document.getElementById('timerControls').classList.add('hidden');
    document.getElementById('timerBtn').classList.add('hidden');
    document.getElementById('finishBtn').classList.add('hidden');
    
    // Show treasure chest
    document.getElementById('treasureChestBox').classList.remove('hidden');
    
    await saveData();
    showMessage("🎮 SESSION COMPLETE! Open the treasure chest!");
}

// --- TREASURE CHEST MECHANIC (Ver2) ---
async function openTreasureChest() {
    if (rewards.length === 0) return switchTab('settings');
    
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    // Animate chest opening
    const btn = document.getElementById('treasureChestBtn');
    btn.classList.add('blink');
    
    // Show reward modal after animation
    setTimeout(() => {
        document.getElementById('rewardModalReward').innerText = reward.name;
        document.getElementById('rewardModal').classList.remove('hidden');
        
        // Trigger confetti effect multiple times for more dramatic effect
        triggerConfetti();
        setTimeout(() => triggerConfetti(), 200);
        setTimeout(() => triggerConfetti(), 400);
        
        // Enable PICK A SKILL button to start new session
        isActiveLocked = false;
        document.getElementById('skillBtn').disabled = false;
        document.getElementById('skillBtn').classList.remove('opacity-50', 'cursor-not-allowed');
        
        btn.classList.remove('blink');
    }, 800);
}

function closeRewardModal() {
    // Hide modal
    document.getElementById('rewardModal').classList.add('hidden');
    
    // Hide treasure chest and result box
    document.getElementById('treasureChestBox').classList.add('hidden');
    document.getElementById('aiAssistantBox').classList.add('hidden');
    document.getElementById('resultBox').classList.add('hidden');
    document.getElementById('timerContainer').classList.add('hidden');
    
    // Show timer elements again for potential next session
    document.getElementById('timerDisplay').classList.remove('hidden');
    document.getElementById('timerControls').classList.remove('hidden');
    document.getElementById('timerDisplay').classList.remove('neon-yellow');
    
    renderAll();
}

// --- DATA MGMT ---
async function addSkill() {
    const name = document.getElementById('skillInput').value.trim();
    if (!name) return;
    skills.push({ 
        id: Date.now(), 
        name, 
        category: document.getElementById('categorySelect').value, 
        duration: parseInt(document.getElementById('durationInput').value) || 45 
    });
    document.getElementById('skillInput').value = '';
    await saveData(); 
    renderAll();
}

async function addReward() {
    const name = document.getElementById('rewardInput').value.trim();
    if (!name) return;
    rewards.push({ id: Date.now(), name });
    document.getElementById('rewardInput').value = '';
    await saveData(); 
    renderAll();
}

async function updateDailyGoal(v) { 
    dailyGoal = parseInt(v) || 4; 
    await saveData(); 
}

async function clearHistory() { 
    if(confirm("Clear history?")) { 
        history = []; 
        await saveData(); 
        renderAll(); 
    } 
}

async function deleteItem(type, id) { 
    if (type === 'skill') skills = skills.filter(s => s.id !== id); 
    else rewards = rewards.filter(r => r.id !== id); 
    await saveData(); 
    renderAll(); 
}

function updateStats() {
    const today = new Date().toLocaleDateString();
    const todayLogs = history.filter(h => h.date === today);
    const totalMins = todayLogs.reduce((s, l) => s + (l.duration || 0), 0);
    
    document.getElementById('streakCount').innerText = streak;
    document.getElementById('todayTotal').innerText = totalMins;
    document.getElementById('goalText').innerText = `📊 DAILY QUEST: ${todayLogs.length}/${dailyGoal}`;
    const p = Math.min((todayLogs.length / dailyGoal) * 100, 100);
    document.getElementById('goalProgress').style.width = p + "%";
    document.getElementById('goalPercent').innerText = Math.round(p) + "%";
    document.getElementById('skillCountBadge').innerText = skills.length;
}

function renderAll() {
    // Render skills
    document.getElementById('skillList').innerHTML = skills.map(s => `
        <li class="arcade-chip py-4 px-6 rounded-lg border-2 gap-4 flex items-center justify-between">
            <div>
                <p class="neon-lime font-black text-sm">${s.name}</p>
                <p class="neon-cyan text-[10px] font-bold uppercase tracking-wider mt-1">${s.duration} MINS • ${s.category}</p>
            </div>
            <button onclick="deleteItem('skill', ${s.id})" class="text-red-400 hover:text-red-500 font-black text-lg transition">✕</button>
        </li>
    `).join('');

    // Render rewards
    document.getElementById('rewardList').innerHTML = rewards.map(r => `
        <li class="arcade-chip py-4 px-6 rounded-lg border-2 gap-4 flex items-center justify-between">
            <span class="neon-lime font-black text-sm">${r.name}</span>
            <button onclick="deleteItem('reward', ${r.id})" class="text-red-400 hover:text-red-500 font-black text-lg transition">✕</button>
        </li>
    `).join('');

    // Render history
    const hList = document.getElementById('historyList');
    const today = new Date().toLocaleDateString();
    const todayLogs = history.filter(h => h.date === today);
    
    hList.innerHTML = todayLogs.length ? todayLogs.map(h => `
        <div class="history-item rounded-lg">
            <div class="flex items-center justify-between mb-2">
                <p class="neon-lime font-black text-sm">${h.name}</p>
                <span class="neon-cyan text-[10px] font-bold">${h.time}</span>
            </div>
        </div>
    `).join('') : '<p class="text-center py-10 neon-cyan text-xs font-bold">NO ACTIVITY TODAY - PICK A SKILL!</p>';
    
    updateStats();
}

// --- DATA PERSISTENCE (IndexedDB) ---
async function saveData() {
    try {
        await dbManager.saveData('skills', skills);
        await dbManager.saveData('rewards', rewards);
        await dbManager.saveData('history', history);
        await dbManager.saveData('dailyGoal', dailyGoal);
        await dbManager.saveData('streak', streak);
        await dbManager.saveData('lastFinishedDate', lastFinishedDate);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function initializeApp() {
    try {
        // Initialize IndexedDB
        await dbManager.init();

        // Load data
        const savedSkills = await dbManager.getData('skills');
        const savedRewards = await dbManager.getData('rewards');
        const savedHistory = await dbManager.getData('history');
        const savedDailyGoal = await dbManager.getData('dailyGoal');
        const savedStreak = await dbManager.getData('streak');
        const savedLastDate = await dbManager.getData('lastFinishedDate');

        // Assign data
        skills = savedSkills || DEFAULT_SKILLS;
        rewards = savedRewards || DEFAULT_REWARDS;
        history = savedHistory || [];
        dailyGoal = savedDailyGoal || 4;
        streak = savedStreak || 0;
        lastFinishedDate = savedLastDate || "";

        document.getElementById('goalInput').value = dailyGoal;
        renderAll();
    } catch (error) {
        console.error('Error initializing app:', error);
        skills = DEFAULT_SKILLS;
        rewards = DEFAULT_REWARDS;
        history = [];
        renderAll();
    }
}

// --- EXPORT / IMPORT ---
async function exportData() {
    try {
        await dbManager.exportToJSON();
        showMessage("✓ Data exported successfully!");
    } catch (error) {
        showMessage("✗ Export error: " + error.message);
    }
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        if (e.target.files.length === 0) return;
        try {
            await dbManager.importFromJSON(e.target.files[0]);
            showMessage("✓ Data imported! Reloading...");
            setTimeout(() => location.reload(), 1500);
        } catch (error) {
            showMessage("✗ Import error: " + error.message);
        }
    };
    input.click();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeApp);
