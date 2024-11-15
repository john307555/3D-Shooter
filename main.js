// 3D Shooter Game Script

// Setup Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Load Textures
const groundTexture = textureLoader.load('https://source.unsplash.com/1024x1024/?grass');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);

const playerTexture = textureLoader.load('https://source.unsplash.com/1024x1024/?metal');
const enemyTexture = textureLoader.load('https://source.unsplash.com/1024x1024/?rock');
const bulletTexture = textureLoader.load('https://source.unsplash.com/1024x1024/?gold');

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Ground Plane
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Player Setup
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ map: playerTexture });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0);
scene.add(player);

// Camera Position
camera.position.set(0, 5, 10);
camera.lookAt(0, 1, 0);

// Enemy Setup
const enemies = [];
function spawnEnemy() {
    const enemyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const enemyMaterial = new THREE.MeshStandardMaterial({ map: enemyTexture });
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);

    const randomX = Math.random() * 20 - 10;
    const randomZ = Math.random() * 20 - 10;
    enemy.position.set(randomX, 1, randomZ);

    scene.add(enemy);
    enemies.push(enemy);
}

// Spawn an enemy every 3 seconds
setInterval(spawnEnemy, 3000);

// Input Controls
const keys = { w: false, a: false, s: false, d: false };
window.addEventListener('keydown', (event) => (keys[event.key.toLowerCase()] = true));
window.addEventListener('keyup', (event) => (keys[event.key.toLowerCase()] = false));
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        shoot();
    }
});

// Shooting Mechanism
const bullets = [];
function shoot() {
    const bulletGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const bulletMaterial = new THREE.MeshStandardMaterial({ map: bulletTexture });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

    bullet.position.copy(player.position);
    bullet.userData.direction = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

    bullets.push(bullet);
    scene.add(bullet);
}

// Collision Detection
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const distance = bullet.position.distanceTo(enemy.position);
            if (distance < 0.7) {
                scene.remove(bullet);
                scene.remove(enemy);
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                updateScore();
            }
        });
    });
}

// Scoring System
let score = 0;
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontSize = '24px';
scoreElement.innerText = `Score: ${score}`;
document.body.appendChild(scoreElement);

function updateScore() {
    score += 10;
    scoreElement.innerText = `Score: ${score}`;
}

// Game Loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Update Player Position
    if (keys.w) player.position.z -= 5 * delta;
    if (keys.s) player.position.z += 5 * delta;
    if (keys.a) player.position.x -= 5 * delta;
    if (keys.d) player.position.x += 5 * delta;

    // Update Bullets
    bullets.forEach((bullet, index) => {
        bullet.position.add(bullet.userData.direction.clone().multiplyScalar(10 * delta));
        if (bullet.position.length() > 50) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });

    // Check Collisions
    checkCollisions();

    // Render Scene
    renderer.render(scene, camera);
}

animate();
