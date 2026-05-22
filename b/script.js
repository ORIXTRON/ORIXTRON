document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Animasi Bar Skills (Horizontal)
    const skillBars = document.querySelectorAll('.progress-fill');
    setTimeout(() => {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }, 500);

    // 2. Animasi Grafik Rata-rata (Vertikal)
    const statBars = document.querySelectorAll('.stat-bar');
    setTimeout(() => {
        statBars.forEach(bar => {
            const height = bar.getAttribute('data-height');
            bar.style.height = height;
        });
    }, 800); 

    // 3. Efek Mengetik Nama
    const nameElement = document.getElementById('typewriter');
    const originalText = nameElement.innerText;
    nameElement.innerText = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            nameElement.innerText += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100 + Math.random() * 50); // Random typing speed
        }
    }
    setTimeout(typeWriter, 800);

    // 4. Generate Background Particles (Efek tambahan dari script utama)
    const particleContainer = document.getElementById('particles-js');
    const particleCount = 20; 

    for(let j = 0; j < particleCount; j++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning and animation properties
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`; // 10-20s duration
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particleContainer.appendChild(particle);
    }
});