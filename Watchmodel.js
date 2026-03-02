// =============================================
// HERO SECTION 3D MODEL
// =============================================

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    initHeroModel();
});

function initHeroModel() {
    // Get the hero image section
    const heroSection = document.querySelector('.hero-image');
    if (!heroSection) {
        console.log('Hero section not found');
        return;
    }
    
    console.log('🎯 Initializing 3D model in hero section...');
    
    // Create a container for the 3D model within the hero section
    const modelContainer = document.createElement('div');
    modelContainer.id = 'hero-model-container';
    heroSection.appendChild(modelContainer);
    
    // Style the container
    modelContainer.style.position = 'absolute';
    modelContainer.style.top = '0';
    modelContainer.style.left = '0';
    modelContainer.style.width = '100%';
    modelContainer.style.height = '100%';
    modelContainer.style.zIndex = '5'; // Above background but below text
    modelContainer.style.pointerEvents = 'none'; // Allow clicking through to hero text
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent to show hero background
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 8); // Positioned to see the model
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent
    modelContainer.appendChild(renderer.domElement);
    
    // =============================================
    // ADD LIGHTS (Keep these - they make your model look good)
    // =============================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased brightness
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(2, 5, 5);
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-2, 3, 5);
    scene.add(directionalLight2);
    
    const redLight = new THREE.PointLight(0xff5555, 1.0);
    redLight.position.set(-3, 2, 4);
    scene.add(redLight);
    
    const backLight = new THREE.PointLight(0x88aaff, 0.5);
    backLight.position.set(0, 1, -5);
    scene.add(backLight);
    
    // =============================================
    // LOAD YOUR CUSTOM MODEL (Replace the crystal with this)
    // =============================================
    
    // IMPORTANT: Change 'your-model.glb' to your actual model filename
    const modelPath = 'chronograph_watch.glb'; // <-- CHANGE THIS TO YOUR MODEL'S FILENAME
    
    console.log('📁 Attempting to load model:', modelPath);
    
    const loader = new THREE.GLTFLoader();
    
    loader.load(modelPath, 
        // Success callback - model loaded successfully
        function(gltf) {
            console.log('✅ Custom model loaded successfully:', modelPath);
            
            const model = gltf.scene;
            
            // Center and scale the model to fit nicely in the hero section
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Scale to fit - adjust the 3.5 to make it bigger or smaller
            const scale = 8 / maxDim;
            model.scale.set(scale, scale, scale);
            
            // Center the model
            model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
            
            // Optional: Add a slight rotation to face the camera better
            model.rotation.y = 0.5;
            
            scene.add(model);
            
            console.log('✅ Model added to scene. Scale:', scale);
            console.log('📐 Model size:', size);
        },
        // Progress callback
        function(xhr) {
            const percent = Math.floor(xhr.loaded / xhr.total * 100);
            console.log(`📊 Loading progress: ${percent}%`);
        },
        // Error callback
        function(error) {
            console.error('❌ Failed to load model:', error);
            console.log('⚠️ Please check:');
            console.log('   1. Filename is correct (case-sensitive!)');
            console.log('   2. File is in the same folder as index.html');
            console.log('   3. File format is .glb or .gltf');
            
            // Fallback: Create a simple red crystal so something shows
            createFallbackModel(scene);
        }
    );
    
    // =============================================
    // ADD BACKGROUND STARS (Keep these for effect)
    // =============================================
    const starGeo = new THREE.BufferGeometry();
    const starCount = 100;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 30;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
    }
    
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xaa8888, size: 0.05, transparent: true, opacity: 0.3 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    
    // =============================================
    // ADD CONTROLS (optional - for interactivity)
    // =============================================
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 3;
    controls.maxDistance = 12;
    controls.enabled = true; // Enable for testing (you can set to false later)
    
    // =============================================
    // ANIMATION LOOP
    // =============================================
    function animate() {
        requestAnimationFrame(animate);
        
        // Update controls
        controls.update();
        
        // Rotate stars slowly
        stars.rotation.y += 0.0003;
        
        renderer.render(scene, camera);
    }
    animate();
    
    // =============================================
    // RESIZE HANDLER
    // =============================================
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // =============================================
    // SHOW MODEL WHEN HERO IS VISIBLE
    // =============================================
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                modelContainer.style.opacity = '1';
                controls.enabled = true;
                console.log('Hero 3D model is now visible');
            } else {
                modelContainer.style.opacity = '0.5';
                controls.enabled = false;
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(heroSection);
    
    console.log('✅ Hero 3D model system initialized');
}

// =============================================
// FALLBACK FUNCTION (shows if your model fails to load)
// =============================================
function createFallbackModel(scene) {
    console.log('⚠️ Creating fallback red crystal...');
    
    const group = new THREE.Group();
    
    // Main central shape
    const geo1 = new THREE.OctahedronGeometry(1.2, 0);
    const mat1 = new THREE.MeshStandardMaterial({ 
        color: 0xaa3333,
        emissive: 0x331111,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: 0.9
    });
    const mainShape = new THREE.Mesh(geo1, mat1);
    group.add(mainShape);
    
    scene.add(group);
    
    console.log('⚠️ Fallback crystal created - check your model file path');
}