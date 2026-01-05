// 3D Data Landscape Background using Three.js
(function() {
    'use strict';

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Configuration
    const config = {
        gridSize: 60,
        gridDivisions: 60,
        moveSpeed: 0.002,
        terrainHeight: 2.5,
        color: 0x444444 // Dark grey wireframe
    };

    // State
    let scene, camera, renderer, terrain;
    let time = 0;

    function init() {
        // Scene setup
        scene = new THREE.Scene();
        // Fog to fade out distant lines into the background color
        scene.fog = new THREE.FogExp2(0x0a0a0a, 0.08); 

        // Camera setup
        const fov = 60;
        const aspect = canvas.parentElement.offsetWidth / canvas.parentElement.offsetHeight;
        const near = 0.1;
        const far = 100;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        
        // Position camera to look at the landscape
        camera.position.set(0, 3, 8);
        camera.rotation.x = -Math.PI / 6; // Tilt down slightly

        // Renderer setup
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true, // Transparent background
            antialias: true
        });
        
        resize();

        // Create Terrain
        createTerrain();

        // Event Listeners
        window.addEventListener('resize', resize);
    }

    function createTerrain() {
        // Plane Geometry
        const geometry = new THREE.PlaneGeometry(
            30, // width
            30, // height (depth in our view)
            config.gridDivisions, 
            config.gridDivisions
        );

        // Wireframe Material
        const material = new THREE.MeshBasicMaterial({
            color: config.color,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        terrain = new THREE.Mesh(geometry, material);
        
        // Rotate to lay flat
        terrain.rotation.x = -Math.PI / 2;
        
        scene.add(terrain);
    }

    function updateTerrain() {
        if (!terrain) return;

        const positions = terrain.geometry.attributes.position.array;
        const count = positions.length / 3;

        // Modulate Z (which is Up because we rotated the plane)
        // actually in PlaneGeometry, Z is the normal, so after rotation, 
        // the "height" of the terrain is the local Z of the plane geometry.
        
        for (let i = 0; i < count; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1]; // This represents depth in local space
            
            // Create a moving wave effect
            // We use 'y' (depth) to simulate movement by adding time
            const z = Math.sin(x * 0.5 + time) * 0.5 + 
                      Math.cos((y + time) * 0.5) * 0.5;
            
            // Apply height multiplier
            positions[i * 3 + 2] = z * 0.8; 
        }

        terrain.geometry.attributes.position.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);

        time += config.moveSpeed * 60; // Scale speed

        updateTerrain();
        
        renderer.render(scene, camera);
    }

    function resize() {
        const parent = canvas.parentElement;
        if (parent) {
            const width = parent.offsetWidth;
            const height = parent.offsetHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            // Handle high DPI displays
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }

    // Wait for Three.js to load
    function checkLibrary() {
        if (typeof THREE !== 'undefined') {
            init();
            animate();
        } else {
            setTimeout(checkLibrary, 100);
        }
    }

    checkLibrary();

})();
