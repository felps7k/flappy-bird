console.log('~Felps7k~');

let frames = 0;

const hitSound = new Audio();
hitSound.src = './sounds/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// ~Character~
function makeCharacter(){
    const character = {
        sX: 0,
        sY: 0,
        w: 33,
        h: 24,
        x: 10,
        y: 180,
        speed: 0,
        gravity:0.25,
        bounce: 4.6,
        actualFrame: 0,
        moves: [
            { sX: 0, sY: 0 }, //Asa para cima
            { sX: 0, sY: 26 }, //Asa no meio
            { sX: 0, sY: 52 }, //Asa para baixo
        ],
        fall(){
            if(colision(character, global.floor)){
                hitSound.play(); //DESCOMENTAR PARA ATIVAR AUDIO
                setTimeout(() =>{
                    changeToScreen(screen.START);
                }, 500)
                return;
            }
            character.speed += character.gravity;
            character.y = character.y + character.speed;
        },
        jump(){
            character.speed = - character.bounce;
        },
        attActualFrame(){
            const frameInterval = 15;
            const afterInterval = frames % frameInterval === 0;
            if(afterInterval){
                const i = character.actualFrame + 1;
                const baseRepeat = character.moves.length;
                character.actualFrame = i % baseRepeat;
            }
        },
        draw(){
            character.attActualFrame();
            const { sX, sY } = character.moves[character.actualFrame];
            ctx.drawImage(
                sprites,
                sX, sY, //Início da imagem
                character.w, character.h, //Final da imagem
                character.x, character.y, //Local da imagem na tela
                character.w, character.h //Tamanho da imagem na tela
            );
        }
    }
    return character;
}

// ~Colision~
function colision(character, floor){
    const characterY = character.y + character.h;
    const floorY = floor.y;

    if(characterY >= floorY){
        return true;
    }
    return false;
}

// ~Floor~
function makeFloor(){
    const floor = {
        sX: 0,
        sY: 610,
        w: 224,
        h: 112,
        x: 0,
        y: canvas.height - 112, 
        att(){
            const moveFloor = 2;
            const repeatFloor = floor.w / 2;
            const move = floor.x - moveFloor;
            
            if(!colision(global.character, floor)){
                floor.x = move % repeatFloor;
            }else {
                return;
            }
        },
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
        },
    }
    return floor;
};

// ~~Obstacles~
function makeObstacle(){
    const obstacle = {
        w: 52,
        h: 400,
        low: {
            sX: 0,
            sY: 169
        },
        up: {
            sX: 52,
            sY: 169
        },
        //space: 80,
        pairsObs: [],
        draw(){
            obstacle.pairsObs.forEach(function(pair){
                const spacing = 90;
                const randomY = pair.y;
                // ~Obstáculo cima~
                const obsUpX = pair.x;
                const obsUpY = randomY;
                ctx.drawImage(
                    sprites,
                    obstacle.up.sX, obstacle.up.sY,
                    obstacle.w, obstacle.h,
                    obsUpX, obsUpY,
                    obstacle.w, obstacle.h,
                )
    
                // ~Obstáculo baixo~
                const obsLowX = pair.x;
                const obsLowY = obstacle.h + spacing + randomY;
                ctx.drawImage(
                    sprites,
                    obstacle.low.sX, obstacle.low.sY,
                    obstacle.w, obstacle.h,
                    obsLowX, obsLowY,
                    obstacle.w, obstacle.h,
                )
                pair.obsUp = {
                    x: obsUpX,
                    y: obstacle.h + obsUpY
                }
                pair.obsLow = {
                    x: obsLowX,
                    y: obsLowY
                }
            })
        },
        colision(pair){
            const charUp = global.character.y;
            const charLow = global.character.y + global.character.h;
            if(((global.character.x + global.character.w) - 3) >= pair.x){
                if(charUp <= (pair.obsUp.y - 3)){
                    return true;
                }
                if((charLow - 3) >= pair.obsLow.y){
                    return true;
                }
            }
            return false;
        },
        att(){
            const after100Frames = frames % 100 === 0;
            if(after100Frames){
                obstacle.pairsObs.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1.15),
                });
            }
            obstacle.pairsObs.forEach(function(pair){
                pair.x = pair.x - 2;
                if(obstacle.colision(pair)){
                    hitSound.play(); //DESCOMENTAR PARA ATIVAR AUDIO
                    changeToScreen(screen.GAME_OVER);
                }
                if(pair.x + obstacle.w <= 0){
                    obstacle.pairsObs.shift();
                }
            });
        }
    }
    return obstacle;
};

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
const startGameMessage = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50, 
    draw(){
        ctx.drawImage(
            sprites,
            startGameMessage.sX, startGameMessage.sY,
            startGameMessage.w, startGameMessage.h,
            startGameMessage.x, startGameMessage.y,
            startGameMessage.w, startGameMessage.h
        );
    }
}

// ~Game Over Message~
const gameOverMessage = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50, 
    draw(){
        ctx.drawImage(
            sprites,
            gameOverMessage.sX, gameOverMessage.sY,
            gameOverMessage.w, gameOverMessage.h,
            gameOverMessage.x, gameOverMessage.y,
            gameOverMessage.w, gameOverMessage.h
        );
    }
}

// ~Score~
function makeScore(){
    const score = {
        point: 0,
        draw(){
            ctx.font = '25px "Press Start 2P"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${score.point}`, canvas.width - 10, 35);
        },
        att(){
            const frameInterval = 150;
            const afterInterval = frames % frameInterval === 0;
            if(afterInterval){
                score.point += 1;
            }
        }
    }
    return score;
}

// ~Screens~
const global = {};
let activeScreen = {};
function changeToScreen(newScreen){
    activeScreen = newScreen;
    if(activeScreen.make){
        activeScreen.make();
    }
}

const screen = {
    START: {
        make(){
            global.character = makeCharacter();
            global.floor = makeFloor();
            global.obstacle = makeObstacle();
        },
        draw(){
            background.draw();
            global.obstacle.draw();
            global.floor.draw();
            global.character.draw();
            startGameMessage.draw();
        },
        click(){
            changeToScreen(screen.GAME);
        },
        att(){
            global.floor.att();
        }
    },
    GAME: {
        make(){
            global.score = makeScore();
        },
        draw(){
            background.draw();
            global.obstacle.draw();
            global.floor.draw();
            global.character.draw();
            global.score.draw();
        },
        click(){
            global.character.jump();
        },
        att(){
            global.character.fall();
            global.floor.att();
            global.obstacle.att();
            global.score.att();
        }
    },
    GAME_OVER: {
        draw(){
            gameOverMessage.draw();
        },
        click(){
            changeToScreen(screen.START)
        },
        att(){

        },
    }
};

function loop(){
    activeScreen.draw();
    activeScreen.att();

    frames += 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(activeScreen.click){
        activeScreen.click();
    }
});

changeToScreen(screen.START);
loop();