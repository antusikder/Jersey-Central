// Populate jersey grid
const jerseyGrid = document.querySelector('.jersey-grid');
const jerseySelect = document.getElementById('jersey-select');
const jerseyImages = [
    'front_medium_extended.jpeg',
];

for (let i = 1; i <= 46; i++) {
    jerseyImages.push(`front_medium_extended (${i}).jpeg`);
}

// Populate select
jerseyImages.forEach((img, index) => {
    const option = document.createElement('option');
    option.value = img;
    option.textContent = `Jersey ${String(index + 1).padStart(3, '0')}`;
    jerseySelect.appendChild(option);
});

jerseyImages.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'jersey-item';
    item.innerHTML = `
        <img src="${img}" alt="Jersey ${index + 1}">
        <div class="info">
            <h3>Jersey ${String(index + 1).padStart(3, '0')}</h3>
            <p>Order Number: JC${String(index + 1).padStart(3, '0')}</p>
            <a href="https://wa.me/8801581872622?text=Hi, I want to order Jersey JC${String(index + 1).padStart(3, '0')}" class="whatsapp-btn">Order</a>
        </div>
    `;
    jerseyGrid.appendChild(item);
});

// Customization
const jerseySelect = document.getElementById('jersey-select');
const designUpload = document.getElementById('design-upload');
const previewBtn = document.getElementById('preview-btn');
const downloadBtn = document.getElementById('download-btn');
const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');

let jerseyImg = new Image();
let designImg = new Image();

jerseySelect.addEventListener('change', () => {
    jerseyImg.src = 'Banner and ads/' + jerseySelect.value;
});

designUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            designImg.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});

previewBtn.addEventListener('click', () => {
    if (jerseyImg.src && designImg.src) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(jerseyImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(designImg, 50, 100, 200, 200); // Adjust position
    }
});

downloadBtn.addEventListener('click', () => {
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom-jersey.png';
        a.click();
    });
});

// Initialize
jerseyImg.src = 'Banner and ads/front_medium_extended.jpeg';