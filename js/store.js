import { APP_ID, WALLPAPER_URL, TRANSLATIONS } from './config.js';

export const Store = {
    state: {
        language: 'en',
        isDark: false,
        wallpaper: WALLPAPER_URL,
        isStartOpen: false,
        openFolderId: null,
        
        // Start Menu State
        startMenuView: 'pinned',
        startMenuSearch: '',
        
        windows: [], 
        nextZIndex: 100,
        
        // --- STORE CATALOGUE ---
        storeCatalogue: [
            { id: APP_ID.YOUTUBE, name: 'YouTube', developer: 'Google LLC', description: 'Watch videos from around the world.', rating: 4.5, url: 'https://www.youtube.com/embed/?autoplay=0' },
            { id: APP_ID.SPOTIFY, name: 'Spotify', developer: 'Spotify AB', description: 'Music for everyone.', rating: 4.8, url: 'https://open.spotify.com/embed' },
            { id: APP_ID.DISCORD, name: 'Discord', developer: 'Discord Inc.', description: 'Talk, chat, hang out.', rating: 4.7, url: 'https://discord.com' },
            { id: APP_ID.GMAIL, name: 'Gmail', developer: 'Google LLC', description: 'Secure, smart, and easy to use email.', rating: 4.6, url: 'https://mail.google.com' },
            { id: APP_ID.CANVA, name: 'Canva', developer: 'Canva', description: 'Design for everyone.', rating: 4.9, url: 'https://www.canva.com' },
            // GAMES
            { id: APP_ID.SNAKE, name: 'Snake Game', developer: 'Retro Classics', description: 'The classic snake game. Eat apples and grow!', rating: 4.9, url: 'local' },
            { id: APP_ID.TETRIS, name: 'Tetris Block', developer: 'Retro Classics', description: 'Stack the blocks and clear lines.', rating: 5.0, url: 'local' }
        ],

        // --- INSTALLED APPS ---
        installedApps: [],

        // --- DESKTOP ITEMS ---
        desktopItems: [
            { id: APP_ID.EDGE, label: "Microsoft Edge", x: 8, y: 8, isShortcut: true, targetPath: 'system' },
            { id: APP_ID.EXPLORER, label: "File Explorer", x: 8, y: 112, isShortcut: true, targetPath: 'system' },
            { id: APP_ID.STORE, label: "Microsoft Store", x: 8, y: 216, isShortcut: true, targetPath: 'system' },
            { id: APP_ID.VSCODE, label: "Visual Studio Code", x: 8, y: 320, isShortcut: true, targetPath: 'system' },
            { id: 'resume', label: "Resume.pdf", x: 104, y: 8, isShortcut: false, type: 'file', size: '1.2 MB', icon: 'file-text' }
        ],

        // --- PINNED ITEMS ---
        pinnedItems: [
            { type: 'app', id: APP_ID.EDGE },
            { type: 'app', id: APP_ID.STORE },
            { type: 'app', id: APP_ID.EXPLORER },
            { type: 'app', id: APP_ID.COPILOT },
            { type: 'app', id: APP_ID.VSCODE },
            { type: 'app', id: APP_ID.NOTEPAD },
            { type: 'app', id: APP_ID.CALCULATOR },
            { type: 'app', id: APP_ID.SETTINGS }
        ],
        
        taskbarPinnedApps: [APP_ID.EXPLORER, APP_ID.EDGE, APP_ID.STORE, APP_ID.VSCODE],
        
        dragOffset: { x: 0, y: 0 }, 
        contextMenu: { isOpen: false, x: 0, y: 0, targetId: null, source: null, targetIndex: null, parentFolderId: null },
        modal: null,
        
        // --- VFS ---
        vfs: {
            'home': [
                { id: 'desktop', label: 'Desktop', type: 'folder', icon: 'monitor' },
                { id: 'documents', label: 'Documents', type: 'folder', icon: 'file-text' },
                { id: 'downloads', label: 'Downloads', type: 'folder', icon: 'download' },
                { id: 'pictures', label: 'Pictures', type: 'folder', icon: 'image' },
                { id: 'system', label: 'System (C:)', type: 'folder', icon: 'hard-drive' }
            ],
            'documents': [
                { id: 'project-plan', label: 'Project Plan.txt', type: 'file', size: '12 KB', app: APP_ID.NOTEPAD },
                { id: 'notes', label: 'Meeting Notes.txt', type: 'file', size: '4 KB', app: APP_ID.NOTEPAD }
            ],
            'downloads': [
                { id: 'installer', label: 'setup.exe', type: 'file', size: '450 MB', icon: 'box' },
                { id: 'image1', label: 'wallpaper.jpg', type: 'file', size: '2.4 MB', icon: 'image' }
            ],
            'pictures': [
                { id: 'vacation', label: 'Vacation.png', type: 'file', size: '3.1 MB', icon: 'image' }
            ],
            'system': [
                { id: APP_ID.EDGE, label: "msedge.exe", type: 'app', icon: 'globe' },
                { id: APP_ID.STORE, label: "WinStore.App.exe", type: 'app', icon: 'shopping-bag' },
                { id: APP_ID.EXPLORER, label: "explorer.exe", type: 'app', icon: 'folder-open' },
                { id: APP_ID.NOTEPAD, label: "notepad.exe", type: 'app', icon: 'file-text' },
                { id: APP_ID.CALCULATOR, label: "calc.exe", type: 'app', icon: 'calculator' },
                { id: APP_ID.VSCODE, label: "code.exe", type: 'app', icon: 'code' },
                { id: APP_ID.SETTINGS, label: "settings.exe", type: 'app', icon: 'settings' },
                { id: APP_ID.COPILOT, label: "copilot.exe", type: 'app', icon: 'bot' }
            ]
        },

        appStates: {
            browser: { tabs: [], activeTabId: 1, history: [] },
            notepad: { text: '' },
            explorer: { currentPath: 'home' }
        }
    },
    get t() { return TRANSLATIONS[this.state.language]; }
};
