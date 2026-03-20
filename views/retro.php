<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Learner - ARCADE EDITION</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            font-family: 'Orbitron', monospace;
        }

        body {
            background: #0a0e27;
            background-image: 
                radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%);
            color: #00ff88;
        }

        /* Retro Scanline Effect */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: 1;
        }

        main {
            position: relative;
            z-index: 2;
        }

        /* Neon Glow Text */
        .neon-cyan {
            color: #00ffff;
            text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #0099ff;
        }

        .neon-magenta {
            color: #ff00ff;
            text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff0099;
        }

        .neon-lime {
            color: #00ff88;
            text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00cc99;
        }

        .neon-yellow {
            color: #ffff00;
            text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffcc00;
        }

        /* Retro Button Glow */
        .arcade-btn {
            background: linear-gradient(135deg, #ff00ff, #00ffff);
            border: 3px solid #00ffff;
            color: #0a0e27;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px #00ffff, inset 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .arcade-btn:hover {
            box-shadow: 0 0 30px #00ffff, 0 0 60px #ff00ff, inset 0 0 30px rgba(255, 0, 255, 0.3);
            transform: scale(1.05);
            border-color: #ff00ff;
        }

        .arcade-btn:active {
            transform: scale(0.95);
            box-shadow: 0 0 50px #ff00ff, inset 0 0 30px rgba(255, 0, 255, 0.5);
        }

        /* Secondary Button */
        .arcade-btn-secondary {
            background: linear-gradient(135deg, #00ff88, #00ffff);
            border: 3px solid #00ff88;
            color: #0a0e27;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px #00ff88, inset 0 0 15px rgba(0, 255, 136, 0.3);
        }

        .arcade-btn-secondary:hover {
            box-shadow: 0 0 30px #00ff88, 0 0 60px #00ffff, inset 0 0 30px rgba(0, 255, 136, 0.3);
            transform: scale(1.05);
            border-color: #00ffff;
        }

        .arcade-btn-secondary:active {
            transform: scale(0.95);
            box-shadow: 0 0 50px #00ff88, inset 0 0 30px rgba(0, 255, 136, 0.5);
        }

        /* Card with Glow Border */
        .arcade-card {
            background: rgba(10, 14, 39, 0.8);
            border: 2px solid #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1);
            backdrop-filter: blur(10px);
        }

        .arcade-card:hover {
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(0, 255, 136, 0.2);
            border-color: #00ff88;
        }

        /* Navigation */
        .arcade-nav {
            background: rgba(10, 14, 39, 0.95);
            border-bottom: 3px solid #00ffff;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        }

        .tab-active {
            color: #00ffff;
            text-shadow: 0 0 10px #00ffff;
            border-bottom: 3px solid #00ffff;
            box-shadow: inset 0 -3px 0 #ff00ff;
        }

        .tab-inactive {
            color: #00ff88;
            transition: all 0.3s ease;
        }

        .tab-inactive:hover {
            color: #00ffff;
            text-shadow: 0 0 10px #00ffff;
        }

        /* Pixel Art Border */
        .pixel-border {
            background-image: 
                linear-gradient(90deg, #ff00ff 50%, transparent 50%),
                linear-gradient(90deg, #ff00ff 50%, transparent 50%),
                linear-gradient(0deg, #00ffff 50%, transparent 50%),
                linear-gradient(0deg, #00ffff 50%, transparent 50%);
            background-position: 0 0, 100% 0, 0 100%, 100% 100%;
            background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
            background-size: 4px 3px, 4px 3px, 3px 4px, 3px 4px;
        }

        /* Glowing Text */
        .title-gamer {
            font-size: 2rem;
            font-weight: 900;
            letter-spacing: 3px;
            background: linear-gradient(90deg, #ff00ff, #00ffff, #00ff88, #ff00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: glow-shift 3s ease-in-out infinite;
            text-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        }

        @keyframes glow-shift {
            0%, 100% { filter: drop-shadow(0 0 10px #ff00ff); }
            50% { filter: drop-shadow(0 0 20px #00ffff); }
        }

        /* Progress Bar Gamer Style */
        .progress-bar-gamer {
            background: linear-gradient(90deg, #ff00ff 0%, #00ffff 50%, #00ff88 100%);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            border: 1px solid #00ffff;
        }

        /* Streak Badge */
        .arcade-badge {
            background: linear-gradient(135deg, #ff00ff, #00ff88);
            border: 2px solid #ffff00;
            box-shadow: 0 0 20px #ffff00;
            color: #0a0e27;
            font-weight: 900;
        }

        /* Timer Display */
        .timer-display {
            font-size: 5rem;
            font-weight: 900;
            letter-spacing: 4px;
            color: #00ff88;
            text-shadow: 0 0 20px #00ff88, 0 0 40px #00ffff;
            font-family: 'Courier New', monospace;
            line-height: 1;
        }

        /* Floating Animation */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .float {
            animation: float 3s ease-in-out infinite;
        }

        /* Pulse Animation */
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 10px #00ff88; }
            50% { box-shadow: 0 0 30px #00ffff; }
        }

        .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
        }

        /* Input Styling */
        .arcade-input {
            background: rgba(0, 255, 255, 0.05);
            border: 2px solid #00ff88;
            color: #00ffff;
            outline: none;
            transition: all 0.3s ease;
        }

        .arcade-input:focus {
            border-color: #ff00ff;
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
            background: rgba(255, 0, 255, 0.1);
        }

        .arcade-input::placeholder {
            color: #00ff88;
            opacity: 0.5;
        }

        /* Select Styling */
        select.arcade-input {
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300ff88' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.5rem center;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
            appearance: none;
        }

        /* Retro Dust Particles */
        @keyframes dust {
            0% { 
                opacity: 1;
                transform: translateY(0) translateX(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) translateX(20px);
            }
        }

        /* Score/History Item */
        .history-item {
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
            border-left: 4px solid #00ff88;
            border-right: 4px solid #ff00ff;
            padding: 1rem;
            margin: 0.5rem 0;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }

        /* Skill/Reward Chip */
        .arcade-chip {
            background: rgba(0, 255, 136, 0.1);
            border: 2px solid #00ff88;
            color: #00ff88;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 700;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .arcade-chip:hover {
            background: rgba(0, 255, 255, 0.2);
            border-color: #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            transform: scale(1.05);
        }

        .arcade-chip.delete {
            border-color: #ff00ff;
            color: #ff00ff;
            background: rgba(255, 0, 255, 0.1);
        }

        .arcade-chip.delete:hover {
            background: rgba(255, 0, 255, 0.3);
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
        }

        /* Loading Animation */
        @keyframes blink {
            0%, 49%, 100% { opacity: 1; }
            50%, 99% { opacity: 0.3; }
        }

        .blink {
            animation: blink 1s infinite;
        }

        /* Skill Button Specific */
        .skill-btn {
           display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;
        flex-wrap: nowrap;
        }

        .skill-btn .btn-icon {
            font-size: 3rem;
            line-height: 1;
        }

        .skill-btn .btn-text {
            font-size: 1.25rem;
            line-height: 1.2;
            letter-spacing: 0.1em;
        }

        /* Reward Modal */
        .reward-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            backdrop-filter: blur(5px);
        }

        .reward-modal.hidden {
            display: none;
        }

        .reward-modal-content {
            background: rgba(10, 14, 39, 0.95);
            border: 4px solid #00ff88;
            border-radius: 1rem;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 255, 136, 0.4), 0 0 100px rgba(255, 0, 255, 0.2);
            animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalSlideIn {
            0% {
                transform: scale(0.7) translateY(-50px);
                opacity: 0;
            }
            100% {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }

        .reward-modal-icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            animation: bounce 0.8s ease-in-out;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
        }

        .reward-modal-title {
            font-size: 1rem;
            color: #ffff00;
            letter-spacing: 0.2em;
            text-shadow: 0 0 10px #ffff00;
            margin-bottom: 1rem;
            font-weight: 900;
        }

        .reward-modal-reward {
            font-size: 2.5rem;
            color: #00ff88;
            text-shadow: 0 0 20px #00ff88;
            margin-bottom: 2rem;
            font-weight: 900;
            line-height: 1.4;
        }

        .reward-modal-text {
            color: #00ffff;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
            text-shadow: 0 0 10px #00ffff;
        }

        .reward-modal-close {
            background: linear-gradient(135deg, #ff00ff, #00ffff);
            border: 2px solid #00ffff;
            color: #0a0e27;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-weight: 900;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .reward-modal-close:hover {
            box-shadow: 0 0 30px #00ffff, 0 0 60px #ff00ff;
            transform: scale(1.05);
        }

        .reward-modal-close:active {
            transform: scale(0.95);
        }
    </style>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>

    <!-- Navigation -->
    <nav class="arcade-nav sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
            <h1 class="title-gamer">🎮 FOCUS.EXE</h1>
            <div class="flex gap-8 text-sm font-bold relative">
                <button onclick="switchTab('dashboard')" id="tab-dashboard" class="tab-active transition-all px-4 py-2">
                    ▶ LEARNING
                </button>
                <button onclick="switchTab('settings')" id="tab-settings" class="tab-inactive transition-all px-4 py-2">
                    ⚙ CONFIG
                </button>
            </div>
        </div>
    </nav>

    <main class="max-w-4xl mx-auto px-6 pt-8 pb-24">
        
        <!-- DASHBOARD VIEW -->
        <div id="view-dashboard" class="space-y-10 animate-fade-in">
            
            <!-- Top Stats & Streak -->
            <section class="grid grid-cols-2 gap-6 md:grid-cols-2">
                <div class="arcade-card p-6 rounded-lg">
                    <p class="neon-cyan text-xs font-bold uppercase tracking-widest mb-2">
                        ⏱ TODAY'S PROGRESS
                    </p>
                    <div class="flex items-baseline gap-2 mt-3">
                        <span id="todayTotal" class="text-3xl font-black neon-lime">0</span>
                        <span class="text-xs neon-cyan">MINUTES</span>
                    </div>
                </div>

                <div class="arcade-badge p-6 rounded-lg text-center float">
                    <p class="text-[10px] font-bold uppercase tracking-wider mb-2 text-purple-900">
                        STREAK BONUS
                    </p>
                    <div class="text-3xl font-black text-purple-900">🔥 <span id="streakCount">0</span></div>
                </div>
            </section>

            <!-- Daily Goal Progress -->
            <div class="arcade-card p-6 rounded-lg space-y-3">
                <div class="flex justify-between items-center">
                    <span id="goalText" class="neon-cyan text-xs font-bold uppercase">📊 DAILY QUEST: 0/4</span>
                    <span id="goalPercent" class="neon-magenta text-sm font-bold">0%</span>
                </div>
                <div class="h-4 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-400/50">
                    <div id="goalProgress" class="progress-bar-gamer h-full transition-all duration-700 ease-out" style="width: 0%"></div>
                </div>
            </div>

            <!-- Primary Action Buttons -->
            <section class="grid grid-cols-1 gap-6">
                <button id="skillBtn" onclick="pickRandomSkill()" class="arcade-btn p-8 rounded-lg h-48 skill-btn hover:shadow-2xl">
                    <div class="btn-icon">🧠</div>
                    <div class="btn-text neon-lime">PICK A<br>SKILL</div>
                </button>
            </section>

            <!-- Active Task & Timer Card -->
            <section id="resultBox" class="hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="arcade-card p-10 rounded-lg pulse-glow">
                    <div id="aiAssistantBox" class="mb-8 text-center">
                        <p id="resultType" class="neon-magenta text-xs font-black uppercase tracking-[0.3em] mb-3">
                            ▶ MISSION SELECTED
                        </p>
                        <h3 id="resultValue" class="neon-cyan text-2xl md:text-3xl font-black mb-4 break-words"></h3>
                        <p id="skillDurationInfo" class="neon-lime text-xs font-bold uppercase tracking-wider"></p>
                    </div>

                    <!-- Minimal Timer -->
                    <div id="timerContainer" class="hidden text-center">
                        <div class="timer-display mb-8" id="timerDisplay">45:00</div>
                        <div class="flex items-center justify-center gap-6 mb-8" id="timerControls">
                            <button id="timerBtn" onclick="toggleTimer()" class="arcade-btn w-16 h-16 rounded-full flex items-center justify-center font-black text-xl hover:shadow-2xl">
                                <svg id="timerIcon" fill="currentColor" viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path d="M8 5v14l11-7z"/></svg>
                            </button>
                            <button id="finishBtn" onclick="finishSkill()" class="hidden arcade-btn-secondary px-8 h-16 rounded-lg font-black text-base hover:shadow-2xl">
                                ✅ FINISH
                            </button>
                        </div>
                    </div>

                    <!-- Treasure Chest Reward -->
                    <div id="treasureChestBox" class="hidden text-center mt-8">
                        <button id="rewardBtn" onclick="pickRandomReward()" class="arcade-btn-secondary mx-auto py-6 px-12 rounded-lg font-black text-3xl hover:shadow-2xl transform hover:scale-110 transition-transform duration-300">
                            💎
                        </button>
                        <p class="neon-yellow text-xs font-black uppercase tracking-wider mt-4">CLICK FOR REWARD</p>
                    </div>
                </div>
            </section>

            <!-- Minimal History -->
            <section class="pt-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="neon-cyan text-sm font-black uppercase tracking-widest">📜 SESSION LOGS</h2>
                    <button onclick="clearHistory()" class="neon-magenta text-[10px] font-black hover:text-cyan-400 transition uppercase tracking-tighter hover:shadow-lg">
                        CLEAR
                    </button>
                </div>
                <div id="historyList" class="space-y-3"></div>
            </section>
        </div>

        <!-- Reward Modal -->
        <div id="rewardModal" class="reward-modal hidden">
            <div class="reward-modal-content">
                <div class="reward-modal-icon">🎁</div>
                <div class="reward-modal-title">⭐ TREASURE UNLOCKED ⭐</div>
                <div class="reward-modal-reward" id="rewardModalReward"></div>
                <div class="reward-modal-text">✨ Enjoy your reward! ✨</div>
                <button onclick="closeRewardModal()" class="reward-modal-close">
                    CLOSE
                </button>
            </div>
        </div>

        <!-- SETTINGS VIEW -->
        <div id="view-settings" class="hidden space-y-12 animate-fade-in">
            
            <!-- Display Interface Section -->
            <section class="arcade-card p-8 rounded-lg">
                <h3 class="neon-magenta text-sm font-black uppercase tracking-widest mb-6">🎨 ARCADE MODE</h3>
                <div class="flex items-center justify-between gap-4">
                    <span class="neon-cyan text-sm font-bold uppercase">CHOOSE LAYOUT:</span>
                    <select id="interfaceSelect" onchange="changeInterface(this.value)" class="arcade-input px-4 py-3 rounded-lg text-sm font-black focus:outline-none cursor-pointer">
                        <option value="minimalist">📱 Minimalist</option>
                        <option value="pixel">🎮 Pixel</option>
                        <option value="retro">🕹️ Retro</option>
                    </select>
                </div>
                <p class="neon-cyan text-[10px] mt-4 opacity-70 uppercase tracking-wide">★ Your layout choice will be saved automatically</p>
            </section>

            <!-- Goals Section -->
            <section class="arcade-card p-8 rounded-lg">
                <h3 class="neon-magenta text-sm font-black uppercase tracking-widest mb-6">⚔ DIFFICULTY SETTINGS</h3>
                <div class="flex items-center justify-between gap-4">
                    <span class="neon-cyan text-sm font-bold uppercase">TARGET SESSIONS:</span>
                    <input type="number" id="goalInput" value="4" onchange="updateDailyGoal(this.value)" class="arcade-input w-20 p-3 rounded-lg text-center font-black text-lg">
                </div>
            </section>

            <!-- Skills List -->
            <section class="space-y-6">
                <h3 class="neon-magenta text-sm font-black uppercase tracking-widest flex justify-between items-center">
                    🎮 LEARNING SKILLS
                    <span id="skillCountBadge" class="arcade-badge px-3 py-1 rounded text-purple-900">0</span>
                </h3>
                
                <div class="arcade-card p-2 rounded-lg flex gap-2">
                    <input id="skillInput" type="text" placeholder="ADD SKILL..." class="arcade-input flex-1 px-4 py-3 rounded text-sm outline-none">
                    <button onclick="addSkill()" class="arcade-btn px-6 py-3 rounded-lg text-sm font-black">ADD</button>
                </div>

                <div class="space-y-4">
                    <div class="flex gap-2 flex-wrap">
                        <select id="categorySelect" class="arcade-input px-4 py-2 rounded text-xs font-bold focus:outline-none">
                            <option value="Logic">🧠 LOGIC</option>
                            <option value="Language">🗣️ LANGUAGE</option>
                            <option value="Physical">💪 PHYSICAL</option>
                            <option value="Creative">🎨 CREATIVE</option>
                        </select>
                        <div class="arcade-card px-4 py-2 rounded text-xs font-bold flex items-center gap-2">
                            <input id="durationInput" type="number" value="45" class="w-12 outline-none bg-transparent text-center neon-lime">
                            <span class="neon-cyan">MINS</span>
                        </div>
                    </div>
                    
                    <!-- Quick Duration Buttons -->
                    <div class="flex flex-wrap gap-2 pt-2">
                        <button onclick="setDuration(25, 'Pomodoro')" class="arcade-chip">⚡ 25M</button>
                        <button onclick="setDuration(45, 'Standard')" class="arcade-chip">🎯 45M</button>
                        <button onclick="setDuration(90, 'Deep Work')" class="arcade-chip">🔥 90M</button>
                    </div>
                </div>

                <ul id="skillList" class="grid gap-3"></ul>
            </section>

            <!-- Rewards List -->
            <section class="space-y-6">
                <h3 class="neon-yellow text-sm font-black uppercase tracking-widest">🏆 REWARDS</h3>
                <div class="arcade-card p-2 rounded-lg flex gap-2">
                    <input id="rewardInput" type="text" placeholder="ADD REWARD..." class="arcade-input flex-1 px-4 py-3 rounded text-sm outline-none">
                    <button onclick="addReward()" class="arcade-btn-secondary px-6 py-3 rounded-lg text-sm font-black">ADD</button>
                </div>
                <ul id="rewardList" class="grid gap-3"></ul>
            </section>

            <!-- Data Management -->
            <section class="arcade-card p-8 rounded-lg">
                <h3 class="neon-cyan text-sm font-black uppercase tracking-widest mb-6">💾 DATA VAULT</h3>
                <div class="space-y-3">
                    <button onclick="exportData()" class="arcade-chip w-full justify-center py-3 px-6 rounded-lg text-sm font-black border-2 hover:shadow-lg">
                        📥 EXPORT DATA
                    </button>
                    <button onclick="importData()" class="arcade-chip w-full justify-center py-3 px-6 rounded-lg text-sm font-black border-2 hover:shadow-lg" style="border-color: #ff00ff; color: #ff00ff; background: rgba(255, 0, 255, 0.1);">
                        📤 IMPORT DATA
                    </button>
                    <button onclick="clearHistory()" class="arcade-chip w-full justify-center py-3 px-6 rounded-lg text-sm font-black border-2 hover:shadow-lg" style="border-color: #ff0000; color: #ff0000; background: rgba(255, 0, 0, 0.1);">
                        🗑️ CLEAR LOG
                    </button>
                </div>
                <p class="neon-cyan text-[10px] mt-4 leading-relaxed">
                    ▶ DATA STORED IN BROWSER. EXPORT FOR BACKUP OR TRANSFER.
                </p>
            </section>
        </div>

    </main>

    <!-- Global Toast Message -->
    <div id="msgBox" class="fixed bottom-10 left-1/2 -translate-x-1/2 arcade-card text-center px-8 py-4 rounded-lg font-black hidden z-50 text-sm neon-lime animate-bounce border-2">
        <p id="msgContent"></p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.0/dist/confetti.browser.min.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
