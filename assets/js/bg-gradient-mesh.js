// Abstract Gradient Mesh Background (Three.js Shader)
(function() {
    'use strict';

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Configuration
    const config = {
        speed: 0.2,
        noiseStrength: 0.4
    };

    let scene, camera, renderer, mesh, uniforms;
    let time = 0;

    // Vertex Shader: Pass position and handle simple movement if needed
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // Fragment Shader: Create the morphing gradient blobs
    const fragmentShader = `
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // Simple noise function
        // Based on classic Perlin/Simplex noise snippets
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                                -0.577350269189626, // -1.0 + 2.0 * C.x
                                0.024390243902439); // 1.0 / 41.0
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i); // Avoid truncation effects in permutation
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = vUv;
            
            // Slow down time
            float t = uTime * 0.5;
            
            // Create organic movement using noise
            float n1 = snoise(vec2(uv.x * 3.0 + t * 0.2, uv.y * 3.0 - t * 0.3));
            float n2 = snoise(vec2(uv.x * 2.0 - t * 0.1, uv.y * 2.0 + t * 0.1));
            
            // Define colors (Deep Blue, Purple, Cyan, Dark)
            vec3 color1 = vec3(0.05, 0.1, 0.3); // Deep Blue
            vec3 color2 = vec3(0.2, 0.05, 0.3); // Purple
            vec3 color3 = vec3(0.0, 0.2, 0.3); // Dark Cyan
            vec3 bg = vec3(0.04, 0.04, 0.04); // Almost Black
            
            // Mix colors based on noise
            vec3 color = bg;
            color = mix(color, color1, smoothstep(-0.5, 0.5, n1));
            color = mix(color, color2, smoothstep(-0.5, 0.5, n2));
            
            // Add a subtle glowing highlight
            float glow = smoothstep(0.3, 0.6, snoise(vec2(uv.x * 4.0 + t, uv.y * 4.0)));
            color += color3 * glow * 0.5;
            
            // Vignette to fade edges
            float d = distance(uv, vec2(0.5));
            color *= 1.0 - smoothstep(0.3, 0.8, d);

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    function init() {
        scene = new THREE.Scene();

        // Camera setup - simple orthographic for full screen quad
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Renderer setup
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });

        // Uniforms for the shader
        uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2() }
        };

        // Create a full-screen plane
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        resize();
        window.addEventListener('resize', resize);
    }

    function animate() {
        requestAnimationFrame(animate);
        time += config.speed * 0.05;
        uniforms.uTime.value = time;
        renderer.render(scene, camera);
    }

    function resize() {
        const parent = canvas.parentElement;
        if (parent) {
            const width = parent.offsetWidth;
            const height = parent.offsetHeight;
            renderer.setSize(width, height);
            uniforms.uResolution.value.set(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }

    // Wait for Three.js
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
