const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 500
let width = canvas.width 
let height = canvas.height 
let button = document.querySelector('#start')
let loose_txt = document.querySelector('.loose')

// game setting
let ratio = 2
let score = 0
let bestScore = 0
let Started = false


// lancemnet de la partie
function start(){
    Started = true
    button.hidden = true
    loose_txt.hidden = true
    // elements de style
    canvas.style.cursor= "none"
    canvas.classList.remove('rotate')
}

// objets pour gérer les different animées
const human = {
    width:32,
    height:48
}

const player = {
    x: 365,
    y: 230,
    width: 32,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed: false,
    moving: false,
    iniX: 365,
    iniY: 230
};

const ennemie = {
x: 0,
y: 164,
width: 48,
height: 48,
frameX: 0,
frameY: 2,
speed:9,
moving: false,
iniX:0,
iniY:164
}

const background = {
    x:0,
    y:0,
    width: 624,
    moving_height:470,
    speed:5,
    moving: true
}

// gestion de la vitesse
let vitesse = document.querySelector('#Speed')
vitesse.addEventListener('input',function(){
    ennemie.speed = Math.floor(vitesse.value) +9
})


// gestion de la vitesse
let size = document.querySelector('#Size')
size.addEventListener('input',function(){
    console.log(ratio)
    ratio = size.value
})

// pour ne pas pixeliser les images
ctx.imageSmoothingEnabled = false



// chargement des images
const playerSprite = new Image();
playerSprite.src = "assets/caitsith.png"
const ennemieSprite = new Image();
ennemieSprite.src = "assets/blanca.png"
background.img = new Image();
background.img.src = "assets/background.png"


// fonctions pour changer les personnages
function animals(){
    playerSprite.src = "assets/caitsith.png"
    ennemieSprite.src = "assets/blanca.png"
    ennemie.width = 48
    ennemie.height = 48
    player.height = human.height
    player.width = human.width
}

function stars_wars(){
    playerSprite.src = "assets/jedi.png"
    ennemieSprite.src ="assets/darthvader.png"
    player.height = human.height
    player.width = human.width
    ennemie.height = human.height
    ennemie.width = human.width
}

function death_note(){
    playerSprite.src = "assets/L.png"
    ennemieSprite.src = "assets/ryuk.png"
    player.height = human.height
    player.width = human.width
    ennemie.height = 64
    ennemie.width = 48
}


// dessin des sprites
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW*ratio, dH*ratio)
}


//Position de la souris
canvas.addEventListener("mousemove", function(e){
    if(Started == true){
        player.moving = true
        ennemie.moving = true
        if((e.offsetY < height - player.height*ratio/2) && (e.offsetX < width - player.width*ratio/4) && (e.offsetX > player.width*ratio/4) && (e.offsetY > 164)){
            player.y = e.offsetY -(player.height*ratio/2)
            player.x = e.offsetX -(player.width*ratio/2)
        }
    }
    });

// Orientation de la souris
let xDirection = ""
let yDirection = ""  
let oldX = 0
let oldY = 0 

// gestion de l'orientation du personnage
canvas.addEventListener("mousemove", getMouseDirection, false)
function getMouseDirection(e) {
    //deal with the horizontal case
    if (oldX < e.pageX) {
        xDirection = "right"
    } else {
        xDirection = "left"
    }
    //deal with the vertical case
    if (oldY < e.pageY) {
        yDirection = "down"
    } else {
        yDirection = "up"
    }
    oldX = e.pageX
    oldY = e.pageY
}

function orientSprite() {
    if(Started==true){
        if (yDirection=="up") {
            player.frameY = 3
        }
        if (xDirection=="left") {
            player.frameY = 1
        }
        if (yDirection=="down"){
            player.frameY = 0
        }
        if (xDirection=="right") {
            player.frameY = 2
        }
    }
}
// anime les entités
function handleFrame() {
    if (player.frameX < 3 && player.moving) player.frameX++;
    else player.frameX = 0

    if (ennemie.frameX < 3 && ennemie.moving) ennemie.frameX++;
    else ennemie.frameX = 0
}


// intelligence artificielle de l'ennemie
function moveEnnemie(){
    if (ennemie.moving == true){
    if (player.x < ennemie.x){
        ennemie.x-=ennemie.speed
        ennemie.frameY = 1
    }
    if (player.y < ennemie.y){
        ennemie.y-=ennemie.speed
    }
    if (player.x > ennemie.x){
        ennemie.x+=ennemie.speed
        ennemie.frameY = 2
    }
    if(player.y> ennemie.y){
        ennemie.y+=ennemie.speed
    }
    }
}

function loose(){
    let scoreBuff = 0
    if(ennemie.x>player.x-ennemie.width && ennemie.x<player.x+ennemie.width && ennemie.y>player.y-ennemie.height && ennemie.y<player.y+ennemie.height ){
        Started=false
        
        // on sauvegarde le meilleur score
        scoreBuff = score
        if(scoreBuff> bestScore){
            bestScore = scoreBuff
        }
        score = 0

        // element de style visuel
        canvas.style.cursor= "pointer"
        button.hidden = false
        canvas.classList.add('rotate')

        // les entités ne bouge plus
        player.moving = false
        ennemie.moving = false

        // On remet les entités a leur position initiale
        player.x = player.iniX
        player.y = player.iniY
        ennemie.x = ennemie.iniX
        ennemie.y = ennemie.iniY
        player.frameY = 0
        player.frameX = 0

        // Message de fin 
        loose_txt.hidden = false
    }
}

// affiche le score
function displayScore(){
    ctx.font = '12px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText("Score: " + score, 5, 11)
    ctx.fillText("BestScore: " + bestScore, 650, 11)
}

let fps, fpsInterval, startTime, now, then, elapsed;

// lance l'animation a un nombre de fps donner
function startAnimating(fps) {
    fpsInterval = 1000/fps
    then = Date.now()
    startTime = then
    animate()
}

let index_background = 0
// gestion des animations et du jeu
function animate() {
    requestAnimationFrame(animate)
    index_background++
    if(Started == true){
        score++
    }
    now = Date.now()
    elapsed = now - then
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(background.img,0,0)
        if(Started == true){ 
            //sorcellerie qui fait bouger le background
            ctx.drawImage(background.img,0,0,canvas.width,canvas.height,-(index_background*(background.speed/2) % canvas.width) + canvas.width,0,canvas.width,canvas.height)
            ctx.drawImage(background.img,0,0,canvas.width,canvas.height,-(index_background*(background.speed/2) % canvas.width),0,canvas.width,canvas.height)
                
        }
        // dessine le joueur et l'ennemie
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
        drawSprite(ennemieSprite, ennemie.width * ennemie.frameX, ennemie.height * ennemie.frameY, ennemie.width, ennemie.height, ennemie.x, ennemie.y, ennemie.width, ennemie.height)

        // mécanique du jeu
        loose()
        orientSprite()
        handleFrame()
        moveEnnemie()
        displayScore()
    }
}
startAnimating(15) // lancement de l'annimation 15 correspond au nombre de fps


