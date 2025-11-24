export class CalculatorApp {
    constructor(container) {
        this.display = '0';
        this.equation = '';
        this.render(container);
    }
    render(container) {
        container.innerHTML = `
        <div class="flex flex-col h-full bg-[#f3f3f3] dark:bg-[#202020] p-1">
            <div class="flex-1 p-4 flex flex-col justify-end items-end">
                <div class="text-gray-500 text-xs mb-1 h-4">${this.equation}</div>
                <div class="text-4xl font-semibold text-gray-900 dark:text-white calc-display">${this.display}</div>
            </div>
            <div class="grid grid-cols-4 gap-1 pb-2" id="calc-grid"></div>
        </div>`;
        
        const btns = ['CE', 'C', 'DEL', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '+/-', '0', '.', '='];
        const grid = container.querySelector('#calc-grid');
        
        btns.forEach(val => {
            const btn = document.createElement('button');
            const isEq = val === '=';
            const baseClass = "h-12 rounded transition-colors text-sm font-bold shadow-sm";
            btn.className = isEq ? `${baseClass} bg-blue-600 text-white` : `${baseClass} bg-white dark:bg-white/5 dark:text-white`;
            btn.textContent = val;
            btn.onclick = () => {
                if(val === '=') try { this.display = String(eval(this.equation + this.display)); this.equation = ''; } catch { this.display = 'Error'; }
                else if(['+','-','*','/'].includes(val)) { this.equation = this.display + val; this.display = '0'; }
                else if(val === 'C' || val === 'CE') { this.display = '0'; this.equation = ''; }
                else if(val === 'DEL') { this.display = this.display.slice(0, -1) || '0'; }
                else this.display = this.display === '0' ? val : this.display + val;
                
                container.querySelector('.calc-display').innerText = this.display;
            };
            grid.appendChild(btn);
        });
    }
}