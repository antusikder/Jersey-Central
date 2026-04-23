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
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.history = [];
        this.historyIndex = -1;

        this.init();
    }

    async init() {
        this.setupCanvas();
        this.populateJerseySelect();
        this.renderProductGrid();
        this.loadGraphics('university');
        this.setupEventListeners();
        
        // Hide loader and then load jersey
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
            this.loadJersey(0);
            this.updateOrderSummary();
        }, 800);
    }

    setupCanvas() {
        this.canvas = document.getElementById('editor-canvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        // Initial render with placeholder
        this.ctx.fillStyle = '#0d1117';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#c9a227';
        this.ctx.font = '16px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Select a jersey to start designing', this.canvas.width/2, this.canvas.height/2);
    }

    // Jersey Management
    getJerseyCount() {
        return 47;
    }

    getJerseyImagePath(index) {
        if (index === 0) return 'Banner and ads/front_medium_extended.jpeg';
        return `Banner and ads/front_medium_extended (${index}).jpeg`;
    }

    getOrderNumber(index) {
        return `JC${String(index + 1).padStart(3, '0')}`;
    }

    populateJerseySelect() {
        const select = document.getElementById('base-jersey-select');
        select.innerHTML = '';

        for (let i = 0; i < this.getJerseyCount(); i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Jersey ${this.getOrderNumber(i)}`;
            select.appendChild(option);
        }

        select.addEventListener('change', (e) => {
            this.loadJersey(parseInt(e.target.value));
        });
    }

    loadJersey(index) {
        this.currentJersey = index;
        const imgPath = this.getJerseyImagePath(index);
        
        // Show loading state immediately
        this.ctx.fillStyle = '#0d1117';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#c9a227';
        this.ctx.font = '16px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Loading Jersey ${this.getOrderNumber(index)}...`, this.canvas.width/2, this.canvas.height/2);
        
        this.baseImage.crossOrigin = 'anonymous';
        this.baseImage.onload = () => {
            this.renderCanvas();
            this.updateOrderSummary();
            this.updateJerseyPreview(index);
        };
        this.baseImage.onerror = () => {
            console.warn('Failed to load jersey:', imgPath);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#c9a227';
            this.ctx.font = '18px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Jersey Image', this.canvas.width/2, this.canvas.height/2 - 20);
            this.ctx.font = '14px Inter';
            this.ctx.fillStyle = '#666';
            this.ctx.fillText('Select a jersey from dropdown', this.canvas.width/2, this.canvas.height/2 + 20);
        };
        this.baseImage.src = imgPath;
    }

    updateJerseyPreview(index) {
        const previewImg = document.getElementById('base-jersey-img');
        previewImg.src = this.getJerseyImagePath(index);
    }

    updateOrderSummary() {
        document.getElementById('order-number').textContent = this.getOrderNumber(this.currentJersey);
        document.getElementById('order-jersey-name').textContent = `Jersey ${this.getOrderNumber(this.currentJersey)}`;
        document.getElementById('design-count').textContent = `${this.designElements.length} elements`;

        const whatsappBtn = document.getElementById('whatsapp-order');
        const orderNum = this.getOrderNumber(this.currentJersey);
        whatsappBtn.href = `https://wa.me/8801581872622?text=Hi!%20I%20want%20to%20order%20custom%20jersey.%20Order%20Number:%20${orderNum}%20.%20Design:%20${this.designElements.length}%20elements`;
    }

    // Product Grid
    renderProductGrid() {
        const grid = document.getElementById('product-grid');
        grid.innerHTML = '';

        for (let i = 0; i < this.getJerseyCount(); i++) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-container">
                    <img src="${this.getJerseyImagePath(i)}" alt="Jersey ${this.getOrderNumber(i)}" class="product-img" loading="lazy" onerror="this.style.display='none'">
                    <div class="product-overlay">
                        <a href="https://wa.me/8801581872622?text=Hi!%20I%20want%20to%20order%20Jersey%20${this.getOrderNumber(i)}" class="btn btn-primary" target="_blank">
                            <i class="fab fa-whatsapp"></i> Order Now
                        </a>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">Premium Jersey ${this.getOrderNumber(i)}</h3>
                    <div class="product-meta">
                        <span>Customizable</span>
                        <span class="order-badge">#${this.getOrderNumber(i)}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        }
    }

    // Graphics Loading
    getGraphicsPath(category, filename) {
        const paths = {
            university: `University Logos/${filename}`,
            bd: `Graphics/Bangladesh/${filename}`,
            hearts: `Graphics/Hearts/${filename}`,
            popular: `Banner and ads/${filename}`
        };
        return paths[category] || filename;
    }

    loadGraphics(category) {
        const grid = document.getElementById('graphics-grid');
        grid.innerHTML = '';

        let files = [];
        switch (category) {
            case 'university':
                files = ['Brown Uni.png', 'Cornell 2.png', 'cornell.png', 'Dartmouth 2.png', 'dartmouth.png', 'harvard.png', 'harvard1.png', 'harvard3.png', 'ivy.png', 'princton.png', 'princton 2.png'];
                break;
            case 'bd':
                files = Array.from({length: 80}, (_, i) => `tl (${i+1}).png`);
                files.push('tl.png', 'tl.jpg');
                break;
            case 'hearts':
                files = Array.from({length: 88}, (_, i) => `tl (${i+102}).png`);
                break;
            case 'popular':
                files = ['Argentina jersey Player Edition.jpg', 'Arsenal.jpg', 'brazil jersey.jpeg', 'jc banner.jpeg'];
                break;
        }

        files.forEach((file, idx) => {
            const div = document.createElement('div');
            div.className = 'graphic-item';
            div.innerHTML = `<img src="${this.getGraphicsPath(category, file)}" alt="Graphic ${idx}" loading="lazy" onerror="this.parentElement.style.display='none'">`;
            div.addEventListener('click', () => {
                this.addDesignElement({
                    type: 'image',
                    src: this.getGraphicsPath(category, file),
                    x: 150,
                    y: 200,
                    width: 100,
                    height: 100
                });
            });
            grid.appendChild(div);
        });
    }

    // Canvas Rendering
    renderCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw base jersey or placeholder
        if (this.baseImage.src) {
            this.ctx.drawImage(this.baseImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#666';
            this.ctx.font = '20px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Select a jersey to begin', this.canvas.width/2, this.canvas.height/2);
        }

        // Apply jersey color overlay if set
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

        // Draw all design elements
        this.designElements.forEach(el => {
            this.ctx.save();
            if (el.type === 'image') {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                // Draw immediately with placeholder, will update when loaded
                this.ctx.fillStyle = 'rgba(201,162,39,0.1)';
                this.ctx.fillRect(el.x, el.y, el.width, el.height);
                img.onload = () => {
                    this.renderCanvas(); // Redraw when image loads
                };
                img.src = el.src;
            } else if (el.type === 'text') {
                this.ctx.font = `${el.bold ? 'bold ' : ''}${el.size}px ${el.font}`;
                this.ctx.fillStyle = el.color;
                this.ctx.fillText(el.text, el.x, el.y);
            }
            this.ctx.restore();
        });

        // Draw selection border if element selected
        if (this.selectedElement) {
            const el = this.selectedElement;
            this.ctx.strokeStyle = '#ff3b3b';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeRect(el.x - 2, el.y - 2, el.width + 4, el.height + 4);
        }

        this.updateOrderSummary();
    }

    addDesignElement(element) {
        this.designElements.push(element);
        this.selectedElement = element;
        this.saveHistory();
        this.updatePropertiesPanel();
        this.renderCanvas();
    }

    // Event Listeners
    setupEventListeners() {
        // Canvas mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));

        // Tool selection
        this.currentTool = 'select';
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
                this.canvas.style.cursor = this.currentTool === 'select' ? 'default' : 'crosshair';
            });
        });

        // Canvas click for adding elements
        this.canvas.addEventListener('click', (e) => {
            if (this.currentTool === 'text' && !this.isDragging) {
                const coords = this.getCanvasCoords(e);
                const text = prompt('Enter text:', '');
                if (text) {
                    this.addDesignElement({
                        type: 'text',
                        text: text,
                        x: coords.x,
                        y: coords.y,
                        font: 'Inter',
                        size: 24,
                        color: '#000000',
                        bold: false,
                        width: 200,
                        height: 30
        });
    }

    setupTextProperties() {
        const textInput = document.getElementById('text-input');
        const fontSelect = document.getElementById('font-select');
        const fontSize = document.getElementById('font-size');
        const textColor = document.getElementById('text-color');
        const textBold = document.getElementById('text-bold');

        const updateText = () => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.renderCanvas();
            }
        };

        textInput.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.text = e.target.value;
                updateText();
            }
        });

        fontSelect.addEventListener('change', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.font = e.target.value;
                updateText();
            }
        });

        fontSize.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.size = parseInt(e.target.value);
                updateText();
            }
        });

        textColor.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.color = e.target.value;
                updateText();
            }
        });

        textBold.addEventListener('change', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.bold = e.target.checked;
                updateText();
            }
        });
    }

    setupColorControls() {
        const colorInput = document.getElementById('jersey-color');
        const opacityInput = document.getElementById('color-opacity');
        const opacityVal = document.getElementById('opacity-val');

        const updateOverlay = () => {
            this.renderCanvas();
        };

        colorInput.addEventListener('input', updateOverlay);
        opacityInput.addEventListener('input', (e) => {
            opacityVal.textContent = e.target.value;
            updateOverlay();
        });
    }
        });

        // Color overlay controls
        this.setupColorControls();
    }

    setupTextProperties() {
        const textInput = document.getElementById('text-input');
        const fontSelect = document.getElementById('font-select');
        const fontSize = document.getElementById('font-size');
        const textColor = document.getElementById('text-color');
        const textBold = document.getElementById('text-bold');

        textInput.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.text = e.target.value;
                this.renderCanvas();
            }
        });

        fontSelect.addEventListener('change', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.font = e.target.value;
                this.renderCanvas();
            }
        });

        fontSize.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.size = parseInt(e.target.value);
                this.renderCanvas();
            }
        });

        textColor.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.color = e.target.value;
                this.renderCanvas();
            }
        });

        textBold.addEventListener('change', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.bold = e.target.checked;
                this.renderCanvas();
            }
        });
    }

        // Buttons
        document.getElementById('preview-design').addEventListener('click', () => this.showPreview());
        document.getElementById('download-design').addEventListener('click', () => this.downloadDesign());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('zoom-in').addEventListener('click', () => this.zoomCanvas(0.1));
        document.getElementById('zoom-out').addEventListener('click', () => this.zoomCanvas(-0.1));
        document.getElementById('reset-view').addEventListener('click', () => this.resetView());

        // Upload
        document.getElementById('upload-design').addEventListener('change', (e) => this.handleUpload(e));

        // Tabs
        document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });

        // Graphics categories
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

        // Text tool
        document.getElementById('text-input').addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.text = e.target.value;
                this.renderCanvas();
            }
        });

        // Mobile menu
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('active');
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

        // Initial history save
        this.saveHistory();
    }

    setupTextProperties() {
        const textInput = document.getElementById('text-input');
        const fontSelect = document.getElementById('font-select');
        const fontSize = document.getElementById('font-size');
        const textColor = document.getElementById('text-color');
        const textBold = document.getElementById('text-bold');

        textInput.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.text = e.target.value;
                this.renderCanvas();
            }
        });

        fontSelect.addEventListener('change', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.font = e.target.value;
                this.renderCanvas();
            }
        });

        fontSize.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.size = parseInt(e.target.value);
                this.renderCanvas();
            }
        });

        textColor.addEventListener('input', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.color = e.target.value;
                this.renderCanvas();
            }
        });

        textBold.addEventListener('change', (e) => {
            if (this.selectedElement && this.selectedElement.type === 'text') {
                this.selectedElement.bold = e.target.checked;
                this.renderCanvas();
            }
        });
    }

    // Mouse/Touch handlers
    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    onMouseDown(e) {
        const coords = this.getCanvasCoords(e);
        this.isDragging = true;
        this.dragStart = coords;

        // Check if clicking on an element
        this.selectedElement = null;
        for (let i = this.designElements.length - 1; i >= 0; i--) {
            const el = this.designElements[i];
            if (coords.x >= el.x && coords.x <= el.x + el.width &&
                coords.y >= el.y && coords.y <= el.y + el.height) {
                this.selectedElement = el;
                break;
            }
        }

        if (this.selectedElement) {
            this.dragOffset = {
                x: coords.x - this.selectedElement.x,
                y: coords.y - this.selectedElement.y
            };
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

    onMouseUp(e) {
        if (this.isDragging && this.selectedElement) {
            this.saveHistory();
        }
        this.isDragging = false;
        this.updatePropertiesPanel();
        this.renderCanvas();
    }

    onWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.zoomCanvas(delta);
    }

    // Touch
    onTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    onTouchMove(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    onTouchEnd(e) {
        this.onMouseUp(e);
    }

    // Canvas controls
    zoomCanvas(delta) {
        this.zoom = Math.max(0.5, Math.min(2, this.zoom + delta));
        this.canvas.style.transform = `scale(${this.zoom})`;
        document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
    }

    resetView() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
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

    // Upload handling
    handleUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File too large. Max 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.addDesignElement({
                    type: 'image',
                    src: event.target.result,
                    x: 100,
                    y: 100,
                    width: Math.min(200, img.width),
                    height: Math.min(200, img.height)
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    // History (Undo/Redo)
    saveHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.stringify(this.designElements));
        this.historyIndex++;
    }

    updatePropertiesPanel() {
        const panel = document.getElementById('text-properties');
        if (this.selectedElement && this.selectedElement.type === 'text') {
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
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="${dataUrl}" class="modal-img" alt="Design Preview">
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
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
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => card.style.display = 'block'); // Simplified
    }
}

// Initialize immediately (script has defer)
window.jerseyCentral = new JerseyCentral();