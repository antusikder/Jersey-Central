// Jersey Central - Premium Custom Jerseys
// Advanced Editor & Product Showcase

class JerseyCentral {
    constructor() {
        this.currentJersey = 0;
        this.designElements = [];
        this.selectedElement = null;
        this.canvas = null;
        this.ctx = null;
        this.baseImage = new Image();
        this.zoom = 1;
        this.history = [];
        this.historyIndex = -1;

        this.init();
    }

    async init() {
        console.log('init started');
        this.setupCanvas();
        this.populateJerseySelect();
        this.renderProductGrid();
        this.loadGraphics('university');
        this.setupEventListeners();
        
        // Hide loader then load jersey
        setTimeout(() => {
            document.getElementById('loader')?.classList.add('hidden');
            this.loadJersey(0);
            this.updateOrderSummary();
        }, 800);
    }

    setupCanvas() {
        this.canvas = document.getElementById('editor-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.renderPlaceholder();
    }

    renderPlaceholder() {
        this.ctx.fillStyle = '#0d1117';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#c9a227';
        this.ctx.font = '16px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Select a jersey to start designing', this.canvas.width/2, this.canvas.height/2);
    }

    // Jersey Management
    getJerseyCount() { return 47; }

    getJerseyImagePath(index) {
        return index === 0 ? 'Banner and ads/front_medium_extended.jpeg' : `Banner and ads/front_medium_extended (${index}).jpeg`;
    }

    getOrderNumber(index) {
        return `JC${String(index + 1).padStart(3, '0')}`;
    }

    populateJerseySelect() {
        const select = document.getElementById('base-jersey-select');
        if (!select) return;
        select.innerHTML = '';
        for (let i = 0; i < this.getJerseyCount(); i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Jersey ${this.getOrderNumber(i)}`;
            select.appendChild(option);
        }
    }

    loadJersey(index) {
        this.currentJersey = index;
        const imgPath = this.getJerseyImagePath(index);
        
        // Show loading state
        this.ctx.fillStyle = '#0d1117';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#c9a227';
        this.ctx.font = '16px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Loading...`, this.canvas.width/2, this.canvas.height/2);

        this.baseImage.crossOrigin = 'anonymous';
        this.baseImage.onload = () => {
            this.renderCanvas();
            this.updateOrderSummary();
            this.updateJerseyPreview(index);
        };
        this.baseImage.onerror = () => {
            this.renderPlaceholder();
        };
        this.baseImage.src = imgPath;
    }

    updateJerseyPreview(index) {
        const img = document.getElementById('base-jersey-img');
        if (img) img.src = this.getJerseyImagePath(index);
    }

    updateOrderSummary() {
        const orderNum = this.getOrderNumber(this.currentJersey);
        document.getElementById('order-number').textContent = orderNum;
        document.getElementById('order-jersey-name').textContent = `Jersey ${orderNum}`;
        document.getElementById('design-count').textContent = `${this.designElements.length} elements`;
        
        const btn = document.getElementById('whatsapp-order');
        if (btn) {
            btn.href = `https://wa.me/8801581872622?text=Hi!%20I%20want%20to%20order%20custom%20jersey.%20Order%20Number:%20${orderNum}%20.%20Design:%20${this.designElements.length}%20elements`;
        }
    }

    // Product Grid
    renderProductGrid() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 0; i < this.getJerseyCount(); i++) {
            const orderNum = this.getOrderNumber(i);
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-container">
                    <img src="${this.getJerseyImagePath(i)}" alt="Jersey ${orderNum}" class="product-img" loading="lazy" onerror="this.style.display='none'">
                    <div class="product-overlay">
                        <a href="https://wa.me/8801581872622?text=Hi!%20I%20want%20to%20order%20Jersey%20${orderNum}" class="btn btn-primary" target="_blank">
                            <i class="fab fa-whatsapp"></i> Order Now
                        </a>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">Premium Jersey ${orderNum}</h3>
                    <div class="product-meta">
                        <span>Customizable</span>
                        <span class="order-badge">#${orderNum}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }
    }

    // Graphics
    getGraphicsPath(cat, file) {
        const paths = {
            university: `University Logos/${file}`,
            bd: `Graphics/Bangladesh/${file}`,
            hearts: `Graphics/Hearts/${file}`,
            popular: `Banner and ads/${file}`
        };
        return paths[cat] || file;
    }

    loadGraphics(category) {
        const grid = document.getElementById('graphics-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        const files = {
            university: ['Brown Uni.png','Cornell 2.png','cornell.png','Dartmouth 2.png','dartmouth.png','harvard.png','harvard1.png','harvard3.png','ivy.png','princton.png','princton 2.png'],
            bd: [...Array(80).keys()].map(i => `tl (${i+1}).png`).concat(['tl.png','tl.jpg']),
            hearts: [...Array(88).keys()].map(i => `tl (${i+102}).png`),
            popular: ['Argentina jersey Player Edition.jpg','Arsenal.jpg','brazil jersey.jpeg','jc banner.jpeg']
        }[category] || [];

        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'graphic-item';
            div.innerHTML = `<img src="${this.getGraphicsPath(category, file)}" alt="Graphic" loading="lazy" onerror="this.parentElement.style.display='none'">`;
            div.onclick = () => this.addDesignElement({ type: 'image', src: this.getGraphicsPath(category, file), x: 150, y: 200, width: 100, height: 100 });
            grid.appendChild(div);
        });
    }

    // Canvas
    renderCanvas() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Base jersey
        if (this.baseImage.src) {
            this.ctx.drawImage(this.baseImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.renderPlaceholder();
            return;
        }

        // Color overlay
        const colorInput = document.getElementById('jersey-color');
        const opacityInput = document.getElementById('color-opacity');
        if (colorInput && opacityInput) {
            const opacity = parseInt(opacityInput.value) / 100;
            if (opacity > 0) {
                this.ctx.globalAlpha = opacity;
                this.ctx.fillStyle = colorInput.value;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.globalAlpha = 1.0;
            }
        }

        // Design elements
        this.designElements.forEach(el => {
            this.ctx.save();
            if (el.type === 'image') {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => this.renderCanvas();
                img.src = el.src;
                this.ctx.fillStyle = 'rgba(201,162,39,0.1)';
                this.ctx.fillRect(el.x, el.y, el.width, el.height);
            } else if (el.type === 'text') {
                this.ctx.font = `${el.bold ? 'bold ' : ''}${el.size}px ${el.font}`;
                this.ctx.fillStyle = el.color;
                this.ctx.fillText(el.text, el.x, el.y);
            }
            this.ctx.restore();
        });

        // Selection border
        if (this.selectedElement) {
            const el = this.selectedElement;
            this.ctx.strokeStyle = '#c9a227';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(el.x - 2, el.y - 2, el.width + 4, el.height + 4);
        }
    }

    addDesignElement(element) {
        this.designElements.push(element);
        this.selectedElement = element;
        this.saveHistory();
        this.updatePropertiesPanel();
        this.renderCanvas();
    }

    // Mouse handlers
    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    onMouseDown(e) {
        const coords = this.getCanvasCoords(e);
        this.isDragging = true;
        this.selectedElement = null;
        for (let i = this.designElements.length - 1; i >= 0; i--) {
            const el = this.designElements[i];
            if (coords.x >= el.x && coords.x <= el.x + el.width && coords.y >= el.y && coords.y <= el.y + el.height) {
                this.selectedElement = el;
                this.dragOffset = { x: coords.x - el.x, y: coords.y - el.y };
                break;
            }
        }
        this.renderCanvas();
    }

    onMouseMove(e) {
        if (!this.isDragging || !this.selectedElement) return;
        const coords = this.getCanvasCoords(e);
        this.selectedElement.x = coords.x - this.dragOffset.x;
        this.selectedElement.y = coords.y - this.dragOffset.y;
        this.renderCanvas();
    }

    onMouseUp() {
        if (this.isDragging && this.selectedElement) this.saveHistory();
        this.isDragging = false;
        this.updatePropertiesPanel();
    }

    onWheel(e) {
        e.preventDefault();
        this.zoomCanvas(e.deltaY > 0 ? -0.1 : 0.1);
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            const t = e.touches[0];
            this.onMouseDown({ clientX: t.clientX, clientY: t.clientY });
        }
    }

    onTouchMove(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            const t = e.touches[0];
            this.onMouseMove({ clientX: t.clientX, clientY: t.clientY });
        }
    }

    onTouchEnd() { this.onMouseUp(); }

    // Controls
    zoomCanvas(delta) {
        this.zoom = Math.max(0.5, Math.min(2, this.zoom + delta));
        this.canvas.style.transform = `scale(${this.zoom})`;
        document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
    }

    resetView() {
        this.zoom = 1;
        this.canvas.style.transform = 'scale(1)';
        document.getElementById('zoom-level').textContent = '100%';
    }

    clearCanvas() {
        if (confirm('Clear all design elements?')) {
            this.designElements = [];
            this.selectedElement = null;
            this.saveHistory();
            this.updatePropertiesPanel();
            this.renderCanvas();
        }
    }

    handleUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Upload an image'); return; }
        if (file.size > 10 * 1024 * 1024) { alert('Max 10MB'); return; }

        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                this.addDesignElement({
                    type: 'image',
                    src: evt.target.result,
                    x: 100, y: 100,
                    width: Math.min(200, img.width),
                    height: Math.min(200, img.height)
                });
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    // Text properties
    setupTextProperties() {
        const inputs = {
            text: document.getElementById('text-input'),
            font: document.getElementById('font-select'),
            size: document.getElementById('font-size'),
            color: document.getElementById('text-color'),
            bold: document.getElementById('text-bold')
        };
        const update = () => {
            if (this.selectedElement && this.selectedElement.type === 'text') this.renderCanvas();
        };
        inputs.text?.addEventListener('input', (e) => { if (this.selectedElement?.type === 'text') { this.selectedElement.text = e.target.value; update(); } });
        inputs.font?.addEventListener('change', (e) => { if (this.selectedElement?.type === 'text') { this.selectedElement.font = e.target.value; update(); } });
        inputs.size?.addEventListener('input', (e) => { if (this.selectedElement?.type === 'text') { this.selectedElement.size = parseInt(e.target.value); update(); } });
        inputs.color?.addEventListener('input', (e) => { if (this.selectedElement?.type === 'text') { this.selectedElement.color = e.target.value; update(); } });
        inputs.bold?.addEventListener('change', (e) => { if (this.selectedElement?.type === 'text') { this.selectedElement.bold = e.target.checked; update(); } });
    }

    setupColorControls() {
        const color = document.getElementById('jersey-color');
        const opacity = document.getElementById('color-opacity');
        const update = () => this.renderCanvas();
        color?.addEventListener('input', update);
        opacity?.addEventListener('input', (e) => { document.getElementById('opacity-val').textContent = e.target.value; update(); });
    }

    setupTextTool() {
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
                this.canvas.style.cursor = this.currentTool === 'select' ? 'default' : 'crosshair';
            });
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.currentTool === 'text' && !this.isDragging) {
                const coords = this.getCanvasCoords(e);
                const text = prompt('Enter text:', '');
                if (text) {
                    this.addDesignElement({
                        type: 'text',
                        text: text,
                        x: coords.x, y: coords.y,
                        font: 'Inter', size: 24, color: '#000000', bold: false,
                        width: 200, height: 30
                    });
                }
                document.querySelector('.tool-btn[data-tool="select"]').click();
            }
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Canvas
        this.canvas?.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas?.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas?.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas?.addEventListener('wheel', (e) => this.onWheel(e));
        this.canvas?.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas?.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas?.addEventListener('touchend', (e) => this.onTouchEnd(e));

        this.setupTextTool();
        this.setupTextProperties();
        this.setupColorControls();

        // Buttons
        document.getElementById('preview-design')?.addEventListener('click', () => this.showPreview());
        document.getElementById('download-design')?.addEventListener('click', () => this.downloadDesign());
        document.getElementById('clear-btn')?.addEventListener('click', () => this.clearCanvas());
        document.getElementById('undo-btn')?.addEventListener('click', () => this.undo());
        document.getElementById('redo-btn')?.addEventListener('click', () => this.redo());
        document.getElementById('zoom-in')?.addEventListener('click', () => this.zoomCanvas(0.1));
        document.getElementById('zoom-out')?.addEventListener('click', () => this.zoomCanvas(-0.1));
        document.getElementById('reset-view')?.addEventListener('click', () => this.resetView());

        // Upload
        document.getElementById('upload-design')?.addEventListener('change', (e) => this.handleUpload(e));

        // Tabs & Categories
        document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
            });
        });

        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadGraphics(btn.dataset.cat);
            });
        });

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterProducts(btn.dataset.filter);
            });
        });

        // Mobile menu
        document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
            document.getElementById('mobile-menu')?.classList.toggle('active');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') { e.preventDefault(); this.undo(); }
            if (e.ctrlKey && e.key === 'y') { e.preventDefault(); this.redo(); }
            if (e.key === 'Delete' && this.selectedElement) {
                this.designElements = this.designElements.filter(el => el !== this.selectedElement);
                this.selectedElement = null;
                this.saveHistory();
                this.renderCanvas();
            }
        });

        this.saveHistory();
    }

    updatePropertiesPanel() {
        const panel = document.getElementById('text-properties');
        if (this.selectedElement?.type === 'text') {
            panel.style.display = 'block';
            document.getElementById('text-input').value = this.selectedElement.text || '';
            document.getElementById('font-select').value = this.selectedElement.font || 'Inter';
            document.getElementById('font-size').value = this.selectedElement.size || 24;
            document.getElementById('text-color').value = this.selectedElement.color || '#000000';
            document.getElementById('text-bold').checked = this.selectedElement.bold || false;
        } else {
            panel.style.display = 'none';
        }
    }

    // History
    saveHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.stringify(this.designElements));
        this.historyIndex++;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.designElements = JSON.parse(this.history[this.historyIndex]);
            this.selectedElement = null;
            this.updatePropertiesPanel();
            this.renderCanvas();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.designElements = JSON.parse(this.history[this.historyIndex]);
            this.selectedElement = null;
            this.updatePropertiesPanel();
            this.renderCanvas();
        }
    }

    // Preview & Download
    showPreview() {
        const dataUrl = this.canvas.toDataURL('image/png');
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `<div class="modal-content"><button class="modal-close">&times;</button><img src="${dataUrl}" class="modal-img" alt="Preview"></div>`;
        document.body.appendChild(modal);
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    downloadDesign() {
        this.renderCanvas();
        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Jersey_${this.getOrderNumber(this.currentJersey)}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    filterProducts(filter) {
        document.querySelectorAll('.product-card').forEach(card => card.style.display = 'block');
    }
}

// Start
console.log('JerseyCentral initializing...');
window.jerseyCentral = new JerseyCentral();
console.log('JerseyCentral initialized');