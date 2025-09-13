/* game of life code*/

(function() {
    const canvas = document.getElementById('conwayGoL');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Settings
    let cellSize = 2;
    let cols, rows, grid, next;
    let isDrawing = false;

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
                        let ny = (y + dy + rows) % rows;
                        let nx = (x + dx + cols) % cols;
                        neighbors += grid[ny][nx];
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

    function handleDraw(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (Math.floor((e.clientX - rect.left) / cellSize) + cols) % cols;
        const y = (Math.floor((e.clientY - rect.top) / cellSize) + rows) % rows;
        grid[y][x] = grid[y][x] ? 0 : 1;
        draw();
    }

    function handleDrawMobile(e) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = (Math.floor((touch.clientX - rect.left) / cellSize) + cols) % cols;
        const y = (Math.floor((touch.clientY - rect.top) / cellSize) + rows) % rows;
        grid[y][x] = grid[y][x] ? 0 : 1;
        draw();
    }


    // Add click event to toggle cell state
    canvas.addEventListener('touchstart', function(e) {
        isDrawing = true;
        handleDrawMobile(e);
    })
    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        handleDraw(e);
    })
    canvas.addEventListener('touchmove', function(e) {
        if (isDrawing) handleDrawMobile(e);
    })
    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing) handleDraw(e);
    })
    canvas.addEventListener('touchend', function() {
        isDrawing = false;
    })
    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    })
    canvas.addEventListener('touchcancel', function() {
        isDrawing = false;
    })
    canvas.addEventListener('mouseleave', function() {
        isDrawing = false;
    })
    window.addEventListener('mouseup', function() {
        isDrawing = false;
    })
    window.addEventListener('mouseleave', function() {
        isDrawing = false;
    })

    /*canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[y][x] = grid[y][x] ? 0 : 1;
            draw();
        }
    });*/


    function animate() {
        step();
        draw();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
})();

