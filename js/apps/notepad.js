import { Store } from '../store.js';

export class NotepadApp {
    constructor(container) {
        const welcome = Store.state.language === 'pt-BR' ? 'Bem-vindo ao Windows 11 Web.' : 'Welcome to Windows 11 Web.';
        this.text = Store.state.appStates.notepad.text || welcome;
        this.render(container);
    }
    render(container) {
        container.innerHTML = `
        <div class="flex flex-col h-full bg-white dark:bg-[#202020]">
             <div class="flex gap-4 px-2 py-1 text-xs border-b border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300"><span>File</span><span>Edit</span></div>
            <textarea class="flex-1 w-full p-4 resize-none outline-none font-mono text-sm bg-white dark:bg-[#202020] text-gray-900 dark:text-gray-200"></textarea>
        </div>`;
        const area = container.querySelector('textarea');
        area.value = this.text;
        area.oninput = (e) => { Store.state.appStates.notepad.text = e.target.value; };
    }
}