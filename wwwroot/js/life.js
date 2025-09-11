/* game of life code*/

(function() {
    const canvas = document.getElementById('conwayGoL');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Settings
    let cellSize = 8;
    let cols, rows, grid, next;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.floor(canvas.width / cellSize);
        rows = Math.floor(canvas.height / cellSize);
        grid = Array.from({length: rows}, () => Array(cols).fill(0));
        next = Array.from({length: rows}, () => Array(cols).fill(0));
        randomize();
    }

    function randomize() {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                grid[y][x] = Math.random() > 0.7 ? 1 : 0;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (grid[y][x]) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    function step() {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let neighbors = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        let ny = y + dy;
                        let nx = x + dx;
                        if (ny >= 0 && ny < rows && nx >= 0 && nx < cols) {
                            neighbors += grid[ny][nx];
                        }
                    }
                }
                if (grid[y][x]) {
                    next[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    next[y][x] = (neighbors === 3) ? 1 : 0;
                }
            }
        }
        // Swap grids
        [grid, next] = [next, grid];
    }

    // Add click event to toggle cell state
    function toggleCellAt(x, y) {
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[y][x] = grid[y][x] ? 0 : 1;
            draw(); // Optional: update immediately
        }
    }

    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        toggleCellAt(x, y);
    });

    // Touch support for mobile
    canvas.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = Math.floor((touch.clientX - rect.left) / cellSize);
            const y = Math.floor((touch.clientY - rect.top) / cellSize);
            toggleCellAt(x, y);
        }
    });

    function animate() {
        step();
        draw();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
})();

