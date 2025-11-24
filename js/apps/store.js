import { Store } from '../store.js';
import { ICONS, COLORS, APP_ID } from '../config.js';
import * as WindowManager from '../system/windowManager.js';
import * as UiRenderer from '../system/uiRenderer.js';

export class StoreApp {
    constructor(container) {
        this.container = container;
        this.activeTab = 'home';
        this.render();
    }

    render() {
        const t = Store.t.store;
        const catalogue = Store.state.storeCatalogue;

        this.container.innerHTML = `
        <div class="flex h-full bg-[#f3f3f3] dark:bg-[#202020] select-none overflow-hidden">
            <div class="w-60 p-4 flex flex-col gap-1 pt-8">
                <div class="flex items-center gap-2 px-2 mb-6"><i data-lucide="shopping-bag" class="text-blue-500 w-6 h-6"></i><span class="font-bold text-lg dark:text-white">Microsoft Store</span></div>
                ${this.renderNavItem('home', 'home', t.home)}
                ${this.renderNavItem('apps', 'layout-grid', t.apps)}
                ${this.renderNavItem('gaming', 'gamepad-2', t.gaming)}
                <div class="mt-auto">${this.renderNavItem('library', 'library', t.library)}</div>
            </div>
            <div class="flex-1 bg-white dark:bg-[#272727] m-2 rounded-lg shadow-sm border border-gray-200 dark:border-[#333] overflow-y-auto relative">
                <div class="h-64 bg-gradient-to-r from-blue-600 to-purple-600 p-8 flex flex-col justify-center text-white relative overflow-hidden">
                    <div class="absolute right-0 top-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800')] bg-cover opacity-20 mask-image-linear-gradient"></div>
                    <div class="relative z-10"><span class="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase mb-2 inline-block">Featured</span><h1 class="text-4xl font-bold mb-2">Essential Apps</h1><p class="mb-6 max-w-md text-white/90">Get the tools you need to be productive and creative.</p></div>
                </div>
                <div class="p-8"><h2 class="text-xl font-semibold mb-4 dark:text-white">Top Free Apps</h2><div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">${catalogue.map(app => this.renderAppCard(app, t)).join('')}</div></div>
                ${this.activeTab === 'library' ? this.renderLibraryOverlay(t) : ''}
            </div>
        </div>`;
        this.attachEvents(t);
        if(window.lucide) window.lucide.createIcons({ root: this.container });
    }

    renderNavItem(id, icon, label) {
        const isActive = this.activeTab === id;
        const activeClass = isActive ? 'bg-white dark:bg-[#333] text-black dark:text-white shadow-sm font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10';
        return `<button class="flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm nav-btn ${activeClass}" data-tab="${id}"><i data-lucide="${icon}" class="w-5 h-5"></i> ${label}</button>`;
    }

    renderAppCard(app, t) {
        const isInstalled = Store.state.installedApps.includes(app.id);
        const icon = ICONS[app.id] || 'box';
        const color = COLORS[app.id] || 'text-blue-500';
        return `
        <div class="bg-gray-50 dark:bg-[#333] p-4 rounded-lg border border-gray-200 dark:border-transparent hover:shadow-md transition-all group flex flex-col">
            <div class="w-16 h-16 rounded-xl bg-white dark:bg-[#222] shadow-sm flex items-center justify-center mb-3 self-start"><i data-lucide="${icon}" class="${color} w-8 h-8"></i></div>
            <h3 class="font-bold dark:text-white text-sm mb-0.5">${app.name}</h3><p class="text-xs text-gray-500 mb-4 truncate">${app.developer}</p>
            <div class="flex items-center gap-1 mb-4 text-xs text-gray-500"><i data-lucide="star" class="w-3 h-3 fill-yellow-400 text-yellow-400"></i> ${app.rating}</div>
            <button class="mt-auto w-full py-1.5 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2 install-btn relative overflow-hidden" data-id="${app.id}" style="${isInstalled ? 'background-color: transparent; border: 1px solid #ccc; color: inherit;' : 'background-color: #0078d4; color: white;'}">
                <span class="relative z-10 btn-text">${isInstalled ? t.open : t.get}</span><div class="progress-bar absolute inset-0 bg-blue-700 w-0 transition-all duration-[2000ms]"></div>
            </button>
        </div>`;
    }

    renderLibraryOverlay(t) {
        const installed = Store.state.storeCatalogue.filter(app => Store.state.installedApps.includes(app.id));
        const list = installed.map(app => `
            <div class="flex items-center gap-4 p-3 border-b dark:border-gray-700"><div class="w-10 h-10 bg-gray-100 dark:bg-[#333] rounded flex items-center justify-center"><i data-lucide="${ICONS[app.id]}" class="${COLORS[app.id]} w-5 h-5"></i></div><div class="flex-1"><div class="font-medium dark:text-white">${app.name}</div><div class="text-xs text-gray-500">Modified today</div></div><button class="px-4 py-1 bg-gray-100 dark:bg-[#333] rounded text-xs dark:text-white" onclick="window.WindowManagerOpen('${app.id}')">${t.open}</button></div>
        `).join('');
        return `<div class="absolute inset-0 bg-white dark:bg-[#272727] z-20 p-8 overflow-y-auto animate-in fade-in"><h2 class="text-2xl font-bold mb-6 dark:text-white">${t.library}</h2>${installed.length ? list : '<div class="text-gray-500">No apps installed yet.</div>'}</div>`;
    }

    attachEvents(t) {
        this.container.querySelectorAll('.nav-btn').forEach(btn => { btn.onclick = () => { this.activeTab = btn.dataset.tab; this.render(); }; });
        this.container.querySelectorAll('.install-btn').forEach(btn => {
            const appId = btn.dataset.id;
            btn.onclick = async () => {
                if (Store.state.installedApps.includes(appId)) { WindowManager.openApp(appId); return; }
                const textSpan = btn.querySelector('.btn-text');
                const progressBar = btn.querySelector('.progress-bar');
                btn.disabled = true; textSpan.innerText = t.downloading;
                setTimeout(() => { progressBar.style.width = '100%'; }, 50);
                setTimeout(() => { textSpan.innerText = t.installing; }, 1500);
                setTimeout(() => {
                    Store.state.installedApps.push(appId);
                    const appInfo = Store.state.storeCatalogue.find(a => a.id === appId);
                    
                    // 1. Add exe to system
                    Store.state.vfs.system.push({
                        id: appId,
                        label: `${appInfo.name}.exe`,
                        type: 'app',
                        icon: ICONS[appId] || 'box',
                        isWebApp: true
                    });

                    // 2. Add to Desktop (Smart Position)
                    const pos = UiRenderer.findNextDesktopPosition();
                    Store.state.desktopItems.push({
                        id: appId,
                        label: appInfo.name,
                        x: pos.x, y: pos.y,
                        isShortcut: true,
                        targetPath: 'system'
                    });

                    // 3. Add to Start Menu
                    Store.state.pinnedItems.push({ type: 'app', id: appId });

                    UiRenderer.renderAll();
                    btn.disabled = false; btn.style.backgroundColor = 'transparent'; btn.style.border = '1px solid #ccc'; btn.style.color = 'inherit';
                    textSpan.innerText = t.open; progressBar.style.width = '0';
                    if (document.documentElement.classList.contains('dark')) { btn.style.color = 'white'; btn.style.borderColor = '#555'; }
                }, 3000);
            };
        });
    }
}