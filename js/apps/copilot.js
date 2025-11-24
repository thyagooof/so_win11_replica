export class CopilotApp {
    render(container) {
        container.innerHTML = `
        <div class="flex flex-col h-full bg-[#f3f3f3] dark:bg-[#202020]">
             <div class="flex-1 p-4 overflow-y-auto space-y-4">
                <div class="bg-white dark:bg-[#333] p-3 rounded-lg dark:text-white text-sm">Olá! Eu sou o Copilot simulado.</div>
             </div>
             <div class="p-4 bg-white dark:bg-[#333]">
                <input type="text" placeholder="Ask anything..." class="w-full bg-gray-100 dark:bg-[#202020] dark:text-white rounded-xl py-2 px-4 outline-none">
             </div>
        </div>`;
    }
}