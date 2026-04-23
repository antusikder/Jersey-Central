// Jersey Central - Premium Custom Jerseys
// Order via WhatsApp: +8801581872622

(function() {
    'use strict';

    // State variables
    let currentJerseyIndex = 0;
    let currentPosition = 'front';
    let currentGraphics = [];

    // DOM Elements
    const jerseyGrid = document.getElementById('jersey-grid');
    const jerseySelect = document.getElementById('jersey-select');
    const graphicsGrid = document.getElementById('graphics-grid');
    const previewCanvas = document.getElementById('preview-canvas');
    const ctx = previewCanvas.getContext('2d');
    const jerseyImg = new Image();
    const designImg = new Image();
    const orderNumberDisplay = document.getElementById('order-number-display');
    const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');

    // Jersey images array
    const jerseyImages = [];
    for (let i = 0; i <= 46; i++) {
        jerseyImages.push(i === 0 ? 'front_medium_extended.jpeg' : `front_medium_extended (${i}).jpeg`);
    }

    // Graphics categories
    const graphicsData = {
        university: getUniversityLogos(),
        bd: getBangladeshGraphics(),
        hearts: getHeartsGraphics(),
        popular: getPopularGraphics()
    };

    function getUniversityLogos() {
        const logos = [];
        ['Brown Uni.png', 'Cornell 2.png', 'cornell.png', 'Dartmouth 2.png', 'dartmouth 3.png',
         'Dartmouth 4.png', 'dartmouth.png', 'harvard.png', 'harvard1.png', 'harvard3.png',
         'images.png', 'ivy.png', 'princton.png', 'princton 2.png'];
        return logos;
    }

    function getBangladeshGraphics() {
        return Array.from({length: 80}, (_, i) => `tl (${i+1}).png`).concat(['tl.png', 'tl.jpg']);
    }

    function getHeartsGraphics() {
        return Array.from({length: 88}, (_, i) => `tl (${i+102}).png`);
    }

    function getPopularGraphics() {
        return ['Banner and ads/Argentina jersey Player Edition.jpg', 'Banner and ads/Arsenal.jpg'];
    }

    // Initialize
    function init() {
        populateJerseySelect();
        populateJerseyGrid();
        loadJersey(0);
        setupEventListeners();
    }

    // Populate jersey dropdown
    function populateJerseySelect() {
        jerseyImages.forEach((img, index) => {
            const option = document.createElement('option');
            option.value = img;
            option.textContent = `Jersey ${String(index + 1).padStart(3, '0')} - Order #JC${String(index + 1).padStart(3, '0')}`;
            jerseySelect.appendChild(option);
        });
    }

    // Populate jersey grid
    function populateJerseyGrid() {
        jerseyGrid.innerHTML = '';
        jerseyImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'jersey-item';
            item.innerHTML = `
                <img src="Banner and ads/${img}" alt="Jersey ${index + 1}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23667eea%22 width=%22300%22 height=%22200%22/%3E%3Ctext fill=%22white%22 x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22%3EImage Missing%3C/text%3E%3C/svg%3E'">
                <div class="info">
                    <h3>Jersey ${String(index + 1).padStart(3, '0')}</h3>
                    <p>Order Number: JC${String(index + 1).padStart(3, '0')}</p>
                    <a href="https://wa.me/8801581872622?text=Hi, I want to order Jersey JC${String(index + 1).padStart(3, '0')}" class="whatsapp-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> Order via WhatsApp
                    </a>
                </div>
            `;
            item.addEventListener('click', () => {
                jerseySelect.selectedIndex = index;
                loadJersey(index);
                window.scrollTo({ top: document.getElementById('customization').offsetTop - 100, behavior: 'smooth' });
            });
            jerseyGrid.appendChild(item);
        });
    }

    // Load jersey image
    function loadJersey(index) {
        currentJerseyIndex = index;
        const imgPath = `Banner and ads/${jerseyImages[index]}`;
        jerseyImg.crossOrigin = 'anonymous';
        jerseyImg.onload = () => updateOrderDisplay();
        jerseyImg.onerror = () => console.warn('Failed to load:', imgPath);
        jerseyImg.src = imgPath;
    }

    // Update order display
    function updateOrderDisplay() {
        const orderNum = `JC${String(currentJerseyIndex + 1).padStart(3, '0')}`;
        orderNumberDisplay.textContent = `Order #${orderNum}`;
        whatsappOrderBtn.href = `https://wa.me/8801581872622?text=Hi!%20I%20want%20to%20order%20custom%20jersey%20with%20Order%20Number%20${orderNum}`;
    }

    // Setup event listeners
    function setupEventListeners() {
        jerseySelect.addEventListener('change', () => loadJersey(jerseySelect.selectedIndex));

        document.getElementById('design-upload').addEventListener('change', handleDesignUpload);

        document.getElementById('preview-btn').addEventListener('click', previewDesign);

        document.getElementById('download-btn').addEventListener('click', downloadDesign);

        document.getElementById('reset-btn').addEventListener('click', resetDesign);

        document.querySelectorAll('.pos-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPosition = btn.dataset.pos;
            });
        });

        // Setup filter/tab functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterJerseys(btn.dataset.filter);
            });
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadGraphics(btn.dataset.tab);
            });
        });
    }

    // Handle design upload
    function handleDesignUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG)');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size should be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            designImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Preview design
    function previewDesign() {
        if (!jerseyImg.src || !designImg.src) {
            alert('Please select a jersey and upload a design');
            return;
        }

        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        ctx.drawImage(jerseyImg, 0, 0, previewCanvas.width, previewCanvas.height);

        let x = 50, y = 100, w = 300, h = 200;

        switch(currentPosition) {
            case 'front':
                x = 50; y = 100; w = 300; h = 200;
                break;
            case 'back':
                x = 50; y = 280; w = 300; h = 200;
                break;
            case 'sleeve':
                x = 70; y = 120; w = 100; h = 100;
                break;
        }

        ctx.drawImage(designImg, x, y, w, h);
    }

    // Download design
    function downloadDesign() {
        previewDesign();
        previewCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Jersey_JC${String(currentJerseyIndex + 1).padStart(3, '0')}_${currentPosition}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Reset design
    function resetDesign() {
        document.getElementById('design-upload').value = '';
        designImg.src = '';
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    }

    // Load graphics for a category
    function loadGraphics(category) {
        graphicsGrid.innerHTML = '';
        currentGraphics = graphicsData[category] || [];

        currentGraphics.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'graphics-item';
            item.innerHTML = `
                <img src="${getGraphicsPath(category, file)}" alt="Graphic ${index}" loading="lazy" onerror="this.style.display='none'">
            `;
            item.addEventListener('click', () => {
                designImg.src = `${getGraphicsPath(category, file)}`;
                document.getElementById('design-upload').value = '';
                alert('Graphic loaded! Go to Preview to see it on your jersey.');
            });
            graphicsGrid.appendChild(item);
        });
    }

    function getGraphicsPath(category, file) {
        if (category === 'university') return `University Logos/${file}`;
        if (category === 'bd') return `Graphics/Bangladesh/${file}`;
        if (category === 'hearts') return `Graphics/Hearts/${file}`;
        if (category === 'popular') return file;
        return file;
    }

    function filterJerseys(filter) {
        // Simplified filter - all jerseys shown
        document.querySelectorAll('.jersey-item').forEach(item => item.style.display = 'block');
    }

    // Expose order number to global scope for WhatsApp link
    window.getOrderNumber = function() {
        return `JC${String(currentJerseyIndex + 1).padStart(3, '0')}`;
    };

    // Start
    document.addEventListener('DOMContentLoaded', init);
})();