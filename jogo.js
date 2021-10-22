console.log('~Felps7k~');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// ~Character~
const character = {
    sX: 0,
    sY: 0,
    w: 33,
    h: 24,
    x: 10,
    y: 220,
    speed: 0,
    gravity:0.25,
    bounce: 4.6,
    fall(){
        character.speed += character.gravity;
        character.y = character.y + character.speed;
    },
    jump(){
        character.speed = - character.bounce;
    },
    draw(){
        ctx.drawImage(
            sprites,
            character.sX, character.sY, //Início da imagem
            character.w, character.h, //Final da imagem
            character.x, character.y, //Local da imagem na tela
            character.w, character.h //Tamanho da imagem na tela
        );
    }
}

// ~Floor~
const floor = {
    sX: 0,
    sY: 610,
    w: 224,
    h: 112,
    x: 0,
    y: canvas.height - 112, 
    draw(){
        ctx.drawImage(
            sprites,
            floor.sX, floor.sY,
            floor.w, floor.h,
            floor.x, floor.y,
            floor.w, floor.h
        );
        ctx.drawImage(
            sprites,
            floor.sX, floor.sY,
            floor.w, floor.h,
            (floor.x + floor.w), floor.y,
            floor.w, floor.h
        );
    }
}

// ~Background~
const background = {
    sX: 390,
    sY: 0,
    w: 275,
    h: 204,
    x: 0,
    y: canvas.height - 204, 
    draw(){
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            sprites,
            background.sX, background.sY,
            background.w, background.h,
            background.x, background.y,
            background.w, background.h
        );
        ctx.drawImage(
            sprites,
            background.sX, background.sY,
            background.w, background.h,
            (background.x + background.w), background.y,
            background.w, background.h
        );
    }
}

// ~Get Ready Message~
const startGamemessage = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50, 
    draw(){
        ctx.drawImage(
            sprites,
            startGamemessage.sX, startGamemessage.sY,
            startGamemessage.w, startGamemessage.h,
            startGamemessage.x, startGamemessage.y,
            startGamemessage.w, startGamemessage.h
        );
    }
}

// ~Screens~
let activeScreen = {};
function changeToScreen(newScreen){
    activeScreen = newScreen;
}

const screen = {
    START: {
        draw(){
            background.draw();
            floor.draw();
            character.draw();
            startGamemessage.draw();
        },
        click(){
            changeToScreen(screen.GAME);
        },
        fall(){

        }
    },
    GAME: {
        draw(){
            background.draw();
            floor.draw();
            character.draw();
        },
        click(){
            character.jump();
        },
        fall(){
            character.fall();
        }
    },
};



function loop(){
    activeScreen.draw();
    activeScreen.fall();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(activeScreen.click){
        activeScreen.click();
    }
});

changeToScreen(screen.START);
loop();