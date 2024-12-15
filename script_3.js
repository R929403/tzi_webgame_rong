const path = document.getElementById('path');
const pathLength = path.getTotalLength(); // Get path total length

let currentLevel = 0;
const character = document.getElementById('character');
const enterLevelBtn = document.getElementById('enterLevelBtn');
const prevLevelBtn = document.getElementById('prevLevelBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const totalLevels = 6; // Assume there are 5 levels
let in_range_touch = 0;

const mainPage = document.getElementById('mainPage');
const levelPage = document.getElementById('levelPage');

let currentLength = 0; // Character's current position on the path

document.addEventListener("DOMContentLoaded", () => {
    const albumModal = document.getElementById("albumModal");
    const albumImage = document.getElementById("albumImage");
    let currentPhotoIndex = 0;
    let selectedAlbum = [];

    // 各相簿的照片
    const photoAlbums = {
        B: ["images/Bar/B1.JPG", "images/Bar/B2.JPG","images/Bar/B3.JPG","images/Bar/B4.JPG","images/Bar/B5.JPG","images/Bar/B6.jpg","images/Bar/B7.jpg","images/Bar/B8.jpg","images/Bar/cover.jpg",],
        L: ["images/leaf/_1.JPG", "images/leaf/_2.JPG", "images/leaf/_3.JPG"],
        Z: ["images/載運/A1.jpg", 
        "images/載運/A2.jpg", 
        "images/載運/A3.jpg", 
        "images/載運/A4.jpg", 
        "images/載運/A5.jpg", 
        "images/載運/A6.jpg",
        "images/載運/B1.JPG", 
        "images/載運/B2.JPG", 
        "images/載運/B3.JPG", 
        "images/載運/B4.JPG", 
        "images/載運/B5.JPG",
        "images/載運/cover.JPG"]
    };

    // 打開相簿並載入圖片
    function openAlbum(albumKey) {
        selectedAlbum = photoAlbums[albumKey] || [];
        if (selectedAlbum.length > 0) {
            currentPhotoIndex = 0;
            albumImage.src = selectedAlbum[currentPhotoIndex];
            albumModal.style.display = "flex";
        }
    }

    // 關閉相簿按鈕
    document.getElementById("closeAlbumBtn").addEventListener("click", () => {
        albumModal.style.display = "none";
    });

    // 上一張圖片
    document.getElementById("prevPhotoBtn").addEventListener("click", () => {
        if (currentPhotoIndex > 0) {
            currentPhotoIndex--;
        } else {
            currentPhotoIndex = selectedAlbum.length - 1;
        }
        albumImage.src = selectedAlbum[currentPhotoIndex];
    });

    // 下一張圖片
    document.getElementById("nextPhotoBtn").addEventListener("click", () => {
        if (currentPhotoIndex < selectedAlbum.length - 1) {
            currentPhotoIndex++;
        } else {
            currentPhotoIndex = 0;
        }
        albumImage.src = selectedAlbum[currentPhotoIndex];
    });

    // 綁定兩個不同相簿的開啟按鈕
    document.getElementById("openAlbumButton1").addEventListener("click", () => openAlbum('B'));
    document.getElementById("openAlbumButton2").addEventListener("click", () => openAlbum('L'));
    document.getElementById("openAlbumButton3").addEventListener("click", () => openAlbum('Z'));
});



// Generate level checkpoints
const checkpoints = [];
const levelTitles = ["25載營", "2021載耶", "交接", "26載營", "2022載耶", "載物小畢典"]; // 每個關卡的標題

for (let i = 0; i < totalLevels; i++) {
    const checkpointLength = (pathLength / (totalLevels - 1)) * i;
    const point = path.getPointAtLength(checkpointLength);
    checkpoints.push(point);

    // 將圖片移動至 SVG 內並設置座標
    const imageElem = document.getElementById(`level${i + 1}Image`);
    if (imageElem) {
        imageElem.setAttribute('x', point.x - 25); // 調整 x 坐標，使圖片中心對齊關卡點
        imageElem.setAttribute('y', point.y - 25); // 調整 y 坐標，使圖片中心對齊關卡點
        imageElem.setAttribute('width', 50);
        imageElem.setAttribute('height', 50);
        imageElem.style.clipPath = 'circle(50%)'; // 將圖片裁剪成圓形

        // 添加小標題
        const textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElem.setAttribute("x", point.x); // 標題與關卡點水平居中
        textElem.setAttribute("y", point.y + 40); // 標題在圖片下方
        textElem.setAttribute("font-size", "14");
        textElem.setAttribute("text-anchor", "middle");
        textElem.textContent = levelTitles[i]; // 使用對應的關卡標題
        document.getElementById('gameMap').appendChild(textElem);
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
    nextLevelBtn.style.display = currentLevel < 5 ?'block': 'none';
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


document.getElementById("triangleButton").addEventListener("click", () => {
    const imagesContainer = document.getElementById("triangleImages");
    const images = document.querySelectorAll(".triangle-img");
    imagesContainer.style.display = "block"; // 顯示圖片容器

    // 逐一顯示圖片
    images.forEach((img, index) => {
        setTimeout(() => {
            img.style.opacity = 1; // 顯示圖片
            img.style.transform = "scale(1.2)"; // 圖片縮放效果
        }, index * 500); // 延遲每張圖片的出現時間
    });

    // 重置效果，讓按鈕可重複使用
    setTimeout(() => {
        images.forEach((img) => {
            img.style.opacity = 0; // 隱藏圖片
            img.style.transform = "scale(1)"; // 恢復原始大小
        });
        imagesContainer.style.display = "none";
    }, 5000); // 5秒後隱藏圖片
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
