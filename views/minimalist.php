<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Learner - Minimalist AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body class="bg-[#fafafa] text-[#1a1a1a] min-h-screen">

    <!-- Navigation -->
    <nav class="sticky top-0 z-50 bg-[#fafafa]/80 backdrop-blur-md border-b border-gray-100">
        <div class="max-w-2xl mx-auto px-6 h-20 flex items-center justify-between">
            <h1 class="text-xl font-extrabold tracking-tight">Focus<span class="text-indigo-600">.</span></h1>
            <div class="flex gap-8 text-sm font-medium text-gray-400 relative">
                <button onclick="switchTab('dashboard')" id="tab-dashboard" class="tab-active relative py-2 transition-all">Learning</button>
                <button onclick="switchTab('settings')" id="tab-settings" class="relative py-2 transition-all">Settings</button>
            </div>
        </div>
    </nav>

    <main class="max-w-2xl mx-auto px-6 pt-8 pb-24">
        
        <!-- DASHBOARD VIEW -->
        <div id="view-dashboard" class="space-y-10 animate-fade-in">
            
            <!-- Top Stats & Streak -->
            <section class="flex items-center justify-between">
                <div class="space-y-1">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Progress</p>
                    <div class="flex items-baseline gap-2">
                        <span id="todayTotal" class="text-3xl font-extrabold text-gray-900">0</span>
                        <span class="text-sm font-medium text-gray-400">focus minutes</span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold">
                        <span>🔥 <span id="streakCount">0</span> day streak</span>
                    </div>
                </div>
            </section>

            <!-- Daily Goal Progress -->
            <div class="space-y-3">
                <div class="flex justify-between items-end">
                    <span id="goalText" class="text-xs font-bold text-gray-500 uppercase">Goal: 0/4 sessions</span>
                    <span id="goalPercent" class="text-xs font-bold text-indigo-600">0%</span>
                </div>
                <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div id="goalProgress" class="h-full bg-indigo-500 transition-all duration-700 ease-out" style="width: 0%"></div>
                </div>
            </div>



            <!-- Primary Action -->
            <section class="grid grid-cols-2 gap-4">
                <button id="skillBtn" onclick="pickRandomSkill()" class="group bg-indigo-600 text-white p-6 rounded-[2rem] font-bold transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 active:scale-95 text-left flex flex-col justify-between h-40">
                    <div class="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">🧠</div>
                    <span class="text-lg">Pick a skill<br>to learn</span>
                </button>
                <button id="rewardBtn" onclick="pickRandomReward()" class="group bg-white text-gray-900 border border-gray-100 p-6 rounded-[2rem] font-bold transition-all hover:border-pink-200 hover:shadow-xl hover:shadow-pink-50 active:scale-95 text-left flex flex-col justify-between h-40">
                    <div class="bg-pink-50 w-10 h-10 rounded-full flex items-center justify-center">🎁</div>
                    <span class="text-lg">Get a well-earned<br>reward</span>
                </button>
            </section>

            <!-- Active Task & Timer Card -->
            <section id="resultBox" class="hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 soft-shadow text-center relative overflow-hidden">
                    <div id="aiAssistantBox" class="mb-8">
                        <p id="resultType" class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2"></p>
                        <h3 id="resultValue" class="text-3xl font-extrabold text-gray-900 mb-2"></h3>
                        <p id="skillDurationInfo" class="text-xs font-medium text-gray-400 mb-6"></p>
                        

                    </div>

                    <!-- Minimal Timer -->
                    <div id="timerContainer" class="hidden">
                        <div class="text-[5rem] font-extrabold tracking-tighter text-gray-900 leading-none mb-8" id="timerDisplay">45:00</div>
                        <div class="flex items-center justify-center gap-4">
                            <button id="timerBtn" onclick="toggleTimer()" class="bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-100 hover:scale-105 transition active:scale-95">
                                <svg id="timerIcon" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </button>
                            <button id="finishBtn" onclick="finishSkill()" class="hidden bg-green-500 text-white px-8 h-14 rounded-full font-bold hover:bg-green-600 transition shadow-lg shadow-green-100">
                                Finish ✅
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Minimal History -->
            <section class="pt-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-sm font-bold uppercase tracking-widest text-gray-400">Today's History</h2>
                    <button onclick="clearHistory()" class="text-[10px] font-bold text-gray-300 hover:text-red-400 transition uppercase tracking-tighter">Clear All</button>
                </div>
                <div id="historyList" class="space-y-4"></div>
            </section>
        </div>

        <!-- SETTINGS VIEW -->
        <div id="view-settings" class="hidden space-y-12 animate-fade-in">
            <!-- Display Interface Section -->
            <section class="bg-white p-8 rounded-[2rem] border border-gray-100 soft-shadow">
                <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Display Interface</h3>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600">Choose your layout:</span>
                    <select id="interfaceSelect" onchange="changeInterface(this.value)" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer hover:border-indigo-300 transition">
                        <option value="minimalist">📱 Minimalist</option>
                        <option value="pixel">🎮 Pixel</option>
                        <option value="retro">🕹️ Retro</option>
                    </select>
                </div>
                <p class="text-[10px] text-gray-400 mt-4">Interface preference will be saved and applied when you open the app.</p>
            </section>

            <!-- Goals Section -->
            <section class="bg-white p-8 rounded-[2rem] border border-gray-100 soft-shadow">
                <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Daily Goals</h3>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-600">Target sessions per day:</span>
                    <input type="number" id="goalInput" value="4" onchange="updateDailyGoal(this.value)" class="w-16 p-3 bg-gray-50 border-none rounded-2xl text-center font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                </div>
            </section>

            <!-- Skills List -->
            <section class="space-y-6">
                <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400 flex justify-between">
                    Learning Skills
                    <span id="skillCountBadge" class="text-indigo-500">0</span>
                </h3>
                
                <div class="bg-white p-2 rounded-[2rem] border border-gray-100 soft-shadow flex gap-2">
                    <input id="skillInput" type="text" placeholder="Add a skill..." class="flex-1 bg-transparent px-6 py-3 text-sm outline-none">
                    <button onclick="addSkill()" class="bg-indigo-600 text-white px-6 py-3 rounded-[1.5rem] text-sm font-bold hover:bg-indigo-700 transition">Add</button>
                </div>

                <div class="space-y-3">
                    <div class="flex gap-2 overflow-x-auto no-scrollbar">
                        <select id="categorySelect" class="bg-white border border-gray-100 px-4 py-2 rounded-full text-xs font-bold outline-none focus:border-indigo-200">
                            <option value="Logic">🧠 Logic</option>
                            <option value="Language">🗣️ Language</option>
                            <option value="Physical">💪 Physical</option>
                            <option value="Creative">🎨 Creative</option>
                        </select>
                        <div class="flex items-center bg-white border border-gray-100 px-4 py-2 rounded-full text-xs font-bold">
                            <input id="durationInput" type="number" value="45" class="w-8 outline-none text-center">
                            <span class="text-gray-300 ml-1 uppercase">mins</span>
                        </div>
                    </div>
                    
                    <!-- Scientific Suggestions Chips -->
                    <div class="flex flex-wrap gap-2 pt-1">
                        <button onclick="setDuration(25, 'Pomodoro')" class="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition">25m (Pomodoro/Languages)</button>
                        <button onclick="setDuration(45, 'Standard')" class="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition">45m (Standard)</button>
                        <button onclick="setDuration(90, 'Deep Work')" class="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition">90m (Deep Work/Coding)</button>
                    </div>
                </div>

                <ul id="skillList" class="grid grid-cols-1 gap-3"></ul>
            </section>

            <!-- Rewards List -->
            <section class="space-y-6">
                <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400">Rewards</h3>
                <div class="bg-white p-2 rounded-[2rem] border border-gray-100 soft-shadow flex gap-2">
                    <input id="rewardInput" type="text" placeholder="Add a reward..." class="flex-1 bg-transparent px-6 py-3 text-sm outline-none">
                    <button onclick="addReward()" class="bg-pink-500 text-white px-6 py-3 rounded-[1.5rem] text-sm font-bold hover:bg-pink-600 transition">Add</button>
                </div>
                <ul id="rewardList" class="grid grid-cols-1 gap-3"></ul>
            </section>

            <!-- Data Management -->
            <section class="bg-white p-8 rounded-[2rem] border border-gray-100 soft-shadow">
                <h3 class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Data Backup & Restore</h3>
                <div class="space-y-3">
                    <button onclick="exportData()" class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 px-6 py-3 rounded-2xl text-sm font-bold transition">
                        📥 Export Dữ Liệu (JSON)
                    </button>
                    <button onclick="importData()" class="w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 px-6 py-3 rounded-2xl text-sm font-bold transition">
                        📤 Import Dữ Liệu (JSON)
                    </button>
                    <button onclick="clearHistory()" class="w-full bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 px-6 py-3 rounded-2xl text-sm font-bold transition">
                        🗑️ Clear Lịch Sử
                    </button>
                </div>
                <p class="text-[10px] text-gray-400 mt-4 leading-relaxed">Dữ liệu được lưu trữ sử dụng IndexedDB trên trình duyệt. Bạn có thể export để backup hoặc sử dụng trên máy tính khác.</p>
            </section>

    </main>

    <!-- Reward Modal -->
    <div id="rewardModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
        <div class="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl animate-bounce">
            <div class="text-6xl mb-4">🎁</div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">✨ REWARD ✨</h2>
            <p id="rewardModalReward" class="text-lg font-bold text-indigo-600 mb-6"></p>
            <button onclick="closeRewardModal()" class="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition">
                CLOSE
            </button>
        </div>
    </div>

    <!-- Global Toast Message -->
    <div id="msgBox" class="fixed bottom-10 left-1/2 -translate-x-1/2 glass-card text-gray-900 px-8 py-4 rounded-full shadow-2xl hidden z-50 text-xs font-bold border border-gray-100 animate-bounce text-center">
        <p id="msgContent"></p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.0/dist/confetti.browser.min.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
