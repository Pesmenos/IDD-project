// =============================================
// SCROLL EFFECT OBSERVER
// =============================================
window.addEventListener('load', function() {
    
    // Select all content sections AND the footer
    const sections = document.querySelectorAll('.content-section');
    const footer = document.querySelector('.footer');
    
    console.log(`Found ${sections.length} sections to observe`);
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(`Section became visible:`, entry.target);
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px"
    });
    
    // Observe each section
    sections.forEach((section, index) => {
        observer.observe(section);
    });
    
    // Observe the footer too
    if (footer) {
        observer.observe(footer);
    }
    
    // =============================================
    // 3D MODEL SETUP - FLOATING BUTTON
    // =============================================
    initFloating3DButton();
    
});

// =============================================
// FLOATING 3D BUTTON WITH POPUP FORM
// =============================================
function initFloating3DButton() {
    // Get the container - we'll repurpose the existing one
    const container = document.getElementById('model-container');
    if (!container) {
        console.log('Model container not found');
        return;
    }
    
    console.log('Creating floating 3D button...');
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = null;
    
    // Create camera - ADJUSTED for perfect centering
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000); // Aspect ratio 1:1 for square
    camera.position.set(0, 0.5, 3.5); // Centered view
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(150, 150); // Smaller size for button
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Style the container to be a floating button
    container.style.position = 'fixed';
    container.style.left = '20px';
    container.style.top = '50%';
    container.style.transform = 'translateY(-50%)';
    container.style.width = '150px';
    container.style.height = '150px';
    container.style.borderRadius = '50%';
    container.style.cursor = 'pointer';
    container.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.6)';
    container.style.border = '3px solid rgba(255, 60, 60, 0.8)';
    container.style.transition = 'all 0.3s ease';
    container.style.zIndex = '1000';
    container.style.pointerEvents = 'auto';
    container.style.opacity = '1';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.overflow = 'hidden'; // Ensure nothing spills out
    
    // Hover effect
    container.addEventListener('mouseenter', () => {
        container.style.transform = 'translateY(-50%) scale(1.1)';
        container.style.boxShadow = '0 0 40px rgba(255, 0, 0, 0.9)';
    });
    
    container.addEventListener('mouseleave', () => {
        container.style.transform = 'translateY(-50%) scale(1)';
        container.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.6)';
    });
    
    // Add lights - brighter and more balanced for centering
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);
    
    const redLight = new THREE.PointLight(0xff5555, 1.0);
    redLight.position.set(1, 1, 2);
    scene.add(redLight);
    
    const backLight = new THREE.PointLight(0x3366ff, 0.4);
    backLight.position.set(-1, 0.5, -2);
    scene.add(backLight);
    
    // =============================================
    // CREATE THE DEFAULT 3D MODEL (RED CRYSTAL)
    // =============================================
    const group = new THREE.Group();
    
    // Main central shape (octahedron) - perfectly centered
    const geo1 = new THREE.OctahedronGeometry(0.9, 0);
    const mat1 = new THREE.MeshStandardMaterial({ 
        color: 0xaa3333,
        emissive: 0x331111,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: 0.9
    });
    const mainShape = new THREE.Mesh(geo1, mat1);
    mainShape.castShadow = true;
    mainShape.receiveShadow = true;
    mainShape.position.set(0, 0, 0); // Explicitly center
    group.add(mainShape);
    
    // Inner glow (smaller shape) - centered
    const geo2 = new THREE.IcosahedronGeometry(0.6, 1);
    const mat2 = new THREE.MeshStandardMaterial({ 
        color: 0xff5555,
        emissive: 0x442222,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7
    });
    const innerShape = new THREE.Mesh(geo2, mat2);
    innerShape.castShadow = true;
    innerShape.receiveShadow = true;
    innerShape.position.set(0, 0, 0); // Explicitly center
    group.add(innerShape);
    
    // Add surrounding ring - centered
    const ringGeo = new THREE.TorusGeometry(1.1, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ 
        color: 0xff3333,
        emissive: 0x220000,
        transparent: true,
        opacity: 0.5
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = 0.3;
    ring.position.set(0, 0, 0); // Explicitly center
    group.add(ring);
    
    // Add floating particles around the model - centered orbit
    const particleCount = 20;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 1.4;
        const height = Math.sin(angle * 3) * 0.6;
        
        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = height;
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius * 0.5;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMat = new THREE.PointsMaterial({ 
        color: 0xff6666,
        size: 0.07,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.set(0, 0, 0); // Center the particles
    group.add(particles);
    
    scene.add(group);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the group smoothly
        group.rotation.y += 0.008;
        group.rotation.x += 0.003;
        
        // Pulse particles
        const time = Date.now() * 0.002;
        particles.material.opacity = 0.5 + Math.sin(time) * 0.3;
        
        renderer.render(scene, camera);
    }
    animate();
    
    // =============================================
    // POPUP FORM HTML
    // =============================================
    
    // Create popup overlay
    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'popup-overlay';
    popupOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 2000;
        display: none;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.id = 'popup-content';
    popupContent.style.cssText = `
        background-color: rgba(60, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        padding: 40px;
        border-radius: 20px;
        border: 2px solid rgba(255, 60, 60, 0.8);
        box-shadow: 0 0 50px rgba(255, 0, 0, 0.5);
        max-width: 400px;
        width: 90%;
        color: #ffcccc;
        font-family: Arial, sans-serif;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    // Popup inner HTML
    popupContent.innerHTML = `
        <h2 style="color: #ff6666; margin-bottom: 20px; text-align: center; font-size: 24px;">📦 Enter Delivery Details</h2>
        
        <form id="delivery-form">
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; color: #ffaaaa;">Full Name</label>
                <input type="text" id="name" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255, 60, 60, 0.5); background-color: rgba(20, 0, 0, 0.8); color: #ffcccc; font-size: 16px;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; color: #ffaaaa;">Street Address</label>
                <input type="text" id="address" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255, 60, 60, 0.5); background-color: rgba(20, 0, 0, 0.8); color: #ffcccc; font-size: 16px;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; color: #ffaaaa;">Zip Code</label>
                <input type="text" id="zipcode" required pattern="[0-9]{5}" title="Please enter a valid 5-digit zip code" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255, 60, 60, 0.5); background-color: rgba(20, 0, 0, 0.8); color: #ffcccc; font-size: 16px;">
            </div>
            
            <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(45deg, #660000, #990000); color: white; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; transition: all 0.3s; border: 1px solid rgba(255, 100, 100, 0.5); margin-top: 10px;">Submit Details</button>
        </form>
        
        <p style="text-align: center; margin-top: 15px; font-size: 12px; color: #ff8888;">Click outside to close</p>
    `;
    
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
    
    // =============================================
    // POPUP EVENT HANDLERS
    // =============================================
    
    // Click on 3D button to show popup
    container.addEventListener('click', (e) => {
        e.stopPropagation();
        popupOverlay.style.display = 'flex';
        setTimeout(() => {
            popupOverlay.style.opacity = '1';
            popupContent.style.transform = 'scale(1)';
        }, 10);
    });
    
    // Click on overlay (outside popup) to close
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.style.opacity = '0';
            popupContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                popupOverlay.style.display = 'none';
            }, 300);
        }
    });
    
    // Handle form submission
    const form = document.getElementById('delivery-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const zipcode = document.getElementById('zipcode').value;
        
        // Simple validation
        if (name && address && zipcode) {
            console.log('Delivery Details:', { name, address, zipcode });
            
            // Show success message
            alert(`Thank you ${name}! Your delivery will be sent to ${address}.`);
            
            // Close popup
            popupOverlay.style.opacity = '0';
            popupContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                popupOverlay.style.display = 'none';
                form.reset();
            }, 300);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        renderer.setSize(150, 150);
    });
    
    console.log('✅ Floating 3D button with centered model created!');
}

// Helper function to add a hint (kept for compatibility)
function addModelHint() {
    // Not needed for floating button
}

// =============================================
// RIGHT SIDEBAR AND NAVIGATION FUNCTIONS
// =============================================

// Toggle sidebar menu open/closed
function toggleSidebar() {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (sidebarMenu) {
        sidebarMenu.classList.toggle('open');
    }
}

// Close sidebar when clicking outside
document.addEventListener('click', function(event) {
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarImage = document.querySelector('.sidebar-image');
    
    if (sidebarMenu && sidebarMenu.classList.contains('open') && 
        !sidebarMenu.contains(event.target) && 
        sidebarImage && !sidebarImage.contains(event.target)) {
        sidebarMenu.classList.remove('open');
    }
});

// Navigate to outlets page
function navigateToOutlets() {
    window.location.href = 'outlets.html';
}

// =============================================
// NEW: Navigate to shop page
// =============================================
function navigateToShop() {
    window.location.href = 'shop.html';
}

// Show coming soon message for other menu items
function showComingSoon() {
    alert('This feature is coming soon!');
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (sidebarMenu) {
        sidebarMenu.classList.remove('open');
    }
}

// =============================================
// GOOGLE MAPS FUNCTIONS
// =============================================

function openMap(location) {
    let url = '';
    let locationName = '';
    
    switch(location) {
        case 1:
            url = 'https://www.google.com/maps/search/?api=1&query=Dover+MRT+Station+Singapore';
            locationName = 'Dover MRT Station';
            break;
        case 2:
            url = 'https://www.google.com/maps/search/?api=1&query=Singapore+Polytechnic+Dover+Singapore';
            locationName = 'Singapore Polytechnic';
            break;
        case 3:
            url = 'https://www.google.com/maps/search/?api=1&query=Media+Arts+and+Design+School+Singapore+Polytechnic';
            locationName = 'MAD School';
            break;
        default:
            return;
    }
    
    console.log(`Opening map for: ${locationName}`);
    window.open(url, '_blank');
}

// =============================================
// IMAGE SLIDER FUNCTIONS (keeping for compatibility)
// =============================================

let currentSlide = 1;
const totalSlides = 3;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return; // Not on outlets page with slider
    
    // Remove active class from current slide and dot
    slides[currentSlide - 1].classList.remove('active');
    if (dots.length) dots[currentSlide - 1].classList.remove('active-dot');
    
    // Update current slide
    currentSlide += direction;
    
    // Loop around
    if (currentSlide < 1) currentSlide = totalSlides;
    if (currentSlide > totalSlides) currentSlide = 1;
    
    // Add active class to new slide and dot
    slides[currentSlide - 1].classList.add('active');
    if (dots.length) dots[currentSlide - 1].classList.add('active-dot');
}

function goToSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return; // Not on outlets page with slider
    
    // Remove active class from current slide and dot
    slides[currentSlide - 1].classList.remove('active');
    if (dots.length) dots[currentSlide - 1].classList.remove('active-dot');
    
    // Set new current slide
    currentSlide = slideNumber;
    
    // Add active class to new slide and dot
    slides[currentSlide - 1].classList.add('active');
    if (dots.length) dots[currentSlide - 1].classList.add('active-dot');
}

// =============================================
// PAGE SPECIFIC INITIALIZATION
// =============================================

// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the outlets page
    if (window.location.pathname.includes('outlets.html') || 
        document.querySelector('.outlets-grid')) {
        console.log('On outlets page - ready for interaction');
    }
    
    // Check if we're on the shop page
    if (window.location.pathname.includes('shop.html') || 
        document.querySelector('.product-container')) {
        console.log('On shop page - ready for interaction');
    }
    
    // Check if we're on a page with the image slider (keeping for compatibility)
    if (document.querySelector('.slider')) {
        currentSlide = 1;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length) {
            // Ensure first slide is active
            slides.forEach((slide, index) => {
                if (index === 0) slide.classList.add('active');
                else slide.classList.remove('active');
            });
            
            // Ensure first dot is active
            dots.forEach((dot, index) => {
                if (index === 0) dot.classList.add('active-dot');
                else dot.classList.remove('active-dot');
            });
        }
    }
});