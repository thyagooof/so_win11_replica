export class BrowserApp {
    constructor(container) {
        this.tabs = [{ id: 1, title: 'Google', url: 'https://www.google.com/webhp?igu=1' }];
        this.activeId = 1;
        this.render(container);
    }
    render(container) {
        const tab = this.tabs.find(t => t.id === this.activeId);
        container.innerHTML = `
        <div class="flex flex-col h-full bg-[#f3f3f3] dark:bg-[#202020]">
            <div class="flex items-center gap-2 p-2 bg-white dark:bg-[#2b2b2b] border-b border-gray-200 dark:border-gray-700 shadow-sm">
                 <form class="flex-1 bg-[#f1f3f4] dark:bg-[#1a1a1a] rounded-full px-3 py-1.5 flex items-center gap-2" onsubmit="event.preventDefault(); window.browserNav(this.querySelector('input').value)">
                    <input type="text" value="${tab.url}" class="flex-1 bg-transparent outline-none text-sm dark:text-white">
                </form>
            </div>
            <iframe src="${tab.url}" class="flex-1 bg-white border-none" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>
        </div>`;
        
        // Simples navegação
        window.browserNav = (url) => {
            if(!url.startsWith('http')) url = 'https://www.google.com/search?q='+encodeURIComponent(url)+'&igu=1';
            tab.url = url;
            this.render(container);
        };
    }
}
