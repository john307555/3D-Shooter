// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create player and ground
const playerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1;
scene.add(player);

const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

camera.position.y = 1.6;

// Movement variables
const speed = 0.1;
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Pointer Lock for mouse control
document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
});
document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement) {
        camera.rotation.y -= e.movementX * 0.002;
        camera.rotation.x -= e.movementY * 0.002;
    }
});

// Game loop
function animate() {
    requestAnimationFrame(animate);

    // Movement logic
    if (keys['w']) player.position.z -= Math.cos(camera.rotation.y) * speed;
    if (keys['s']) player.position.z += Math.cos(camera.rotation.y) * speed;
    if (keys['a']) player.position.x -= Math.sin(camera.rotation.y) * speed;
    if (keys['d']) player.position.x += Math.sin(camera.rotation.y) * speed;

    camera.position.copy(player.position).add(new THREE.Vector3(0, 1.6, 0));

    renderer.render(scene, camera);
}
animate();
