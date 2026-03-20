// --- IndexedDB Manager ---
// Lưu trữ dữ liệu lâu dài thay vì localStorage

const DB_NAME = 'LearnRewardDB';
const DB_VERSION = 1;
const STORE_NAME = 'appData';

class DBManager {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    /**
     * Khởi tạo IndexedDB
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                this.initialized = true;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    }

    /**
     * Lấy dữ liệu từ IndexedDB
     */
    async getData(key) {
        if (!this.initialized) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    /**
     * Lưu dữ liệu vào IndexedDB
     */
    async saveData(key, value) {
        if (!this.initialized) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(value, key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    /**
     * Xóa dữ liệu từ IndexedDB
     */
    async deleteData(key) {
        if (!this.initialized) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    /**
     * Xóa toàn bộ dữ liệu
     */
    async clearAll() {
        if (!this.initialized) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    /**
     * Lấy tất cả dữ liệu
     */
    async getAllData() {
        if (!this.initialized) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const result = {};
                const data = request.result;
                
                // Nếu getAllKeys không support, ta cần dùng cách khác
                transaction.objectStore(STORE_NAME).getAllKeys().onsuccess = (e) => {
                    const keys = e.target.result;
                    keys.forEach((key, index) => {
                        result[key] = data[index];
                    });
                    resolve(result);
                };
            };
        });
    }

    /**
     * Export dữ liệu thành JSON file
     */
    async exportToJSON() {
        const allData = await this.getAllData();
        const jsonString = JSON.stringify(allData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `learn-reward-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Import dữ liệu từ JSON file
     */
    async importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    await this.clearAll();
                    for (const [key, value] of Object.entries(jsonData)) {
                        await this.saveData(key, value);
                    }
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
}

// Tạo instance toàn cục
const dbManager = new DBManager();
