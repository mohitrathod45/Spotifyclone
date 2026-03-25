const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas'); // npm install canvas

// Create directories
const directories = [
    'css',
    'js',
    'assets/images',
    'assets/songs'
];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created: ${dir}`);
    }
});

// Generate placeholder images
const images = [
    { name: 'logo.png', size: 200, bg: '#1ed760', text: 'SPOTIFY' },
    { name: 'default-cover.jpg', size: 300, bg: '#2a2a2a', text: 'MUSIC' },
    { name: 'album-1.jpg', size: 400, bg: '#ff6b6b', text: 'BLINDING LIGHTS' },
    { name: 'album-2.jpg', size: 400, bg: '#4ecdc4', text: 'LEVITATING' },
    { name: 'album-3.jpg', size: 400, bg: '#45b7d1', text: 'STAY' },
    { name: 'album-4.jpg', size: 400, bg: '#96ceb4', text: 'AS IT WAS' },
    { name: 'album-5.jpg', size: 400, bg: '#f4d03f', text: 'FLOWERS' },
    { name: 'album-6.jpg', size: 400, bg: '#e67e22', text: 'CRUEL SUMMER' }
];

images.forEach(img => {
    const canvas = createCanvas(img.size, img.size);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = img.bg;
    ctx.fillRect(0, 0, img.size, img.size);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${img.size * 0.1}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(img.text, img.size/2, img.size/2);
    
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(`assets/images/${img.name}`, buffer);
    console.log(`🖼️ Generated: ${img.name}`);
});

console.log('\n✅ Setup complete!');
console.log('📁 Folder structure created:');
console.log('spotify-clone/');
console.log('├── index.html');
console.log('├── css/style.css');
console.log('├── js/script.js');
console.log('├── assets/');
console.log('│   ├── images/ (8 images generated)');
console.log('│   └── songs/ (add your MP3 files here)');