import { Store } from '../store.js';
import { APP_ID, ICONS, COLORS } from '../config.js';
import * as WindowManager from './windowManager.js';
import { CalculatorApp } from '../apps/calculator.js';
import { NotepadApp } from '../apps/notepad.js';
import { BrowserApp } from '../apps/browser.js';
import { SettingsApp } from '../apps/settings.js';
import { CopilotApp } from '../apps/copilot.js';
import { ExplorerApp } from '../apps/explorer.js';
import { StoreApp } from '../apps/store.js';
import { WebApp } from '../apps/webApp.js';
import { SnakeApp } from '../apps/snake.js';
import { TetrisApp } from '../apps/tetris.js';

const GRID_CELL = { w: 96, h: 104 };
const GRID_GAP = { x: 8, y: 8 };

export function init() {
    const root = document.getElementById('root');
    root.innerHTML = `
        <div id="desktop-area" class="absolute inset-0 w-full h-[calc(100%-48px)] z-0">
            <div id="desktop-icons" class="w-full h-full relative"></div>
        </div>
        <div id="windows-container"></div>
        <div id="start-menu-container"></div>
        <div id="taskbar-container"></div>
        <div id="context-menu-container"></div>
        <div id="modal-container"></div>
        <div id="properties-modal-container"></div>
    `;
    updateRootStyles();
    renderAll();
    setInterval(updateClock, 1000);
    
    // --- EVENT LISTENERS GLOBAIS ---
    
    // 1. Tema mudou (vinda do Settings)
    document.addEventListener('system-theme-change', () => {
        updateRootStyles();
    });

    // 2. Idioma mudou (vinda do Settings)
    document.addEventListener('system-lang-change', () => {
        renderAll(); // Re-renderiza tudo para traduzir
    });

    // 3. Cliques
    document.addEventListener('click', (e) => {
        const clickInsideMenu = e.target.closest('#start-menu-shell');
        const clickOnStartBtn = e.target.closest('#btn-start');
        if (!clickInsideMenu && !clickOnStartBtn) {
            if (Store.state.isStartOpen) closeStartMenu();
        }
        if (Store.state.contextMenu.isOpen && !e.target.closest('#context-menu')) {
            Store.state.contextMenu.isOpen = false; renderContextMenu();
        }
        if (Store.state.openFolderId && e.target.classList.contains('folder-overlay-bg')) {
            e.stopPropagation(); Store.state.openFolderId = null; renderStartMenuContent(); 
        }
    });

    document.addEventListener('explorer-context', (e) => {
        const { x, y, file, currentPath } = e.detail;
        Store.state.contextMenu = { isOpen: true, x, y, targetId: file.id, source: 'explorer_file', targetIndex: file, parentFolderId: currentPath };
        renderContextMenu();
    });

    const rootEl = document.getElementById('root');
    rootEl.addEventListener('contextmenu', (e) => {
        if(e.target.closest('.pinned-item') || e.target.closest('.folder-item') || e.target.closest('.desktop-item')) return;
        e.preventDefault();
        if (e.target.id === 'desktop-area' || e.target.id === 'desktop-icons') { handleContextMenu(e, null, 'desktop_bg'); }
    });

    const desktopArea = document.getElementById('desktop-area');
    desktopArea.ondragover = (e) => e.preventDefault();
    desktopArea.ondrop = (e) => handleDesktopDrop(e);
}

export function renderAll() {
    renderDesktopIcons();
    renderTaskbar();
    if(Store.state.isStartOpen) renderStartMenu();
    renderWindows();
}

export function updateRootStyles() {
    const root = document.getElementById('root');
    root.style.backgroundImage = `url(${Store.state.wallpaper})`;
    if (Store.state.isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
}

// --- AUXILIAR ---
export function findNextDesktopPosition() {
    for (let col = 0; col < 12; col++) {
        for (let row = 0; row < 8; row++) {
            const testX = (col * GRID_CELL.w) + GRID_GAP.x;
            const testY = (row * GRID_CELL.h) + GRID_GAP.y;
            const isOccupied = Store.state.desktopItems.some(d => Math.abs(d.x - testX) < 10 && Math.abs(d.y - testY) < 10);
            if (!isOccupied) return { x: testX, y: testY };
        }
    }
    return { x: 8, y: 8 };
}

function refreshAllViews() {
    renderDesktopIcons();
    const explorerWindow = document.getElementById(`window-${APP_ID.EXPLORER}`);
    if (explorerWindow) new ExplorerApp(explorerWindow.querySelector('.window-content'));
    const storeWindow = document.getElementById(`window-${APP_ID.STORE}`);
    if (storeWindow) new StoreApp(storeWindow.querySelector('.window-content'));
    if(Store.state.isStartOpen) renderStartMenuContent();
}

// --- WINDOWS ---
export function renderWindows() {
    const container = document.getElementById('windows-container');
    Array.from(container.children).forEach(el => {
        const id = el.id.replace('window-', '');
        if(!Store.state.windows.find(w => w.id === id)) el.remove();
    });
    Store.state.windows.forEach(win => {
        if (win.isMinimized) {
            const el = document.getElementById(`window-${win.id}`);
            if(el) el.style.display = 'none';
            return;
        }
        let el = document.getElementById(`window-${win.id}`);
        const isNew = !el;
        if (isNew) {
            const tmpl = document.getElementById('window-template').content.cloneNode(true);
            el = tmpl.querySelector('div');
            el.id = `window-${win.id}`;
            container.appendChild(el);
            const contentArea = el.querySelector('.window-content');
            
            try {
                if (win.id === APP_ID.CALCULATOR) new CalculatorApp(contentArea);
                else if (win.id === APP_ID.NOTEPAD) new NotepadApp(contentArea);
                else if (win.id === APP_ID.EDGE) new BrowserApp(contentArea);
                else if (win.id === APP_ID.SETTINGS) new SettingsApp(contentArea);
                else if (win.id === APP_ID.COPILOT) new CopilotApp(contentArea);
                else if (win.id === APP_ID.EXPLORER) new ExplorerApp(contentArea);
                else if (win.id === APP_ID.STORE) new StoreApp(contentArea);
                else if (win.id === APP_ID.SNAKE) new SnakeApp(contentArea);
                else if (win.id === APP_ID.TETRIS) new TetrisApp(contentArea);
                else if (win.id === APP_ID.VSCODE) contentArea.innerHTML = `<iframe src="https://vscode.dev" class="w-full h-full border-none"></iframe>`;
                else {
                    const isWebApp = Store.state.storeCatalogue.some(app => app.id === win.id);
                    if(isWebApp) { new WebApp(contentArea, win.id); } 
                    else { contentArea.innerHTML = `<div class="p-4 text-red-500">App content not found.</div>`; }
                }
            } catch (error) { console.error(error); contentArea.innerHTML = `<div class="p-4 text-red-500">Error loading app.</div>`; }

            el.querySelector('.btn-minimize').onclick = (e) => { e.stopPropagation(); WindowManager.minimizeWindow(win.id); };
            el.querySelector('.btn-maximize').onclick = (e) => { e.stopPropagation(); WindowManager.maximizeWindow(win.id); };
            el.querySelector('.btn-close').onclick = (e) => { e.stopPropagation(); WindowManager.closeWindow(win.id); };
            el.onmousedown = () => WindowManager.focusWindow(win.id);
            el.querySelector('.window-titlebar').onmousedown = (e) => WindowManager.startDrag(e, win.id);
        }
        el.style.display = 'flex';
        el.style.zIndex = win.zIndex;
        el.querySelector('.window-title').textContent = win.title;
        
        let iconName = ICONS[win.id];
        let color = COLORS[win.id];
        if(!color) color = 'text-gray-500';
        if (!iconName && Store.state.storeCatalogue) {
             const webApp = Store.state.storeCatalogue.find(a => a.id === win.id);
             if (webApp) { iconName = ICONS[webApp.id] || 'box'; color = COLORS[webApp.id] || 'text-gray-500'; }
        }
        el.querySelector('.window-icon').innerHTML = `<i data-lucide="${iconName || 'box'}" class="${color} w-full h-full"></i>`;

        if (win.isMaximized) {
            el.style.inset = '0'; el.style.width = '100%'; el.style.height = 'calc(100% - 48px)'; el.classList.remove('rounded-lg');
        } else {
            el.classList.add('rounded-lg'); el.style.left = win.position.x + 'px'; el.style.top = win.position.y + 'px'; el.style.width = win.size.width + 'px'; el.style.height = win.size.height + 'px';
        }
    });
    if(window.lucide) lucide.createIcons();
}

// --- START MENU ---
function closeStartMenu() {
    Store.state.isStartOpen = false;
    Store.state.openFolderId = null;
    Store.state.startMenuView = 'pinned';
    Store.state.startMenuSearch = '';
    document.getElementById('start-menu-container').innerHTML = ''; 
    renderTaskbar();
}

export function renderStartMenu() {
    const container = document.getElementById('start-menu-container');
    if (!Store.state.isStartOpen) { container.innerHTML = ''; return; }
    if (document.getElementById('start-menu-shell')) { renderStartMenuContent(); return; }
    const t = Store.t.startMenu;
    container.innerHTML = `
    <div id="start-menu-shell" class="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-[640px] h-[700px] bg-[#f3f3f3]/95 dark:bg-[#202020]/95 backdrop-blur-xl rounded-lg border border-gray-200/50 dark:border-black/50 shadow-2xl flex flex-col z-50 animate-slide-up">
        <div class="p-6 pb-2"><div class="bg-white dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 rounded-full h-10 flex items-center px-4 shadow-sm focus-within:border-blue-500 focus-within:ring-2 ring-blue-500/20 transition-colors"><i data-lucide="search" class="w-4 h-4 text-gray-500 mr-3"></i><input type="text" id="start-search-input" placeholder="${t.searchPlaceholder}" class="bg-transparent w-full outline-none text-sm dark:text-white" autocomplete="off" value="${Store.state.startMenuSearch}"><i data-lucide="x" class="w-4 h-4 text-gray-500 cursor-pointer hidden" id="clear-search-btn"></i></div></div>
        <div id="start-content" class="flex-1 flex flex-col overflow-hidden relative"></div>
        <div class="h-16 bg-gray-100/50 dark:bg-[#1f1f1f] border-t border-gray-200 dark:border-white/5 rounded-b-lg flex justify-between items-center px-8"><div class="flex items-center gap-3 hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded cursor-pointer transition-colors"><div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold pointer-events-none">${Store.t.startMenu.user.charAt(0)}</div><span class="text-xs font-medium dark:text-white pointer-events-none">${Store.t.startMenu.user}</span></div><button class="p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded transition-colors"><i data-lucide="power" class="w-5 h-5 dark:text-white pointer-events-none"></i></button></div>
    </div>`;
    const input = document.getElementById('start-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    setTimeout(() => input.focus(), 50);
    input.onclick = (e) => e.stopPropagation();
    input.oninput = (e) => {
        const val = e.target.value;
        Store.state.startMenuSearch = val;
        if (val.length > 0) { Store.state.startMenuView = 'search'; clearBtn.classList.remove('hidden'); } 
        else { Store.state.startMenuView = 'pinned'; clearBtn.classList.add('hidden'); }
        renderStartMenuContent(); 
    };
    clearBtn.onclick = (e) => { e.stopPropagation(); Store.state.startMenuSearch = ''; Store.state.startMenuView = 'pinned'; input.value = ''; clearBtn.classList.add('hidden'); input.focus(); renderStartMenuContent(); };
    renderStartMenuContent();
    if(window.lucide) window.lucide.createIcons();
}

function renderStartMenuContent() {
    const contentEl = document.getElementById('start-content');
    if (!contentEl) return;
    const t = Store.t.startMenu;
    const view = Store.state.startMenuView;
    let html = '';
    if (view === 'search') {
        const query = Store.state.startMenuSearch.toLowerCase();
        const allApps = Object.keys(APP_ID).map(id => ({ id, label: Store.t.apps[id], icon: ICONS[id], color: COLORS[id] }));
        const results = allApps.filter(app => app.label.toLowerCase().includes(query));
        let listHtml = results.length > 0 ? results.map(app => `<div class="app-result flex items-center gap-4 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer transition-colors" data-id="${app.id}"><div class="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#333] rounded-lg shadow-sm pointer-events-none"><i data-lucide="${app.icon}" class="${app.color} w-6 h-6"></i></div><div class="flex flex-col pointer-events-none"><span class="text-sm dark:text-white font-medium">${app.label}</span><span class="text-xs text-gray-500">App</span></div></div>`).join('') : `<div class="text-center text-gray-500 mt-10">No results for "${Store.state.startMenuSearch}"</div>`;
        html = `<div class="flex-1 p-8 pt-4 overflow-y-auto animate-in fade-in"><h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Best match</h3><div class="flex flex-col gap-1">${listHtml}</div></div>`;
    } else if (view === 'all') {
        const allApps = Object.keys(APP_ID).map(id => ({ id, label: Store.t.apps[id], icon: ICONS[id], color: COLORS[id] })).sort((a,b) => a.label.localeCompare(b.label));
        const listHtml = allApps.map(app => `<div class="app-result flex items-center gap-4 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer transition-colors" data-id="${app.id}"><div class="w-8 h-8 flex items-center justify-center pointer-events-none"><i data-lucide="${app.icon}" class="${app.color} w-6 h-6"></i></div><span class="text-sm dark:text-white font-medium pointer-events-none">${app.label}</span></div>`).join('');
        html = `<div class="flex-1 p-8 pt-4 overflow-y-auto animate-in slide-in-from-right-4 fade-in"><div class="flex justify-between items-center mb-4"><div class="flex items-center gap-2"><button id="btn-back-pinned" class="h-8 px-3 bg-white dark:bg-[#333] rounded-md shadow-sm dark:text-white flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#444] transition-colors text-xs font-medium"><i data-lucide="chevron-left" class="w-4 h-4 pointer-events-none"></i> Back</button><h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">${t.allApps}</h3></div></div><div class="flex flex-col gap-1">${listHtml}</div></div>`;
    } else {
        html = `<div class="flex-1 p-8 pt-4 overflow-y-auto relative animate-in fade-in"><div class="flex justify-between items-center mb-4"><h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">${t.pinned}</h3><button id="btn-all-apps" class="h-8 px-3 bg-white dark:bg-[#333] rounded-md shadow-sm dark:text-white flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#444] transition-colors text-xs font-medium">${t.allApps} <i data-lucide="chevron-right" class="w-4 h-4 pointer-events-none"></i></button></div><div class="grid grid-cols-6 gap-2 min-h-[200px]" id="pinned-grid"></div><div id="folder-mount"></div></div><div class="px-8 pb-8 animate-in fade-in"><div class="flex justify-between items-center mb-4"><h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">${t.recommended}</h3><button class="text-xs bg-white dark:bg-[#333] px-2 py-1 rounded shadow-sm dark:text-white">${t.more}</button></div><div class="flex items-center gap-3 p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded cursor-pointer transition-colors"><div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs pointer-events-none">CV</div><div><div class="text-xs font-medium dark:text-white pointer-events-none">Curriculo_Dev.pdf</div><div class="text-[10px] text-gray-500 pointer-events-none">12 min ago</div></div></div></div>`;
    }
    contentEl.innerHTML = html;
    const btnAll = document.getElementById('btn-all-apps'); if(btnAll) btnAll.onclick = (e) => { e.stopPropagation(); Store.state.startMenuView = 'all'; renderStartMenuContent(); };
    const btnBack = document.getElementById('btn-back-pinned'); if(btnBack) btnBack.onclick = (e) => { e.stopPropagation(); Store.state.startMenuView = 'pinned'; renderStartMenuContent(); };
    contentEl.querySelectorAll('.app-result').forEach(el => { el.onclick = () => { WindowManager.openApp(el.dataset.id); closeStartMenu(); }; });
    if (view === 'pinned') {
        if (Store.state.openFolderId) { renderPinnedItems(true); const folderMount = document.getElementById('folder-mount'); if(folderMount) folderMount.innerHTML = renderFolderOverlayHtml(); bindFolderEvents(); } 
        else { renderPinnedItems(false); const grid = document.getElementById('pinned-grid'); if(grid) { grid.ondragover = (e) => e.preventDefault(); grid.ondrop = (e) => handleUngroupDrop(e); } }
    }
    if(window.lucide) window.lucide.createIcons({ root: contentEl });
}

function renderPinnedItems(isBackground = false) {
    const grid = document.getElementById('pinned-grid');
    if(!grid) return;
    Store.state.pinnedItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `pinned-item relative flex flex-col items-center justify-center gap-2 p-2 rounded hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer group h-24 ${isBackground ? 'opacity-30 pointer-events-none' : ''}`;
        if(!isBackground) div.draggable = true;
        div.ondragstart = (e) => { e.dataTransfer.setData('text/plain', JSON.stringify({ index, type: 'main' })); div.style.opacity = '0.5'; };
        div.ondragend = () => { div.style.opacity = '1'; };
        div.ondragover = (e) => e.preventDefault();
        div.ondrop = (e) => handleMainDrop(e, index);
        if (item.type === 'app') {
            const displayName = item.label || Store.t.apps[item.id];
            div.innerHTML = `<i data-lucide="${ICONS[item.id]}" class="${COLORS[item.id]} w-8 h-8 mb-1 pointer-events-none"></i><span class="text-[11px] text-center dark:text-white leading-tight line-clamp-2 pointer-events-none">${displayName}</span>`;
            div.onclick = () => { WindowManager.openApp(item.id); closeStartMenu(); };
            div.oncontextmenu = (e) => { e.stopPropagation(); handleContextMenu(e, item.id, 'start_pinned', index); };
        } else if (item.type === 'folder') {
            const appsPreview = item.items.slice(0, 4).map(subItem => `<div class="flex items-center justify-center"><i data-lucide="${ICONS[subItem.id]}" class="${COLORS[subItem.id]} w-3 h-3 pointer-events-none"></i></div>`).join('');
            div.innerHTML = `<div class="w-12 h-12 bg-white/40 dark:bg-white/10 rounded-lg p-1.5 grid grid-cols-2 gap-1 backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-sm pointer-events-none">${appsPreview}</div><span class="text-[11px] text-center dark:text-white leading-tight mt-1 pointer-events-none">${item.name || Store.t.startMenu.folder}</span>`;
            div.onclick = (e) => { e.stopPropagation(); Store.state.openFolderId = item.id; renderStartMenuContent(); };
            div.oncontextmenu = (e) => { e.stopPropagation(); handleContextMenu(e, item.id, 'folder_container', index); };
        }
        grid.appendChild(div);
    });
}

function renderFolderOverlayHtml() {
    const folder = Store.state.pinnedItems.find(i => i.id === Store.state.openFolderId);
    if (!folder) return '';
    const itemsHtml = folder.items.map((item, idx) => `
        <div class="folder-item flex flex-col items-center justify-center gap-2 p-2 rounded hover:bg-white/50 dark:hover:bg-white/10 transition-colors cursor-pointer w-[76px] h-20" draggable="true" data-folder-idx="${idx}">
            <i data-lucide="${ICONS[item.id]}" class="${COLORS[item.id]} w-8 h-8 mb-1 pointer-events-none"></i>
            <span class="text-[10px] text-center dark:text-white leading-tight line-clamp-1 pointer-events-none w-full truncate">${item.label || Store.t.apps[item.id]}</span>
        </div>`).join('');
    return `<div class="folder-overlay-bg absolute inset-0 z-20 flex items-center justify-center animate-in fade-in" style="background-color: rgba(0,0,0,0.2);"><div class="folder-box bg-[#f9f9f9] dark:bg-[#2c2c2c] rounded-xl shadow-2xl p-4 border border-gray-200 dark:border-[#444] w-[340px] animate-in zoom-in" onclick="event.stopPropagation()"><input type="text" value="${folder.name || Store.t.startMenu.folder}" class="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none border-b border-transparent focus:border-blue-500 w-full mb-4 px-1" id="folder-name-input"><div class="flex flex-wrap gap-1 justify-start">${itemsHtml}</div></div></div>`;
}

function bindFolderEvents() {
    const input = document.getElementById('folder-name-input');
    if(input) { input.onchange = (e) => { const f = Store.state.pinnedItems.find(i => i.id === Store.state.openFolderId); if(f) f.name = e.target.value; }; input.onclick = (e) => e.stopPropagation(); }
    document.querySelectorAll('.folder-item').forEach(el => {
        const idx = parseInt(el.dataset.folderIdx);
        el.ondragstart = (e) => { e.dataTransfer.setData('text/plain', JSON.stringify({ index: idx, type: 'folder_item', folderId: Store.state.openFolderId })); e.dataTransfer.effectAllowed = 'move'; };
        el.onclick = (e) => { e.stopPropagation(); const f = Store.state.pinnedItems.find(i => i.id === Store.state.openFolderId); WindowManager.openApp(f.items[idx].id); closeStartMenu(); };
        el.oncontextmenu = (e) => { e.stopPropagation(); const f = Store.state.pinnedItems.find(i => i.id === Store.state.openFolderId); handleContextMenu(e, f.items[idx].id, 'folder_item', idx, Store.state.openFolderId); };
    });
    const overlayBg = document.querySelector('.folder-overlay-bg');
    if(overlayBg) { overlayBg.ondragover = (e) => e.preventDefault(); overlayBg.ondrop = (e) => handleUngroupDrop(e); }
}

function handleUngroupDrop(e) {
    e.preventDefault(); e.stopPropagation();
    try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.type === 'folder_item' && data.folderId) {
            const folder = Store.state.pinnedItems.find(f => f.id === data.folderId);
            if (!folder) return;
            const itemToMove = folder.items[data.index];
            folder.items.splice(data.index, 1);
            Store.state.pinnedItems.push(itemToMove);
            if (folder.items.length === 0) { Store.state.pinnedItems = Store.state.pinnedItems.filter(i => i.id !== data.folderId); Store.state.openFolderId = null; }
            renderStartMenuContent(); 
        }
    } catch (err) {}
}

function handleMainDrop(e, targetIndex) {
    e.preventDefault(); e.stopPropagation();
    try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.type === 'folder_item') {
            const folder = Store.state.pinnedItems.find(f => f.id === data.folderId);
            const itemToMove = folder.items[data.index];
            folder.items.splice(data.index, 1);
            if(folder.items.length === 0) { Store.state.pinnedItems = Store.state.pinnedItems.filter(i => i.id !== data.folderId); Store.state.openFolderId = null; }
            Store.state.pinnedItems.splice(targetIndex, 0, itemToMove);
            renderStartMenuContent();
            return;
        }
        if(data.type !== 'main') return;
        const sourceIndex = data.index;
        if(sourceIndex === targetIndex) return;
        const items = [...Store.state.pinnedItems];
        const source = items[sourceIndex];
        const target = items[targetIndex];
        if (source.type === 'app' && target.type === 'app') {
            items[targetIndex] = { type: 'folder', id: 'folder-' + Date.now(), name: Store.t.startMenu.folder, items: [target, source] };
            items.splice(sourceIndex, 1);
        } else if (source.type === 'app' && target.type === 'folder') {
            target.items.push(source); items.splice(sourceIndex, 1);
        } else {
            items.splice(sourceIndex, 1); items.splice(targetIndex, 0, source);
        }
        Store.state.pinnedItems = items;
        renderStartMenuContent();
    } catch (err) {}
}

// --- DESKTOP & SHARED UTILS ---
function renderDesktopIcons() {
    const container = document.getElementById('desktop-icons');
    container.innerHTML = '';
    Store.state.desktopItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "desktop-item absolute w-[96px] h-[100px] flex flex-col items-center justify-start pt-2 hover:bg-white/10 border border-transparent hover:border-white/20 rounded cursor-default transition-all duration-200 group";
        div.style.left = item.x + 'px';
        div.style.top = item.y + 'px';
        div.draggable = true;
        let iconHtml;
        if(item.customIcon) {
            iconHtml = `<img src="${item.customIcon}" class="w-10 h-10 mb-1 object-contain drop-shadow-md pointer-events-none">`;
        } else {
            const iconName = ICONS[item.id] || 'box';
            const color = COLORS[item.id] || 'text-white';
            iconHtml = `<i data-lucide="${iconName}" class="${color} w-10 h-10 mb-1 drop-shadow-md pointer-events-none"></i>`;
        }
        const shortcutBadge = item.isShortcut 
            ? `<div class="absolute bottom-1 left-2 bg-white dark:bg-[#333] rounded-[2px] shadow-sm border border-gray-300 dark:border-gray-500 w-3.5 h-3.5 flex items-center justify-center pointer-events-none"><i data-lucide="arrow-up-right" class="w-3 h-3 text-blue-600 dark:text-blue-400 stroke-[3]"></i></div>` : '';
        div.innerHTML = `<div class="transition-transform group-active:scale-90 flex items-center justify-center pointer-events-none mb-1 relative">${iconHtml}${shortcutBadge}</div><span class="text-xs text-white text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 leading-tight px-1 select-none pointer-events-none bg-transparent group-hover:bg-black/20 rounded">${item.label}</span>`;
        div.ondblclick = () => WindowManager.openApp(item.id);
        div.oncontextmenu = (e) => { e.stopPropagation(); handleContextMenu(e, item.id, 'desktop_item', index); };
        div.ondragstart = (e) => {
            const rect = div.getBoundingClientRect();
            Store.state.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            e.dataTransfer.setData('text/plain', JSON.stringify({ index, type: 'desktop_icon' }));
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => div.classList.add('opacity-50'), 0);
        };
        div.ondragend = () => { div.classList.remove('opacity-50'); };
        container.appendChild(div);
    });
    lucide.createIcons();
}

function handleDesktopDrop(e) {
    e.preventDefault();
    try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if(data.type !== 'desktop_icon') return;
        const item = Store.state.desktopItems[data.index];
        let rawX = e.clientX - Store.state.dragOffset.x;
        let rawY = e.clientY - Store.state.dragOffset.y;
        let col = Math.round((rawX - GRID_GAP.x) / GRID_CELL.w);
        let row = Math.round((rawY - GRID_GAP.y) / GRID_CELL.h);
        if(col < 0) col = 0; if(row < 0) row = 0;
        let snappedX = (col * GRID_CELL.w) + GRID_GAP.x;
        let snappedY = (row * GRID_CELL.h) + GRID_GAP.y;
        if(snappedY > window.innerHeight - 60) snappedY = (Math.floor((window.innerHeight - 60) / GRID_CELL.h) * GRID_CELL.h) + GRID_GAP.y;
        const isOccupied = Store.state.desktopItems.some((other, idx) => idx !== data.index && Math.abs(other.x - snappedX) < 10 && Math.abs(other.y - snappedY) < 10);
        if (!isOccupied) { item.x = snappedX; item.y = snappedY; }
        refreshAllViews();
    } catch(err) {}
}

function renderModal(title, initialValue, onConfirm) {
    const container = document.getElementById('modal-container');
    const t = Store.t.contextMenu;
    container.innerHTML = `
    <div class="absolute inset-0 z-[10001] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in">
        <div class="bg-[#f3f3f3] dark:bg-[#2c2c2c] p-6 rounded-lg shadow-2xl w-96 border border-gray-200 dark:border-gray-600 animate-in zoom-in">
            <h3 class="font-semibold mb-4 dark:text-white text-lg">${title}</h3>
            <input type="text" value="${initialValue}" class="w-full p-2.5 mb-6 rounded border bg-white dark:bg-[#1f1f1f] border-gray-300 dark:border-gray-600 dark:text-white outline-none focus:border-blue-500" id="modal-input" autofocus>
            <div class="flex justify-end gap-3">
                <button class="px-4 py-2 text-sm bg-white hover:bg-gray-100 dark:bg-[#333] dark:hover:bg-[#444] rounded dark:text-white border border-gray-300 dark:border-gray-600 transition-colors" id="btn-cancel">${t.cancel}</button>
                <button class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors" id="btn-confirm">${t.save}</button>
            </div>
        </div>
    </div>`;
    const input = document.getElementById('modal-input');
    input.focus(); input.select();
    const close = () => { container.innerHTML = ''; };
    document.getElementById('btn-cancel').onclick = close;
    document.getElementById('btn-confirm').onclick = () => { const val = input.value; if(val) onConfirm(val); close(); };
    input.onkeyup = (e) => { if(e.key === 'Enter') document.getElementById('btn-confirm').click(); };
}

function renderPropertiesModal(item) {
    const container = document.getElementById('properties-modal-container');
    const t = Store.t.properties;
    const iconName = ICONS[item.id] || 'file';
    const type = item.isShortcut ? t.shortcut : (item.type || 'Application');
    const location = item.isShortcut ? 'C:\\Users\\User\\Desktop' : 'C:\\Program Files\\WindowsApps';
    const size = item.size || '4 KB';
    const created = new Date().toLocaleDateString();

    container.innerHTML = `
    <div class="absolute inset-0 z-[10002] flex items-center justify-center pointer-events-none">
        <div class="bg-white dark:bg-[#2c2c2c] w-[380px] rounded-lg shadow-2xl border border-gray-200 dark:border-[#444] pointer-events-auto animate-in zoom-in flex flex-col font-sans text-xs select-none">
            <div class="h-8 flex items-center justify-between px-3 border-b border-gray-200 dark:border-[#444]">
                <span class="font-medium dark:text-white">${item.label} ${Store.t.contextMenu.properties}</span>
                <button class="w-8 h-8 hover:bg-red-500 hover:text-white flex items-center justify-center rounded" id="btn-close-prop"><i data-lucide="x" class="w-3.5 h-3.5 pointer-events-none"></i></button>
            </div>
            <div class="h-9 flex items-center bg-white dark:bg-[#2c2c2c] px-2 pt-2 gap-1 border-b border-gray-200 dark:border-[#444]">
                <div class="bg-white dark:bg-[#333] border-t border-x border-gray-200 dark:border-[#444] px-4 py-1.5 rounded-t dark:text-white relative top-[1px] z-10">${t.general}</div>
                <div class="px-4 py-1.5 text-gray-500 dark:text-gray-400">Shortcut</div>
            </div>
            <div class="p-4 flex flex-col gap-4 dark:text-white bg-white dark:bg-[#333] m-2 border border-gray-200 dark:border-[#444] shadow-sm">
                <div class="flex items-center gap-4 mb-2"><div class="w-12 h-12 flex items-center justify-center"><i data-lucide="${iconName}" class="${COLORS[item.id] || 'text-gray-500'} w-10 h-10"></i></div><div class="flex flex-col gap-1 w-full"><input type="text" value="${item.label}" class="border border-gray-300 dark:border-gray-500 dark:bg-[#222] px-2 py-1 w-full outline-none"></div></div>
                <div class="h-[1px] bg-gray-300 dark:bg-gray-600"></div>
                <div class="grid grid-cols-[80px_1fr] gap-y-2"><span class="text-gray-500">${t.type}</span> <span>${type}</span><span class="text-gray-500">${t.loc}</span> <span>${location}</span><span class="text-gray-500">${t.size}</span> <span>${size}</span></div>
                <div class="h-[1px] bg-gray-300 dark:bg-gray-600"></div>
                <div class="grid grid-cols-[80px_1fr] gap-y-2"><span class="text-gray-500">${t.created}</span> <span>${created}</span><span class="text-gray-500">${t.modified}</span> <span>${created}</span></div>
            </div>
            <div class="p-3 bg-[#f0f0f0] dark:bg-[#252525] flex justify-end gap-2 border-t border-gray-200 dark:border-[#444] rounded-b-lg"><button class="px-5 py-1 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-500 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-[#444]" onclick="document.getElementById('properties-modal-container').innerHTML = ''">OK</button><button class="px-5 py-1 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-500 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-[#444]" onclick="document.getElementById('properties-modal-container').innerHTML = ''">${Store.t.contextMenu.cancel}</button></div>
        </div>
    </div>`;
    lucide.createIcons();
    document.getElementById('btn-close-prop').onclick = () => { container.innerHTML = ''; };
}

function uninstallApp(appId) {
    Store.state.installedApps = Store.state.installedApps.filter(id => id !== appId);
    Store.state.vfs.system = Store.state.vfs.system.filter(file => file.id !== appId);
    Store.state.desktopItems = Store.state.desktopItems.filter(item => item.id !== appId);
    Store.state.pinnedItems = Store.state.pinnedItems.filter(item => {
        if (item.type === 'app') return item.id !== appId;
        if (item.type === 'folder') { item.items = item.items.filter(sub => sub.id !== appId); return item.items.length > 0; }
        return true;
    });
    Store.state.taskbarPinnedApps = Store.state.taskbarPinnedApps.filter(id => id !== appId);
    WindowManager.closeWindow(appId);
    refreshAllViews();
}

function handleContextMenu(e, id, source, index = null, parentFolderId = null) {
    e.preventDefault();
    Store.state.contextMenu = { isOpen: true, x: e.clientX, y: e.clientY, targetId: id, source, targetIndex: index, parentFolderId };
    renderContextMenu();
}

function renderContextMenu() {
    const container = document.getElementById('context-menu-container');
    const { isOpen, x, y, targetId, source, targetIndex, parentFolderId } = Store.state.contextMenu;
    if (!isOpen) { container.innerHTML = ''; return; }
    const t = Store.t.contextMenu;
    let items = [];

    if (source === 'explorer_file') {
        const file = targetIndex;
        items = [
            { label: t.open, icon: 'app-window', action: () => WindowManager.openApp(file.app || file.id) },
            { divider: true },
            { 
                label: t.createShortcut, icon: 'arrow-up-right-square', 
                action: () => {
                    const pos = findNextDesktopPosition();
                    Store.state.desktopItems.push({
                        id: file.id, label: Store.t.apps[file.id] || file.label, x: pos.x, y: pos.y, isShortcut: true, targetPath: parentFolderId
                    });
                    refreshAllViews();
                }
            },
            { divider: true }
        ];
        if (file.isWebApp) {
            items.push({ label: t.uninstall, icon: 'trash-2', danger: true, action: () => uninstallApp(file.id) });
        } else {
            items.push({ 
                label: t.delete, icon: 'trash-2', danger: true, 
                action: () => { 
                    if(parentFolderId === 'desktop') { Store.state.desktopItems = Store.state.desktopItems.filter(i => i !== file); refreshAllViews(); } 
                    else { const folder = Store.state.vfs[parentFolderId]; const idx = folder.indexOf(file); if(idx > -1) folder.splice(idx, 1); refreshAllViews(); } 
                } 
            });
        }
        items.push({ divider: true });
        items.push({ label: t.properties, icon: 'sliders-horizontal', action: () => renderPropertiesModal(file) });
    }
    else if(source === 'desktop_item' && targetId) {
        const item = Store.state.desktopItems[targetIndex];
        const isPinnedStart = Store.state.pinnedItems.some(pi => pi.id === targetId && pi.type === 'app');
        const isPinnedTaskbar = Store.state.taskbarPinnedApps.includes(targetId);

        items = [
            { label: t.open, icon: 'app-window', action: () => WindowManager.openApp(targetId) },
            { label: t.openFileLocation, icon: 'folder-open', disabled: !item.isShortcut, action: () => { const targetPath = item.targetPath || 'system'; Store.state.appStates.explorer.currentPath = targetPath; WindowManager.openApp(APP_ID.EXPLORER); const win = document.getElementById(`window-${APP_ID.EXPLORER}`); if(win) new ExplorerApp(win.querySelector('.window-content')); } },
            { divider: true },
            { label: t.pinToStart, icon: 'pin', disabled: isPinnedStart, action: () => { 
                if(!isPinnedStart) { 
                    Store.state.pinnedItems.push({type: 'app', id: targetId, label: item.label}); 
                    renderStartMenu(); 
                }
            }},
            { label: t.pinToTaskbar, icon: 'layout-template', disabled: isPinnedTaskbar, action: () => { if(!isPinnedTaskbar) { Store.state.taskbarPinnedApps.push(targetId); renderTaskbar(); }}},
            { divider: true },
            { label: t.rename, icon: 'pencil', action: () => renderModal(t.enterName, item.label, (val) => { item.label = val; refreshAllViews(); }) },
            { label: t.changeIcon, icon: 'image', action: () => renderModal(t.enterUrl, item.customIcon || '', (val) => { item.customIcon = val; refreshAllViews(); }) },
            { label: t.delete, icon: 'trash-2', danger: true, action: () => { Store.state.desktopItems.splice(targetIndex, 1); refreshAllViews(); }},
            { divider: true },
            { label: t.properties, icon: 'sliders-horizontal', action: () => renderPropertiesModal(item) }
        ];
    }
    else if (source === 'desktop_bg') {
        items = [ { label: 'Refresh', icon: 'rotate-cw', action: () => refreshAllViews() }, { label: 'Personalize', icon: 'paintbrush', action: () => WindowManager.openApp(APP_ID.SETTINGS) } ];
    }
    else if (source === 'taskbar') {
        const isPinned = Store.state.taskbarPinnedApps.includes(targetId);
        const isOpen = Store.state.windows.some(w => w.id === targetId);
        if (!isOpen) items.push({ label: t.open, icon: 'app-window', action: () => WindowManager.openApp(targetId) });
        items.push({ label: isPinned ? t.unpinFromTaskbar : t.pinToTaskbar, icon: isPinned ? 'pin-off' : 'pin', action: () => { if(isPinned) Store.state.taskbarPinnedApps = Store.state.taskbarPinnedApps.filter(id => id !== targetId); else Store.state.taskbarPinnedApps.push(targetId); renderTaskbar(); }});
        if (isOpen) { items.push({ divider: true }); items.push({ label: t.closeWindow, icon: 'x', action: () => WindowManager.closeWindow(targetId) }); }
        items.push({ divider: true });
        items.push({ label: t.properties, icon: 'sliders-horizontal', action: () => renderPropertiesModal({id: targetId, label: Store.t.apps[targetId], isShortcut: true}) });
    }
    else if (source === 'start_pinned') {
        items = [ { label: t.open, icon: 'app-window', action: () => { WindowManager.openApp(targetId); closeStartMenu(); } }, { label: t.unpinFromStart, icon: 'pin-off', action: () => { Store.state.pinnedItems.splice(targetIndex, 1); renderStartMenuContent(); }} ];
    } 
    else if (source === 'folder_container') {
        items = [{ label: t.delete, icon: 'trash-2', danger: true, action: () => { Store.state.pinnedItems.splice(targetIndex, 1); renderStartMenuContent(); }}];
    } 
    else if (source === 'folder_item') {
        items = [ { label: t.open, icon: 'app-window', action: () => { WindowManager.openApp(targetId); closeStartMenu(); }}, { label: t.removeFromFolder, icon: 'folder-minus', action: () => { const folder = Store.state.pinnedItems.find(f => f.id === parentFolderId); const itemToRemove = folder.items[targetIndex]; folder.items.splice(targetIndex, 1); Store.state.pinnedItems.push(itemToRemove); if(folder.items.length === 0) { Store.state.pinnedItems = Store.state.pinnedItems.filter(i => i.id !== parentFolderId); Store.state.openFolderId = null; } renderStartMenuContent(); }} ];
    }

    if (items.length === 0) return;
    const w = 240; const h = items.length * 40;
    const finalX = (x + w > window.innerWidth) ? x - w : x;
    const finalY = (y + h > window.innerHeight) ? y - h : y;
    container.innerHTML = `
    <div id="context-menu" class="absolute z-[10000] w-[240px] bg-[#f9f9f9]/95 dark:bg-[#2c2c2c]/95 backdrop-blur-xl border border-gray-200 dark:border-[#333] rounded-lg shadow-xl p-1.5 animate-in zoom-in" style="top: ${finalY}px; left: ${finalX}px">
        ${items.map((i, idx) => {
            if(i.divider) return `<div class="h-[1px] bg-gray-300 dark:bg-gray-600 my-1 mx-2"></div>`;
            return `<button class="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-white/10 flex items-center gap-3 group ${i.danger ? 'text-red-600 dark:text-red-400 hover:!bg-red-500 hover:!text-white' : ''} ${i.disabled ? 'opacity-50 cursor-not-allowed' : ''}" data-idx="${idx}" ${i.disabled ? 'disabled' : ''}><i data-lucide="${i.icon}" class="w-4 h-4 ${i.danger ? 'text-current' : 'text-gray-500 dark:text-gray-400 group-hover:text-white pointer-events-none'}"></i><span class="pointer-events-none">${i.label}</span></button>`;
        }).join('')}
    </div>`;
    container.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => { items[btn.dataset.idx].action(); Store.state.contextMenu.isOpen = false; renderContextMenu(); };
    });
    lucide.createIcons();
}

export function renderTaskbar() {
    const container = document.getElementById('taskbar-container');
    const t = Store.t.taskbar;
    const openIds = Store.state.windows.map(w => w.id);
    const allApps = [...new Set([...Store.state.taskbarPinnedApps, ...openIds])];
    container.innerHTML = `
    <div class="absolute bottom-0 left-0 w-full h-12 bg-white/85 dark:bg-[#202020]/90 backdrop-blur-md border-t border-gray-200/50 dark:border-white/5 flex justify-between items-center px-2 z-[9999]">
        <div class="hidden md:flex w-48 pl-2"><span class="text-xs text-gray-600 dark:text-gray-300">26°C ${t.widgets}</span></div>
        <div class="flex items-center gap-1 h-full" id="taskbar-icons"><button id="btn-start" class="h-10 w-10 rounded hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center ${Store.state.isStartOpen ? 'bg-white/40' : ''}"><i data-lucide="layout-grid" class="w-6 h-6 text-blue-600 pointer-events-none"></i></button></div>
        <div class="flex items-center gap-2 pr-2"><div class="text-right"><div id="clock-time" class="text-xs font-medium dark:text-white"></div><div id="clock-date" class="text-[10px] text-gray-500"></div></div></div>
    </div>`;
    document.getElementById('btn-start').onclick = (e) => { e.stopPropagation(); Store.state.isStartOpen = !Store.state.isStartOpen; renderStartMenu(); renderTaskbar(); };
    const iconsContainer = document.getElementById('taskbar-icons');
    allApps.forEach(id => {
        const isOpen = Store.state.windows.some(w => w.id === id);
        const isActive = isOpen && Store.state.windows.find(w => w.id === id).zIndex === Store.state.nextZIndex;
        const btn = document.createElement('button');
        btn.className = `relative h-10 w-10 rounded hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center group ${isOpen?'bg-white/30 dark:bg-white/5':''}`;
        let iconName = ICONS[id];
        let color = COLORS[id];
        if(!iconName) {
             const webApp = Store.state.storeCatalogue.find(a => a.id === id);
             if(webApp) { iconName = ICONS[webApp.id] || 'box'; color = COLORS[webApp.id] || 'text-gray-500'; } 
             else { iconName = 'box'; color = 'text-gray-500'; }
        }
        btn.innerHTML = `<i data-lucide="${iconName}" class="${color} w-6 h-6 transform group-hover:-translate-y-1 transition-transform pointer-events-none"></i>${isOpen ? `<div class="absolute bottom-0 h-1 rounded-full transition-all duration-300 ${isActive ? 'w-3 bg-blue-500' : 'w-1.5 bg-gray-400'} pointer-events-none"></div>` : ''}`;
        btn.onclick = () => { const win = Store.state.windows.find(w => w.id === id); if(win && !win.isMinimized && win.zIndex === Store.state.nextZIndex) WindowManager.minimizeWindow(id); else WindowManager.openApp(id); };
        btn.oncontextmenu = (e) => { e.stopPropagation(); handleContextMenu(e, id, 'taskbar'); };
        iconsContainer.appendChild(btn);
    });
    updateClock();
    lucide.createIcons();
}

function updateClock() {
    const now = new Date();
    const elTime = document.getElementById('clock-time');
    const elDate = document.getElementById('clock-date');
    if(elTime) {
        elTime.innerText = now.toLocaleTimeString(Store.state.language === 'en' ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' });
        elDate.innerText = now.toLocaleDateString(Store.state.language === 'en' ? 'en-US' : 'pt-BR');
    }
}
