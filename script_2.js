const path = document.getElementById('path');
const pathLength = path.getTotalLength(); // Get path total length

let currentLevel = 0;
const character = document.getElementById('character');
const enterLevelBtn = document.getElementById('enterLevelBtn');
const prevLevelBtn = document.getElementById('prevLevelBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const totalLevels = 5; // Assume there are 5 levels
let in_range_touch = 0;

const mainPage = document.getElementById('mainPage');
const levelPage = document.getElementById('levelPage');

let currentLength = 0; // Character's current position on the path

document.addEventListener("DOMContentLoaded", () => {
    // 相簿功能
    const albumModal = document.getElementById("albumModal");
    const albumImage = document.getElementById("albumImage");
    const photos = ["images/DSC_8597.JPG", "images/DSC_8739.JPG", "images/DSC_8412.JPG"];
    let currentPhotoIndex = 0;

    // 打開相簿按鈕
    document.getElementById("openAlbumBtn").addEventListener("click", () => {
        albumModal.style.display = "flex";
        albumImage.src = photos[currentPhotoIndex];
    });

    // 關閉相簿按鈕
    document.getElementById("closeAlbumBtn").addEventListener("click", () => {
        albumModal.style.display = "none";
    });

    // 上一張圖片
    document.getElementById("prevPhotoBtn").addEventListener("click", () => {
        if (currentPhotoIndex > 0) {
            currentPhotoIndex--;
            albumImage.src = photos[currentPhotoIndex];
        }
    });

    // 下一張圖片
    document.getElementById("nextPhotoBtn").addEventListener("click", () => {
        if (currentPhotoIndex < photos.length - 1) {
            currentPhotoIndex++;
            albumImage.src = photos[currentPhotoIndex];
        }
    });
});


// Generate level checkpoints
const checkpoints = [];
for (let i = 0; i < totalLevels; i++) {
    const checkpointLength = (pathLength / (totalLevels - 1)) * i;
    const point = path.getPointAtLength(checkpointLength);
    checkpoints.push(point);

    // 將圖片移動至 SVG 內並設置座標
    const imageElem = document.getElementById(`level${i + 1}Image`);
    if (imageElem) {
        imageElem.setAttribute('x', point.x - 25);  // 調整 x 坐標，使圖片中心對齊關卡點
        imageElem.setAttribute('y', point.y - 25);  // 調整 y 坐標，使圖片中心對齊關卡點
        imageElem.setAttribute('width', 50);
        imageElem.setAttribute('height', 50);
        imageElem.style.clipPath = 'circle(50%)';  // 將圖片裁剪成圓形

    } else {
        const checkpointElem = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        checkpointElem.setAttribute("cx", point.x);
        checkpointElem.setAttribute("cy", point.y);
        checkpointElem.setAttribute("r", 5);
        checkpointElem.setAttribute("fill", "blue");
        document.getElementById('gameMap').appendChild(checkpointElem);
    }
}


// Initialize character position
function updateCharacterPosition() {
    const { x, y } = checkpoints[currentLevel];
    character.setAttribute('x', x - 20); // 調整位置以匹配圖片
    character.setAttribute('y', y - 20);

    prevLevelBtn.style.display = currentLevel > 0 ? 'block' : 'none';
    nextLevelBtn.style.display = 'block';
    enterLevelBtn.style.display = 'block';
}

const levelCharacter = document.getElementById('levelCharacter'); // Get the level character

let isLevelActive = false; // 用來判斷是否處於關卡內

// Character movement speed
const speed = 10;
let characterX = 100; // Initial position
let characterY = 100; 


// Previous level button
prevLevelBtn.addEventListener('click', () => {
    if (currentLevel > 0) {
        currentLevel--;
        moveCharacterToNextCheckpoint();
    }
});

// Next level button
nextLevelBtn.addEventListener('click', () => {
    if (currentLevel < totalLevels - 1) {
        currentLevel++;
        moveCharacterToNextCheckpoint();
    }
});

// Save current level and current position before entering a level
enterLevelBtn.addEventListener('click', () => {
    localStorage.setItem('currentLevel', currentLevel);  // Save current level to localStorage
    localStorage.setItem('currentLength', currentLength); // Save current character progress on the path
    window.location.href = `level${currentLevel+1}.html`;
    isLevelActive = 1;
});

// Load saved level and character position progress when the page loads
window.addEventListener('load', () => {
    const savedLevel = localStorage.getItem('currentLevel');
    const savedLength = localStorage.getItem('currentLength');
    
    if (savedLevel !== null) {
        currentLevel = parseInt(savedLevel, 10);  // Retrieve and set the current level
    }

    if (savedLength !== null) {
        currentLength = parseFloat(savedLength);  // Retrieve and set the character's position progress
    } else {
        currentLength = 0;  // If no saved length, start from the beginning
    }

    updateCharacterPosition();  // Move the character to the saved position
});


// Character movement between levels
function moveCharacterToNextCheckpoint() {
    const startLength = currentLength;  // Use the current saved length
    const endLength = pathLength / (totalLevels - 1) * currentLevel;
    const duration = 1000;
    const step = 10;
    let progress = 0;

    const interval = setInterval(() => {
        progress += step;
        const t = progress / duration;
        const currentPosLength = startLength + (endLength - startLength) * t;
        const point = path.getPointAtLength(currentPosLength);
        character.setAttribute('x', point.x - 20);
        character.setAttribute('y', point.y - 50);

        if (progress >= duration) {
            clearInterval(interval);
            currentLength = endLength;  // Update currentLength to the new position
            updateCharacterPosition();
        }
    }, step);
}

// Initialize character position and buttons
updateCharacterPosition();
