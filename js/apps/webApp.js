import { Store } from '../store.js';

export class WebApp {
    constructor(container, appId) {
        this.container = container;
        this.appId = appId;
        this.appData = Store.state.storeCatalogue.find(a => a.id === appId);
        this.render();
    }

    render() {
        if (!this.appData) {
            this.container.innerHTML = `<div class="flex items-center justify-center h-full text-red-500">App Error: Not Found</div>`;
            return;
        }

        this.container.innerHTML = `
        <div class="flex flex-col h-full bg-white dark:bg-[#202020]">
            <div class="h-8 bg-[#f3f3f3] dark:bg-[#2c2c2c] border-b border-gray-200 dark:border-[#333] flex items-center px-3 justify-between">
                <div class="flex items-center gap-2 text-xs text-gray-500">
                    <i data-lucide="lock" class="w-3 h-3"></i>
                    <span>${this.appData.name}</span>
                </div>
                <div class="flex gap-2">
                    <button class="hover:bg-gray-200 dark:hover:bg-white/10 p-1 rounded"><i data-lucide="rotate-cw" class="w-3 h-3 dark:text-gray-400"></i></button>
                </div>
            </div>
            <iframe src="${this.appData.url}" class="flex-1 w-full h-full border-none" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"></iframe>
        </div>`;
        
        if(window.lucide) window.lucide.createIcons({ root: this.container });
    }
}