/* game of life code*/


(function() {
    const canvas = document.getElementById('conwayGoL');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Settings
    let cellSize = 2;
    let cols, rows, grid, next;
    let isDrawing = false;

    // Helper to get the actual display size of the canvas
    function getDisplaySize() {
        // Use CSS pixel size for canvas
        const rect = canvas.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    }

    function resize() {
        // Set canvas size to match CSS size (devicePixelRatio for sharpness)
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = getDisplaySize();
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.scale(dpr, dpr);
        cols = Math.floor(width / cellSize);
        rows = Math.floor(height / cellSize);
        grid = Array.from({length: rows}, () => Array(cols).fill(0));
        next = Array.from({length: rows}, () => Array(cols).fill(0));
        randomize();
    }

    function randomize() {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                grid[y][x] = Math.random() > 0.5 ? 1 : 0;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
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
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        const x = (Math.floor((clientX - rect.left) / cellSize) + cols) % cols;
        const y = (Math.floor((clientY - rect.top) / cellSize) + rows) % rows;
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[y][x] = grid[y][x] ? 0 : 1;
            draw();
        }
    }



    // Add click/touch event to toggle cell state
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDrawing = true;
        handleDraw(e);
    }, { passive: false });
    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        handleDraw(e);
    });
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (isDrawing) handleDraw(e);
    }, { passive: false });
    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing) handleDraw(e);
    });
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        isDrawing = false;
    }, { passive: false });
    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    });
    canvas.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        isDrawing = false;
    }, { passive: false });
    canvas.addEventListener('mouseleave', function() {
        isDrawing = false;
    });
    window.addEventListener('mouseup', function() {
        isDrawing = false;
    });
    window.addEventListener('mouseleave', function() {
        isDrawing = false;
    });

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
    window.addEventListener('orientationchange', resize);
    // Wait for DOM to be fully loaded before sizing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            resize();
            animate();
        });
    } else {
        resize();
        animate();
    }
})();

