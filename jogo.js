console.log('~Felps7k~');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const character = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 200, 
    draw(){
        ctx.drawImage(
            sprites,
            character.spriteX, character.spriteY, //Início da imagem
            character.width, character.height, //Final da imagem
            character.x, character.y, //Local da imagem na tela
            character.width, character.height //Tamanho da imagem na tela
        );
    }
}

const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112, 
    draw(){
        ctx.drawImage(
            sprites,
            floor.spriteX, floor.spriteY,
            floor.width, floor.height,
            floor.x, floor.y,
            floor.width, floor.height
        );
        ctx.drawImage(
            sprites,
            floor.spriteX, floor.spriteY,
            floor.width, floor.height,
            (floor.x + floor.width), floor.y,
            floor.width, floor.height
        );
    }
}

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204, 
    draw(){
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            sprites,
            background.spriteX, background.spriteY,
            background.width, background.height,
            background.x, background.y,
            background.width, background.height
        );
        ctx.drawImage(
            sprites,
            background.spriteX, background.spriteY,
            background.width, background.height,
            (background.x + background.width), background.y,
            background.width, background.height
        );
    }
}

function loop(){
    background.draw();
    floor.draw();
    character.draw();
    //character.y = character.y + 1;
    requestAnimationFrame(loop);
}

loop();