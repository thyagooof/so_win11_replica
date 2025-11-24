import { Store } from '../store.js';
import { ICONS, COLORS, APP_ID } from '../config.js';
import * as WindowManager from '../system/windowManager.js';

export class ExplorerApp {
    constructor(container) {
        this.container = container;
        this.currentPath = Store.state.appStates.explorer.currentPath || 'home';
        this.render();
    }

    render() {
        const t = Store.t.explorer;
        let files = [];
        if (this.currentPath === 'desktop') {
            files = Store.state.desktopItems;
        } else {
            files = Store.state.vfs[this.currentPath] || [];
        }

        this.container.innerHTML = `
        <div class="flex flex-col h-full bg-[#f3f3f3] dark:bg-[#202020] select-none">
            <div class="h-12 bg-[#f3f3f3] dark:bg-[#2c2c2c] flex items-center px-2 gap-2 border-b border-gray-200 dark:border-[#333]">
                <div class="flex gap-1">
                    <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors" id="exp-back" ${this.currentPath === 'home' ? 'disabled style="opacity:0.3"' : ''}><i data-lucide="arrow-left" class="w-4 h-4"></i></button>
                    <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors" disabled style="opacity:0.3"><i data-lucide="arrow-right" class="w-4 h-4"></i></button>
                    <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors" id="exp-up"><i data-lucide="arrow-up" class="w-4 h-4"></i></button>
                </div>
                <div class="flex-1 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm flex items-center gap-2 mx-2">
                    <i data-lucide="${this.getIconForPath(this.currentPath)}" class="w-4 h-4 text-gray-500"></i>
                    <span class="dark:text-white pt-0.5">${this.getPathLabel(this.currentPath)}</span>
                </div>
                <div class="w-48 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm flex items-center">
                    <input type="text" placeholder="${Store.t.startMenu.search} ${this.getPathLabel(this.currentPath)}" class="bg-transparent outline-none w-full dark:text-white placeholder-gray-500">
                    <i data-lucide="search" class="w-3 h-3 text-gray-500"></i>
                </div>
            </div>
            <div class="h-10 bg-[#f9f9f9] dark:bg-[#202020] border-b border-gray-200 dark:border-[#333] flex items-center px-4 gap-4 text-sm">
                <button class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 dark:text-white"><i data-lucide="plus" class="w-4 h-4 text-blue-600"></i> New</button>
                <div class="w-[1px] h-5 bg-gray-300 dark:bg-gray-600"></div>
                <button class="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10"><i data-lucide="scissors" class="w-4 h-4 dark:text-white"></i></button>
                <button class="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10"><i data-lucide="copy" class="w-4 h-4 dark:text-white"></i></button>
                <button class="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10"><i data-lucide="clipboard" class="w-4 h-4 dark:text-white"></i></button>
                <button class="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10"><i data-lucide="pen-line" class="w-4 h-4 dark:text-white"></i></button>
            </div>
            <div class="flex-1 flex overflow-hidden">
                <div class="w-48 bg-[#f3f3f3] dark:bg-[#202020] border-r border-gray-200 dark:border-[#333] flex flex-col pt-2 text-sm">
                     ${this.renderSidebarItem('home', 'home', t.home)}
                     ${this.renderSidebarItem('desktop', 'monitor', t.desktop)}
                     ${this.renderSidebarItem('documents', 'file-text', t.documents)}
                     ${this.renderSidebarItem('downloads', 'download', t.downloads)}
                     ${this.renderSidebarItem('pictures', 'image', t.pictures)}
                     <div class="h-[1px] bg-gray-300 dark:bg-gray-600 mx-3 my-2"></div>
                     ${this.renderSidebarItem('system', 'hard-drive', t.system)}
                     <div class="mt-4 px-4 text-xs font-semibold text-gray-500 uppercase">Network</div>
                </div>
                <div class="flex-1 bg-white dark:bg-[#1a1a1a] p-4 overflow-y-auto">
                    <h2 class="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">${this.getPathLabel(this.currentPath)} (${files.length})</h2>
                    <div class="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
                        ${files.map((file, idx) => this.renderFileItem(file, idx)).join('')}
                    </div>
                </div>
            </div>
            <div class="h-6 bg-[#f3f3f3] dark:bg-[#2c2c2c] border-t border-gray-200 dark:border-[#333] flex items-center px-4 text-xs text-gray-500 dark:text-gray-400 gap-4">
                <span>${files.length} ${t.items}</span>
            </div>
        </div>`;
        this.attachEvents();
        if(window.lucide) window.lucide.createIcons({ root: this.container });
    }

    renderSidebarItem(path, icon, label) {
        const isActive = this.currentPath === path;
        const color = isActive ? 'bg-blue-100 dark:bg-white/10 text-blue-700 dark:text-white font-medium' : 'hover:bg-gray-200 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300';
        const iconColor = isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500';
        return `<button class="sidebar-nav px-2 py-1.5 mx-2 rounded flex items-center gap-3 transition-colors text-left ${color}" data-path="${path}"><i data-lucide="${icon}" class="w-4 h-4 ${iconColor}"></i>${label}</button>`;
    }

    renderFileItem(file, idx) {
        let icon = file.icon || ICONS[file.type] || ICONS['unknown'];
        let color = COLORS[file.type] || COLORS['unknown'];
        if(file.type === 'app' || file.id in ICONS) {
            icon = ICONS[file.id] || icon;
            color = COLORS[file.id] || color;
        }
        const shortcutBadge = file.isShortcut ? `<div class="absolute bottom-0 left-0 bg-white dark:bg-[#333] rounded-[2px] shadow-sm border border-gray-300 dark:border-gray-500 w-3 h-3 flex items-center justify-center"><i data-lucide="arrow-up-right" class="w-2 h-2 text-blue-600 dark:text-blue-400 stroke-[3]"></i></div>` : '';
        return `<div class="file-item flex flex-col items-center p-2 rounded hover:bg-blue-50 dark:hover:bg-white/5 hover:border-blue-100 border border-transparent cursor-default group" data-idx="${idx}" title="${file.label}"><div class="relative w-12 h-12 flex items-center justify-center mb-1"><i data-lucide="${icon}" class="${color} w-10 h-10"></i>${shortcutBadge}</div><span class="text-xs text-center text-gray-700 dark:text-gray-200 line-clamp-2 w-full break-words leading-tight px-1 group-hover:text-blue-700 dark:group-hover:text-blue-300">${file.label}</span></div>`;
    }

    attachEvents() {
        const btnBack = this.container.querySelector('#exp-back');
        if(btnBack) btnBack.onclick = () => { if(this.currentPath !== 'home') this.navigate('home'); };
        const btnUp = this.container.querySelector('#exp-up');
        if(btnUp) btnUp.onclick = () => { if(this.currentPath !== 'home') this.navigate('home'); };
        this.container.querySelectorAll('.sidebar-nav').forEach(btn => { btn.onclick = () => this.navigate(btn.dataset.path); });
        this.container.querySelectorAll('.file-item').forEach(el => {
            const idx = parseInt(el.dataset.idx);
            let files;
            if(this.currentPath === 'desktop') files = Store.state.desktopItems;
            else files = Store.state.vfs[this.currentPath];
            const file = files[idx];
            el.oncontextmenu = (e) => {
                e.preventDefault(); e.stopPropagation();
                const event = new CustomEvent('explorer-context', { detail: { x: e.clientX, y: e.clientY, file: file, currentPath: this.currentPath } });
                document.dispatchEvent(event);
            };
            el.ondblclick = () => {
                if (file.type === 'folder') { if(Store.state.vfs[file.id]) this.navigate(file.id); }
                else if (file.type === 'app' || file.app) { WindowManager.openApp(file.app || file.id); }
                else if (file.type === 'file') { WindowManager.openApp(APP_ID.NOTEPAD); }
            };
        });
    }

    navigate(path) { this.currentPath = path; Store.state.appStates.explorer.currentPath = path; this.render(); }
    getIconForPath(path) { const map = { home: 'home', desktop: 'monitor', documents: 'file-text', downloads: 'download', pictures: 'image', system: 'hard-drive' }; return map[path] || 'folder'; }
    getPathLabel(path) { const t = Store.t.explorer; const map = { home: t.home, desktop: t.desktop, documents: t.documents, downloads: t.downloads, pictures: t.pictures, system: t.system }; return map[path] || path; }
}