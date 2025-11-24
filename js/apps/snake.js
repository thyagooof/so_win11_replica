export class SnakeApp {
    constructor(container) {
        this.container = container;
        this.grid = 16;
        this.count = 0;
        this.snake = { x: 160, y: 160, dx: 16, dy: 0, cells: [], maxCells: 4 };
        this.apple = { x: 320, y: 320 };
        this.gameLoop = null;
        this.isGameOver = false;
        
        this.render();
    }

    render() {
        // 1. Estrutura HTML
        this.container.innerHTML = `
        <div class="flex flex-col h-full items-center justify-center bg-[#222] select-none p-4" style="outline:none;" tabindex="0" id="snake-wrapper">
            <div class="text-white font-mono mb-2 flex justify-between w-[400px]">
                <span>SNAKE</span>
                <span>Score: <span id="score-val">0</span></span>
            </div>
            <canvas width="400" height="400" class="border-4 border-[#333] bg-black shadow-2xl"></canvas>
            <div class="text-gray-500 text-xs mt-2">Use as setas para jogar. Clique aqui se parar.</div>
            <div id="game-over" class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white hidden">
                <h2 class="text-3xl font-bold mb-4 text-red-500">GAME OVER</h2>
                <button id="btn-restart" class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Jogar Novamente</button>
            </div>
        </div>`;

        this.canvas = this.container.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.scoreEl = this.container.querySelector('#score-val');
        this.wrapper = this.container.querySelector('#snake-wrapper');
        this.gameOverScreen = this.container.querySelector('#game-over');
        this.btnRestart = this.container.querySelector('#btn-restart');

        // 2. Focar na janela para receber teclas
        setTimeout(() => this.wrapper.focus(), 100);

        // 3. Eventos
        this.wrapper.addEventListener('keydown', (e) => {
            // Previne rolagem da tela com as setas
            if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
            
            // Controle
            if (e.code === 'ArrowLeft' && this.snake.dx === 0) { this.snake.dx = -this.grid; this.snake.dy = 0; }
            else if (e.code === 'ArrowUp' && this.snake.dy === 0) { this.snake.dy = -this.grid; this.snake.dx = 0; }
            else if (e.code === 'ArrowRight' && this.snake.dx === 0) { this.snake.dx = this.grid; this.snake.dy = 0; }
            else if (e.code === 'ArrowDown' && this.snake.dy === 0) { this.snake.dy = this.grid; this.snake.dx = 0; }
        });

        this.btnRestart.onclick = () => this.reset();

        // 4. Iniciar Loop
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    reset() {
        this.snake = { x: 160, y: 160, dx: this.grid, dy: 0, cells: [], maxCells: 4 };
        this.scoreEl.innerText = '0';
        this.isGameOver = false;
        this.gameOverScreen.classList.add('hidden');
        this.wrapper.focus();
        requestAnimationFrame(this.loop);
    }

    loop() {
        if(this.isGameOver) return;
        
        // Verifica se o elemento ainda existe (janela fechada)
        if(!document.contains(this.canvas)) return;

        requestAnimationFrame(this.loop);

        // Controla velocidade (15fps)
        if (++this.count < 6) return;
        this.count = 0;

        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

        // Move Cobra
        this.snake.x += this.snake.dx;
        this.snake.y += this.snake.dy;

        // Atravessa paredes
        if (this.snake.x < 0) this.snake.x = this.canvas.width - this.grid;
        else if (this.snake.x >= this.canvas.width) this.snake.x = 0;
        if (this.snake.y < 0) this.snake.y = this.canvas.height - this.grid;
        else if (this.snake.y >= this.canvas.height) this.snake.y = 0;

        // Rastro
        this.snake.cells.unshift({x: this.snake.x, y: this.snake.y});
        if (this.snake.cells.length > this.snake.maxCells) {
            this.snake.cells.pop();
        }

        // Desenha Maçã
        this.context.fillStyle = 'red';
        this.context.fillRect(this.apple.x, this.apple.y, this.grid-1, this.grid-1);

        // Desenha Cobra
        this.context.fillStyle = 'lime';
        this.snake.cells.forEach((cell, index) => {
            this.context.fillRect(cell.x, cell.y, this.grid-1, this.grid-1);

            // Comeu maçã
            if (cell.x === this.apple.x && cell.y === this.apple.y) {
                this.snake.maxCells++;
                this.scoreEl.innerText = this.snake.maxCells - 4;
                // Nova posição aleatória alinhada a grade
                this.apple.x = Math.floor(Math.random() * 25) * this.grid;
                this.apple.y = Math.floor(Math.random() * 25) * this.grid;
            }

            // Colisão consigo mesma
            for (let i = index + 1; i < this.snake.cells.length; i++) {
                if (cell.x === this.snake.cells[i].x && cell.y === this.snake.cells[i].y) {
                    this.isGameOver = true;
                    this.gameOverScreen.classList.remove('hidden');
                }
            }
        });
    }
}