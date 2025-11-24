import { Store } from '../store.js';
import { WALLPAPER_DARK, WALLPAPER_LIGHT } from '../config.js';

export class SettingsApp {
    constructor(container) {
        this.container = container;
        this.activeTab = 'system';
        this.currentSystemPage = 'main';
        this.render();
    }

    render() {
        const t = Store.t.settings;

        // Se por acaso o config.js não tiver sido atualizado, isso evita o crash total
        if (!t.system) {
            this.container.innerHTML = `<div class="p-8 text-red-500">Erro: Atualize o arquivo js/config.js para incluir as traduções de 'system'.</div>`;
            return;
        }

        this.container.innerHTML = `
        <div class="flex h-full bg-[#f3f3f3] dark:bg-[#202020] transition-colors duration-200 select-none">
            <div class="w-64 p-2 flex flex-col gap-1 overflow-y-auto pt-8 pl-4 bg-[#f3f3f3] dark:bg-[#202020]">
                <div class="flex items-center gap-3 px-3 mb-6">
                    <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">${Store.t.startMenu.user.charAt(0)}</div>
                    <div><div class="text-sm font-semibold dark:text-white">${Store.t.startMenu.user}</div><div class="text-xs text-gray-500">Local Account</div></div>
                </div>
                <div class="h-[1px] bg-gray-300 dark:bg-gray-700 mx-2 mb-2"></div>
                ${this.renderNavItem('system', 'monitor', t.nav.system)}
                ${this.renderNavItem('personalization', 'paintbrush', t.nav.personalization)}
                ${this.renderNavItem('time', 'clock', t.nav.time)}
            </div>

            <div class="flex-1 bg-white/50 dark:bg-[#272727]/50 m-2 rounded-lg shadow-sm border border-gray-200 dark:border-[#333] overflow-hidden flex flex-col relative">
                <div class="p-8 h-full overflow-y-auto">
                    <div class="mb-6 flex items-center gap-2 sticky top-0 z-10">
                        ${this.activeTab === 'system' && this.currentSystemPage !== 'main' 
                            ? `<button id="btn-sys-back" class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 rounded mr-2 transition-colors"><i data-lucide="arrow-left" class="w-5 h-5 dark:text-white pointer-events-none"></i></button>` 
                            : ''}
                        <h1 class="text-3xl font-semibold dark:text-white">${this.getTitle(t)}</h1>
                    </div>
                    <div id="settings-content">${this.getTabContent(t)}</div>
                </div>
            </div>
        </div>`;

        this.attachEvents();
        if(window.lucide) window.lucide.createIcons({ root: this.container });
    }

    renderNavItem(id, icon, label) {
        const isActive = this.activeTab === id;
        const activeClass = isActive 
            ? 'bg-white dark:bg-[#333] text-blue-600 dark:text-blue-400 font-medium shadow-sm' 
            : 'hover:bg-gray-200 dark:hover:bg-[#333] text-gray-600 dark:text-gray-300';
        return `<button data-tab="${id}" class="w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-all ${activeClass}"><i data-lucide="${icon}" class="w-4 h-4 pointer-events-none"></i><span class="pointer-events-none">${label}</span>${isActive ? '<div class="ml-auto w-1 h-3 bg-blue-500 rounded-full pointer-events-none"></div>' : ''}</button>`;
    }

    getTitle(t) {
        if (this.activeTab === 'system') {
            const titles = {
                'main': t.titles.system, 'notifications': t.system.menu.notif,
                'storage': t.system.menu.storage, 'recovery': t.system.menu.recovery, 'about': t.system.menu.about
            };
            return titles[this.currentSystemPage] || t.titles.system;
        }
        return t.titles[this.activeTab];
    }

    getTabContent(t) {
        if (this.activeTab === 'system') {
            if (this.currentSystemPage === 'main') {
                return `<div class="flex flex-col gap-2">
                    ${this.renderSystemCard('notifications', 'bell', t.system.menu.notif, t.system.desc.notif)}
                    ${this.renderSystemCard('storage', 'hard-drive', t.system.menu.storage, t.system.desc.storage)}
                    ${this.renderSystemCard('recovery', 'rotate-ccw', t.system.menu.recovery, t.system.desc.recovery)}
                    ${this.renderSystemCard('about', 'info', t.system.menu.about, t.system.desc.about)}
                </div>`;
            }
            if (this.currentSystemPage === 'about') {
                return `<div class="bg-white dark:bg-[#333] rounded-lg p-6 border border-gray-200 dark:border-transparent mb-6"><div class="flex items-center gap-4 mb-6"><div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center text-blue-600 dark:text-blue-400"><i data-lucide="monitor" class="w-8 h-8 pointer-events-none"></i></div><div><h2 class="text-xl font-bold dark:text-white">${Store.t.startMenu.user}'s PC</h2><div class="text-sm text-gray-500">Desktop-58392</div></div></div><div class="space-y-1">${this.renderSpecRow('Processor', 'Intel(R) Core(TM) i9-13900K @ 5.80GHz')}${this.renderSpecRow('Installed RAM', '64.0 GB (63.8 GB usable)')}</div></div><div class="bg-white dark:bg-[#333] rounded-lg p-6 border border-gray-200 dark:border-transparent"><h3 class="font-semibold mb-4 dark:text-white">Windows specifications</h3><div class="space-y-1">${this.renderSpecRow('Edition', 'Windows 11 Web Replica')}${this.renderSpecRow('Version', '0.0.1 Alfa')}${this.renderSpecRow('Developer', 'Cicero Thyago de Oliveira Fernandes')}${this.renderSpecRow('Installed on', new Date().toLocaleDateString())}</div></div>`;
            }
            return `<div class="p-4 text-gray-500">Page under construction.</div>`;
        }

        if (this.activeTab === 'personalization') {
            return `<div class="bg-white dark:bg-[#333] rounded-lg p-5 mb-4 border border-gray-200 dark:border-transparent"><div class="flex items-center gap-4 mb-4"><div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 dark:text-blue-300"><i data-lucide="palette" class="w-5 h-5"></i></div><div><h3 class="font-medium dark:text-white">${t.theme.title}</h3><p class="text-xs text-gray-500">Light, Dark</p></div></div><div class="flex gap-4"><button id="theme-light" class="flex-1 p-3 border-2 ${!Store.state.isDark ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 dark:border-gray-600'} rounded-lg flex flex-col items-center gap-2 transition-all hover:bg-gray-50 dark:hover:bg-[#444]"><div class="w-full h-20 bg-gray-200 rounded border border-gray-300 shadow-sm relative overflow-hidden"><div class="absolute inset-x-0 bottom-0 h-4 bg-white opacity-80"></div></div><span class="text-sm font-medium dark:text-white">${t.theme.light}</span></button><button id="theme-dark" class="flex-1 p-3 border-2 ${Store.state.isDark ? 'border-blue-500 bg-blue-500/10' : 'border-gray-200 dark:border-gray-600'} rounded-lg flex flex-col items-center gap-2 transition-all hover:bg-gray-50 dark:hover:bg-[#444]"><div class="w-full h-20 bg-[#111] rounded border border-gray-700 shadow-sm relative overflow-hidden"><div class="absolute inset-x-0 bottom-0 h-4 bg-[#333] opacity-80"></div></div><span class="text-sm font-medium dark:text-white">${t.theme.dark}</span></button></div></div><div class="bg-white dark:bg-[#333] rounded-lg p-5 border border-gray-200 dark:border-transparent"><div class="flex items-center gap-4 mb-4"><div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center text-purple-600 dark:text-purple-300"><i data-lucide="image" class="w-5 h-5"></i></div><div><h3 class="font-medium dark:text-white">${t.bg.title}</h3></div></div><div class="flex gap-2 mb-4"><input type="text" id="bg-input" placeholder="${t.bg.placeholder}" class="flex-1 px-3 py-2 text-sm rounded border dark:bg-[#222] dark:border-gray-600 dark:text-white outline-none"><button id="btn-apply-bg" class="px-4 py-2 bg-blue-600 text-white rounded text-sm">${t.bg.apply}</button></div><div class="grid grid-cols-4 gap-2"><button class="aspect-video bg-cover bg-center rounded cursor-pointer hover:opacity-80 wallpaper-preset" style="background-image: url('${WALLPAPER_LIGHT}')" data-url="${WALLPAPER_LIGHT}"></button><button class="aspect-video bg-cover bg-center rounded cursor-pointer hover:opacity-80 wallpaper-preset" style="background-image: url('${WALLPAPER_DARK}')" data-url="${WALLPAPER_DARK}"></button></div></div>`;
        }

        if (this.activeTab === 'time') {
            return `<div class="bg-white dark:bg-[#333] rounded-lg p-5 border border-gray-200 dark:border-transparent"><div class="flex items-center gap-4 mb-4"><div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center text-green-600 dark:text-green-300"><i data-lucide="globe" class="w-5 h-5"></i></div><div><h3 class="font-medium dark:text-white">${t.lang.title}</h3></div></div><div class="space-y-4"><div><label class="block text-xs font-medium text-gray-500 mb-1">${t.lang.label}</label><select id="lang-select" class="w-full p-2.5 rounded border bg-gray-50 dark:bg-[#222] dark:border-gray-600 dark:text-white outline-none focus:border-blue-500"><option value="en" ${Store.state.language === 'en' ? 'selected' : ''}>English (United States)</option><option value="pt-BR" ${Store.state.language === 'pt-BR' ? 'selected' : ''}>Português (Brasil)</option></select></div></div></div>`;
        }
    }

    renderSystemCard(id, icon, title, desc) {
        return `<button class="sys-nav-btn w-full flex items-center gap-4 p-4 bg-white dark:bg-[#333] border border-gray-200 dark:border-transparent rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-all group text-left" data-page="${id}"><div class="w-10 h-10 bg-gray-100 dark:bg-[#444] rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors"><i data-lucide="${icon}" class="w-5 h-5 pointer-events-none"></i></div><div class="flex-1 pointer-events-none"><div class="font-medium dark:text-white text-sm">${title}</div><div class="text-xs text-gray-500">${desc}</div></div><i data-lucide="chevron-right" class="w-4 h-4 text-gray-400 pointer-events-none"></i></button>`;
    }

    renderSpecRow(label, value) {
        return `<div class="flex py-2 border-b dark:border-[#444]"><span class="w-40 text-gray-500 text-sm flex-shrink-0">${label}</span><span class="dark:text-white text-sm">${value}</span></div>`;
    }

    triggerChange(type) {
        const event = new CustomEvent(type);
        document.dispatchEvent(event);
        this.render();
    }

    attachEvents() {
        this.container.querySelectorAll('[data-tab]').forEach(btn => {
            btn.onclick = () => { this.activeTab = btn.dataset.tab; if(this.activeTab !== 'system') this.currentSystemPage = 'main'; this.render(); };
        });
        this.container.querySelectorAll('.sys-nav-btn').forEach(btn => {
            btn.onclick = () => { this.currentSystemPage = btn.dataset.page; this.render(); };
        });
        const backBtn = this.container.querySelector('#btn-sys-back');
        if(backBtn) { backBtn.onclick = () => { this.currentSystemPage = 'main'; this.render(); }; }
        
        if (this.activeTab === 'personalization') {
            this.container.querySelector('#theme-light').onclick = () => { if (Store.state.wallpaper === WALLPAPER_DARK) Store.state.wallpaper = WALLPAPER_LIGHT; Store.state.isDark = false; this.triggerChange('system-theme-change'); };
            this.container.querySelector('#theme-dark').onclick = () => { if (Store.state.wallpaper === WALLPAPER_LIGHT) Store.state.wallpaper = WALLPAPER_DARK; Store.state.isDark = true; this.triggerChange('system-theme-change'); };
            this.container.querySelector('#btn-apply-bg').onclick = () => { const url = this.container.querySelector('#bg-input').value; if(url) { Store.state.wallpaper = url; this.triggerChange('system-theme-change'); } };
            this.container.querySelectorAll('.wallpaper-preset').forEach(btn => { btn.onclick = () => { Store.state.wallpaper = btn.dataset.url; this.triggerChange('system-theme-change'); }; });
        }
        if (this.activeTab === 'time') {
            this.container.querySelector('#lang-select').onchange = (e) => { Store.state.language = e.target.value; this.triggerChange('system-lang-change'); };
        }
    }
}