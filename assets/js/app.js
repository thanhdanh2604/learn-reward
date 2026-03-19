// --- API CALLS ---
const API = {
    getData: async () => {
        try {
            const response = await fetch('api/getData.php');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error('getData error:', e);
            throw e;
        }
    },
    addSkill: async (name, category, duration) => {
        try {
            const response = await fetch('api/addSkill.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, duration })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error('addSkill error:', e);
            throw e;
        }
    },
    deleteSkill: async (id) => {
        try {
            const response = await fetch('api/deleteSkill.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error('deleteSkill error:', e);
            throw e;
        }
    },
    addReward: async (name) => {
        try {
            const response = await fetch('api/addReward.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error('addReward error:', e);
            throw e;
        }
    },
    deleteReward: async (id) => {
        try {
            const response = await fetch('api/deleteReward.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error('deleteReward error:', e);
            throw e;
        }
    },
    finishSession: async (skillName, duration, category) => {
        try {
            const response = await fetch('api/finishSession.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillName, duration, category })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error('finishSession error:', e);
            throw e;
        }
    },
    clearHistory: async () => {
        try {
            const response = await fetch('api/clearHistory.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error('clearHistory error:', e);
            throw e;
        }
    },
    updateSettings: async (settings) => {
        try {
            const response = await fetch('api/updateSettings.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            console.error('updateSettings error:', e);
            throw e;
        }
    }
};

// --- DATA STATE ---
let skills = [];
let rewards = [];
let history = [];
let settings = {
    dailyGoal: 4,
    currentInterface: 'minimalist',
    streak: 0,
    lastFinishedDate: ''
};

let timerInterval = null;
let timeLeft = 0;
let currentActiveSkill = null;
let isActiveLocked = false;

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
}

async function finishSkill() {
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Call API to finish session (updates streak)
    const response = await API.finishSession(currentActiveSkill.name, currentActiveSkill.duration, currentActiveSkill.category);
    
    // Reload data
    await loadData();
    
    // Show reward modal with confetti if rewards exist
    if (rewards.length > 0) {
        openRewardModal();
    } else {
        showMessage("🎉 Session complete! Add rewards to see them here.");
        // Unlock buttons for next session
        isActiveLocked = false;
        document.getElementById('skillBtn').disabled = false;
        document.getElementById('rewardBtn').disabled = false;
        document.getElementById('skillBtn').classList.remove('opacity-50', 'cursor-not-allowed');
        document.getElementById('rewardBtn').classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

function openRewardModal() {
    if (rewards.length === 0) return;
    
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    const modal = document.getElementById('rewardModal');
    
    if (modal) {
        document.getElementById('rewardModalReward').innerText = reward.name;
        modal.classList.remove('hidden');
        
        // Trigger confetti effect
        triggerConfetti();
        setTimeout(() => triggerConfetti(), 200);
        setTimeout(() => triggerConfetti(), 400);
    }
    
    // Unlock buttons for next session
    isActiveLocked = false;
    document.getElementById('skillBtn').disabled = false;
    document.getElementById('rewardBtn').disabled = false;
    document.getElementById('skillBtn').classList.remove('opacity-50', 'cursor-not-allowed');
    document.getElementById('rewardBtn').classList.remove('opacity-50', 'cursor-not-allowed');
}

function closeRewardModal() {
    const modal = document.getElementById('rewardModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // Hide result box and timer
    const resultBox = document.getElementById('resultBox');
    const treasureChestBox = document.getElementById('treasureChestBox');
    if (resultBox) resultBox.classList.add('hidden');
    if (treasureChestBox) treasureChestBox.classList.add('hidden');
}

function triggerConfetti() {
    if (typeof confetti === 'undefined') return;
    
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

async function addSkill() {
    const name = document.getElementById('skillInput').value.trim();
    if (!name) return;
    
    const category = document.getElementById('categorySelect').value;
    const duration = parseInt(document.getElementById('durationInput').value) || 45;
    
    const response = await API.addSkill(name, category, duration);
    if (response.success) {
        document.getElementById('skillInput').value = '';
        await loadData();
        renderAll();
        showMessage('✓ Skill added');
    } else {
        showMessage('✗ Error: ' + response.error);
    }
}

async function addReward() {
    const name = document.getElementById('rewardInput').value.trim();
    if (!name) return;
    
    const response = await API.addReward(name);
    if (response.success) {
        document.getElementById('rewardInput').value = '';
        await loadData();
        renderAll();
        showMessage('✓ Reward added');
    } else {
        showMessage('✗ Error: ' + response.error);
    }
}

async function updateDailyGoal(v) {
    const goal = parseInt(v) || 4;
    const response = await API.updateSettings({ dailyGoal: goal });
    if (response.success) {
        settings.dailyGoal = goal;
        updateStats();
    }
}

async function clearHistory() {
    if (!confirm("Are you sure? This will clear all history.")) return;
    
    const response = await API.clearHistory();
    if (response.success) {
        await loadData();
        renderAll();
        showMessage('✓ History cleared');
    } else {
        showMessage('✗ Error: ' + response.error);
    }
}

async function deleteItem(type, id) {
    let response;
    if (type === 'skill') {
        response = await API.deleteSkill(id);
        if (response.success) {
            skills = skills.filter(s => s.id !== id);
        }
    } else {
        response = await API.deleteReward(id);
        if (response.success) {
            rewards = rewards.filter(r => r.id !== id);
        }
    }
    
    if (response.success) {
        renderAll();
        showMessage('✓ Deleted');
    } else {
        showMessage('✗ Error: ' + response.error);
    }
}

async function changeInterface(interfaceName) {
    const response = await API.updateSettings({ currentInterface: interfaceName });
    if (response.success) {
        settings.currentInterface = interfaceName;
        setTimeout(() => {
            window.location.href = `index.php?view=${interfaceName}`;
        }, 500);
    }
}

function updateStats() {
    const today = new Date().toLocaleDateString();
    const todayLogs = history.filter(h => h.date === today);
    const totalMins = todayLogs.reduce((s, l) => s + (l.duration || 0), 0);
    
    document.getElementById('streakCount').innerText = settings.streak;
    document.getElementById('todayTotal').innerText = totalMins;
    document.getElementById('goalText').innerText = `Goal: ${todayLogs.length}/${settings.dailyGoal} sessions`;
    const p = Math.min((todayLogs.length / settings.dailyGoal) * 100, 100);
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
            </div>
        </div>
    `).join('') : '<p class="text-center py-10 text-xs text-gray-300 font-medium">No activity today</p>';
    
    updateStats();
}

// --- INITIALIZATION ---
async function loadData() {
    try {
        const response = await API.getData();
        if (response.success) {
            const data = response.data;
            skills = data.skills || [];
            rewards = data.rewards || [];
            history = data.history || [];
            settings = data.settings || {};
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showMessage('Error loading data');
    }
}

async function initializeApp() {
    await loadData();
    
    // Set interface selector to current interface
    const interfaceSelect = document.getElementById('interfaceSelect');
    if (interfaceSelect) {
        const currentView = new URLSearchParams(window.location.search).get('view') || settings.currentInterface || 'minimalist';
        interfaceSelect.value = currentView;
    }
    
    // Set goal input
    document.getElementById('goalInput').value = settings.dailyGoal || 4;
    
    renderAll();
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for export/import
async function exportData() {
    const data = await API.getData();
    if (data.success) {
        const json = JSON.stringify(data.data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `learn-reward-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        showMessage('✓ Data exported');
    }
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        if (e.target.files.length === 0) return;
        try {
            const file = e.target.files[0];
            const text = await file.text();
            const data = JSON.parse(text);
            
            // For now, just show message
            showMessage('✓ Import file received. Contact admin to import.');
        } catch (error) {
            showMessage('✗ Error reading file: ' + error.message);
        }
    };
    input.click();
}
