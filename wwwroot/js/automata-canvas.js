class AutomataCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.selectedNode = null;
        this.draggingNode = null;
        this.startNode = null;
        this.mode = 'add-state';

        this.canvas.width = 800;
        this.canvas.height = 600;

        this.setupEventListeners();
        this.draw();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        const clickedNode = this.getNodeAt(pos.x, pos.y);

        if (this.mode === 'add-state' && !clickedNode) {
            this.addNode(pos.x, pos.y);
        } else if (this.mode === 'add-transition' && clickedNode) {
            if (!this.selectedNode) {
                this.selectedNode = clickedNode;
                clickedNode.selected = true;
            } else {
                const symbol = prompt('Enter transition symbol:');
                if (symbol) {
                    this.addEdge(this.selectedNode, clickedNode, symbol);
                }
                this.selectedNode.selected = false;
                this.selectedNode = null;
            }
        } else if (this.mode === 'delete' && clickedNode) {
            this.delteNode(clickedNode);
        } else if (clickedNode) {
            this.draggingNode = clickedNode;
        }

        this.draw();
    }

    handleMouseMove(e) {
        if (this.draggingNode) {
            const pos = this.getMousePos(e);
            this.draggingNode.x = pos.x;
            this.draggingNode.y = pos.y;
            this.draw();
        }
    }

    handleMouseUp(e) {
        this.draggingNode = null;
    }

    handleRightClick(e) {
        e.preventDefault();
        const pos = this.getMousePos(e);
        const clickedNode = this.getNodeAt(pos.x, pos.y)

        if (clickedNode) {
            this.showNodeMenu(clickedNode, pos.x, pos.y)
        }
    }

    showNodeMenu(node, x, y) {
        const action = prompt('Options:\n1. Set as start state\n2. Toggle accept state\n3. Rename');
        if (action === '1') {
            if (this.startNode) this.startNode.isStart = false;
            node.isStart = true;
            this.startNode = node;
        } else if ( action === '2') {
            node.isAccept = !node.isAccept;
        } else if (action === '3') {
            const newName = prompt('Enter new name:', node.id);
            if (newName) node.id = newName;
        }

        this.draw();
    }

    addNode(x, y) {
        const id = `q${this.nodes.length}`;
        this.nodes.push({
            id: id,
            x: x,
            y: y,
            isStart: this.nodes.length === 0,
            isAccept: false,
            selected: false
        });

        if (this.nodes.length === 1) {
            this.startNode = this.nodes[0];
        }
    }

    addEdge(from, to, symbol) {
        this.edges.push({
            from: from,
            to: to,
            symbol: symbol
        });
    }

    deleteNode(node) {
        this.nodes = this.nodes.filter(n => n !== node);
        this.edges = this.edges.filter(e => e.from !== node && e.to !== node);
        if (this.startNode === node) this.startNode = null;
    }

    getNodeAt(x, y) {
        const radius = 30;
        return this.nodes.find(n => {
            const dx = n.x - x;
            const dy = n.y - y;
            return Math.sqrt(dx**2 + dy**2) <= radius;
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.edges.forEach(edge => this.drawEdge(edge));
        this.nodes.forEach(node => this.drawNode(node));
    }

    drawNode(node) {
        const radius = 30;

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = node.selected ? '#ccff00' : '#ff0000';
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // draw accept state (double circle)
        if (node.isAccept) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius - 5, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        
        // draw start arrow
        if (node.isStart) {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x - radius - 20, node.y);
            this.ctx.lineTo(node.x - radius, node.y);
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(node.x - radius, node.y);
            this.ctx.lineTo(node.x - radius - 8, node.y - 5);
            this.ctx.lineTo(node.x - radius - 8, node.y + 5);
            this.ctx.closePath();
            this.ctx.fillStyle = '#fff';
            this.ctx.fill();
        }

        //draw label
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.id, node.x, node.y);
    }

    drawEdge(edge) {
        const from = edge.from;
        const to = edge.to;

        // self-loop
        if (from === to) {
            this.drawSelfLoop(from, edge.symbol);
            return;
        }

        // calculate arrow pos from edge of circle
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const radius = 30;

        const startX = from.x + radius * Math.cos(angle);
        const startY = from.y + radius * Math.sin(angle);
        const endX = to.x - radius * Math.cos(angle);
        const endY = to.y - radius * Math.sin(angle);

        //draw line
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        //draw arrowhead
        const headlen = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo( 
            endX - headlen * Math.cos(angle - Math.PI / 6),
            endY - headlen * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(
            endX - headlen * Math.cos(angle + Math.PI / 6),
            endY - headlen * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();

        // draw label
        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2
        this.ctx.fillStyle = '#00fff0';
        this.ctx.fillRect(midX - 15, midY - 10, 30, 20);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(edge.symbol, midX, midY);
    }

    drawSelfLoop(node, symbol) {
        const radius = 30;
        const loopRadius = 20;

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y - radius - loopRadius, loopRadius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        //label
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(symbol, node.x, node.y - radius - loopRadius * 2 - 5);
    }

    setMode(mode) {
        this.mode = mode;
        if (this.selectedNode) {
            this.selectedNode.selected = false;
            this.selectedNode = null;
        }
        this.draw();
    }

    exportDFA() {
        return {
            nodes: this.nodes.map(n => ({
                id: n.id,
                isStart: n.isStart,
                isAccept: n.isAccept
            })),
            edges: this.edges.map(e => ({
                from: e.from.id,
                to: e.to.id,
                symbol: e.symbol
            }))
        };
    }

    async testString(inputString) {
        const dfa = this.exportDFA();

        const response = await fetch('/api/automatatest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dfa: dfa, input: inputString })
        });

        const result = await response.json();
        this.animatePath(result.path, result.accepted);
    }

    animatePath(path, accepted) {
        alert(`Path: ${path.join(' → ')}\nAccepted: ${accepted}`);
    }

}

let canvas;
document.addEventListener('DOMContentLoaded', () => {
    canvas = new AutomataCanvas('automata-canvas');
})