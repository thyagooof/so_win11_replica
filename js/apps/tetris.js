export class TetrisApp {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
        <div class="flex flex-col h-full items-center justify-center bg-[#202020] select-none p-4" style="outline:none;" tabindex="0" id="tetris-wrapper">
            <div class="text-white font-mono mb-2 flex justify-between w-[240px]">
                <span>TETRIS</span>
                <span>Score: <span id="tetris-score-val">0</span></span>
            </div>
            <canvas width="240" height="400" class="border-4 border-[#333] bg-black shadow-2xl"></canvas>
            <div class="text-gray-500 text-xs mt-2">Setas: Mover/Rodar</div>
        </div>`;

        this.canvas = this.container.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.scoreEl = this.container.querySelector('#tetris-score-val');
        this.wrapper = this.container.querySelector('#tetris-wrapper');

        this.context.scale(20, 20);

        // Estado do Jogo
        this.arena = this.createMatrix(12, 20);
        this.player = { pos: {x: 0, y: 0}, matrix: null, score: 0 };
        
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;

        // Focar para receber teclas
        setTimeout(() => this.wrapper.focus(), 100);

        // Eventos
        this.wrapper.addEventListener('keydown', event => {
            // Previne scroll
            if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
                event.preventDefault();
            }

            if (event.code === 'ArrowLeft') { this.playerMove(-1); }
            else if (event.code === 'ArrowRight') { this.playerMove(1); }
            else if (event.code === 'ArrowDown') { this.playerDrop(); }
            else if (event.code === 'ArrowUp') { this.playerRotate(1); }
        });

        this.playerReset();
        this.updateScore();
        this.update();
    }

    createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    createPiece(type) {
        if (type === 'I') return [[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0]];
        if (type === 'L') return [[0, 2, 0],[0, 2, 0],[0, 2, 2]];
        if (type === 'J') return [[0, 3, 0],[0, 3, 0],[3, 3, 0]];
        if (type === 'O') return [[4, 4],[4, 4]];
        if (type === 'Z') return [[5, 5, 0],[0, 5, 5],[0, 0, 0]];
        if (type === 'S') return [[0, 6, 6],[6, 6, 0],[0, 0, 0]];
        if (type === 'T') return [[0, 7, 0],[7, 7, 7],[0, 0, 0]];
    }

    drawMatrix(matrix, offset) {
        const colors = [null, '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'];
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.context.fillStyle = colors[value];
                    this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    draw() {
        // Limpa o canvas
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawMatrix(this.arena, {x: 0, y: 0});
        this.drawMatrix(this.player.matrix, this.player.pos);
    }

    merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (dir > 0) matrix.forEach(row => row.reverse());
        else matrix.reverse();
    }

    playerDrop() {
        this.player.pos.y++;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.y--;
            this.merge(this.arena, this.player);
            this.playerReset();
            this.arenaSweep();
            this.updateScore();
        }
        this.dropCounter = 0;
    }

    playerMove(offset) {
        this.player.pos.x += offset;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.x -= offset;
        }
    }

    playerReset() {
        const pieces = 'ILJOTSZ';
        this.player.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]);
        this.player.pos.y = 0;
        this.player.pos.x = (this.arena[0].length / 2 | 0) - (this.player.matrix[0].length / 2 | 0);
        
        // Game Over Check
        if (this.collide(this.arena, this.player)) {
            this.arena.forEach(row => row.fill(0));
            this.player.score = 0;
            this.updateScore();
        }
    }

    playerRotate(dir) {
        const pos = this.player.pos.x;
        let offset = 1;
        this.rotate(this.player.matrix, dir);
        while (this.collide(this.arena, this.player)) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix[0].length) {
                this.rotate(this.player.matrix, -dir);
                this.player.pos.x = pos;
                return;
            }
        }
    }

    collide(arena, player) {
        const m = player.matrix;
        const o = player.pos;
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    arenaSweep() {
        let rowCount = 1;
        outer: for (let y = this.arena.length - 1; y > 0; --y) {
            for (let x = 0; x < this.arena[y].length; ++x) {
                if (this.arena[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.arena.splice(y, 1)[0].fill(0);
            this.arena.unshift(row);
            ++y;

            this.player.score += rowCount * 10;
            rowCount *= 2;
        }
    }

    update(time = 0) {
        if(!document.contains(this.canvas)) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.playerDrop();
        }

        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

    updateScore() {
        this.scoreEl.innerText = this.player.score;
    }
}