const gameArea = document.getElementById('gameArea');
const turtle = document.getElementById('turtle');

let turtlePosition = { x: gameArea.clientWidth / 2 - 25, y: gameArea.clientHeight / 2 - 25 }; // Start in center
let velocityX = 0;
let velocityY = 0;
let turtleRotation = 0; // Угол поворота черепашки
const baseSpeed = 3; // Базовая скорость черепашки

let lastMushroomPosition = null;
let score = 0;

// Инициализация позиции черепашки
turtle.style.left = turtlePosition.x + 'px';
turtle.style.top = turtlePosition.y + 'px';

function spawnMushroom() {
    if (document.querySelectorAll('.mushroom').length >= 10) {
        return;
    }
    const mushroom = document.createElement('div');
    mushroom.classList.add('mushroom');
    mushroom.style.width = '20px';
    mushroom.style.height = '20px';
    mushroom.style.position = 'absolute';


    mushroom.style.left = Math.random() * (gameArea.clientWidth - 20) + 'px';
    mushroom.style.top = Math.random() * (gameArea.clientHeight - 20) + 'px';
    gameArea.appendChild(mushroom);
    return mushroom;
}

function spawnPoop(x, y) {
    const poop = document.createElement('div');
    poop.classList.add('poop');
    poop.style.width = '20px';
    poop.style.height = '20px';
    poop.style.position = 'absolute';
    poop.style.backgroundColor = 'brown';
    poop.style.left = x + 'px';
    poop.style.top = y + 'px';
    gameArea.appendChild(poop);
}

// Обработчик нажатия клавиш
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            velocityY = -baseSpeed;
            velocityX = 0;
            turtleRotation = 0;
            break;
        case 'ArrowDown':
            velocityY = baseSpeed;
            velocityX = 0;
            turtleRotation = 180;
            break;
        case 'ArrowLeft':
            velocityX = -baseSpeed;
            velocityY = 0;
            turtleRotation = 270;
            break;
        case 'ArrowRight':
            velocityX = baseSpeed;
            velocityY = 0;
            turtleRotation = 90;
            break;
    }
});

// Обработчик отпускания клавиш
document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            velocityY = 0;
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            velocityX = 0;
            break;
    }
});

function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function isNearPosition(turtlePos, targetPos, tolerance = 25) {
    const turtleCenterX = turtlePos.x + turtle.offsetWidth / 2;
    const turtleCenterY = turtlePos.y + turtle.offsetHeight / 2;
    const targetCenterX = targetPos.x + 10;
    const targetCenterY = targetPos.y + 10;

    const distanceX = Math.abs(turtleCenterX - targetCenterX);
    const distanceY = Math.abs(turtleCenterY - targetCenterY);

    return distanceX > tolerance || distanceY > tolerance;
}

function checkCollision() {
    const mushrooms = document.querySelectorAll('.mushroom');
    const poops = document.querySelectorAll('.poop');

    mushrooms.forEach(mushroom => {
        if (isColliding(turtle, mushroom)) {
            // Запомнить позицию гриба и установить таймер для спавна какашки
            const mushroomPosition = {
                x: parseInt(mushroom.style.left),
                y: parseInt(mushroom.style.top)
            };
            lastMushroomPosition = mushroomPosition;
            mushroom.remove();
            score++;
            console.log("Score: ", score);
            spawnMushroom();

            // Устанавливаем таймер на небольшую задержку перед проверкой и спавном какашки
            setTimeout(() => {
                // Проверяем, покинула ли черепашка место гриба
                if (isNearPosition(turtlePosition, mushroomPosition)) {
                    spawnPoop(mushroomPosition.x, mushroomPosition.y);
                    lastMushroomPosition = null;
                }
            }, 800); // Задержка в 500 миллисекунд (0.5 секунды)
        }
    });

    poops.forEach(poop => {
        if (isColliding(turtle, poop)) {
            alert('Вы проиграли! Черепашка съела какашку! Ваш счет: ' + score);
            clearInterval(gameInterval);
            clearInterval(mushroomInterval);
            window.location.reload();
        }
    });
}

// Основной игровой цикл
function gameLoop() {
    let newX = turtlePosition.x + velocityX;
    let newY = turtlePosition.y + velocityY;

    const turtleWidth = turtle.offsetWidth;
    const turtleHeight = turtle.offsetHeight;

    if (newX < 0) {
        newX = 0;
    }
    if (newX + turtleWidth > gameArea.clientWidth) {
        newX = gameArea.clientWidth - turtleWidth;
    }
    if (newY < 0) {
        newY = 0;
    }
    if (newY + turtleHeight > gameArea.clientHeight) {
        newY = gameArea.clientHeight - turtleHeight;
    }

    turtlePosition.x = newX;
    turtlePosition.y = newY;

    turtle.style.left = turtlePosition.x + 'px';
    turtle.style.top = turtlePosition.y + 'px';
    turtle.style.transform = `rotate(${turtleRotation}deg)`;

    checkCollision();
}

// Запуск игры
const gameInterval = setInterval(gameLoop, 1000 / 60);
const mushroomInterval = setInterval(spawnMushroom, 2500);

for(let i = 0; i < 5; i++) {
    spawnMushroom();
}
