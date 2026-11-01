const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

function resizeCanvas() {
    const scale = Math.min(
        window.innerWidth / 1024,
        window.innerHeight / 576
    )

    const width = 1024 * scale
    const height = 576 * scale

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const game = document.querySelector('#game')
    game.style.width = `${width}px`
    game.style.height = `${height}px`
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas)

class Player{
    constructor(){
        

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 1
        const image = new Image()
        image.src = 'assets/images/spaceship.png'

        image.onload = () => {
            const resizescale = 0.15

            this.image = image
            this.width = image.width * resizescale
            this.height = image.height * resizescale

            this.position = {
                x: (canvas.width - this.width) / 2,
                y: canvas.height - this.height - 20
            }

            this.velocity = { x: 0, y: 0 }
}
    }
    draw() {
            //c.fillStyle = 'red'
         //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if (!this.image || !this.position) return;
            c.save()
            c.globalAlpha = this.opacity
            c.translate(this.position.x + this.width/2, this.position.y + player.height/2)
            c.rotate(this.rotation)
            c.translate(-this.position.x -this.width/2, - this.position.y - player.height/2)

            if (this.image && this.position) {
                c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
            }    

            c.restore()
    }
    update() {
        this.draw()
        if(this.position) {
            this.position.x += this.velocity.x
        }
    }
}

class Projectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity 

        this.radius = 4
    }
    
    draw() {
        c.beginPath()    
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class invaderProjectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity 

        this.width = 3
        this.height = 10
    }
    
    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader{
    constructor({position}){

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = 'assets/images/invader.png'

        image.onload = () => {
            const resizescale = 1
            this.image = image
            this.width = image.width * resizescale
            this.height = image.height * resizescale
            this.position = {
                    x: position.x,
                    y: position.y
            }
        }
    }
    draw() {
            //c.fillStyle = 'red'
         //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if (!this.image || !this.position) return;
            if (this.image && this.position) {
                c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
            }    
    }
    update({velocity}) {
        this.draw()
        if(this.position) {
            this.position.x += velocity.x
            this.position.y += velocity.y

        }
    }

    shoot(invaderProjectiles){
        invaderProjectiles.push(new invaderProjectile({
            position: {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height
            },

            velocity:{
            x: 0,
            y: 5
            }
        }))

    }
}

class Grid{
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
    
        this.velocity = {
            x: 3,
            y: 0
        } 
    
        this.invaders = []

        const rows = Math.floor(Math.random() * 5 + 2) 
        const columns = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 30

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
        this.invaders.push(new Invader({position: {
            x: this.position.x + x * 30,
            y: this.position.y + y * 30
        }}))
        }
    }
        // console.log(this.invaders)
    }

    update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.y = 0

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
        this.velocity.x = -this.velocity.x
        this.velocity.y = 30
    }
}

}

class Particle{
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity 
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()    
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()

    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades)
            this.opacity += -0.01
    }
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}
const STATES = {
    START: "START",
    PLAYING: "PLAYING",
    GAMEOVER: "GAMEOVER"
}

player.draw()

let currentGameState = STATES.START
let frames = 0
let randomInt = (Math.floor(Math.random() * 500) + 500)
let game = {
    over: false,
    active: true
}
let score = 0

// console.log(randomInt)

for (let i = 0; i < 250; i++){
                particles.push(new Particle(
                {position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
                },
                velocity:{
                x: 0,
                y: 1
                },
                radius: Math.random() * 2,
                color: 'white',
                fades: false
                }))}

function drawStartScreen() {
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.fillStyle = "#baa0de"
    c.font = "bold 48px sans-serif, monospace"
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillText("SPACE INVADERS", canvas.width/2, canvas.height/2 - 40)

    c.fillStyle = "white"
    c.font = "20px sans-serif, monospace"
    c.fillText("Hit enter to Start Game", canvas.width/2, canvas.height/2 + 40)
}

function drawGameOver() {
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.fillStyle = "#baa0de"
    c.font = "bold 48px sans-serif, monospace"
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillText("GAME OVER!", canvas.width/2, canvas.height/2 - 40)

    c.fillStyle = "white"
    c.font = "20px sans-serif, monospace"
    c.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 20)

    c.fillStyle = "white"
    c.font = "20px sans-serif, monospace"
    c.fillText("Hit enter to Restart Game", canvas.width/2, canvas.height/2 + 80)

}


function createparticles({object, color}){
    for (let i = 0; i < 15; i++){
                particles.push(new Particle({
                position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height/ 2
                },
                velocity:{
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
                },
                radius: Math.random() * 3,
                color: color || "#baa0de",
                fades: true
            }))                
            }
                
}

function animate(){
    requestAnimationFrame(animate)

    if (currentGameState === STATES.START) {
        drawStartScreen()
        return
    }

    if (currentGameState === STATES.GAMEOVER) {
        drawGameOver()
        return
    }

    if (!game.active) return

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, i) => {
        
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }
        if (particle.opacity <= 0){
            setTimeout(() => {
            particles.splice(i, 1)
            }, 0)
        } else {
        particle.update()
        }
    })

    // console.log(particles)
    
    invaderProjectiles.forEach((iprojectile, jindex)=> {
        if (iprojectile.position.y >= canvas.height) {
    invaderProjectiles.splice(jindex, 1)
        } else {
        iprojectile.update()}

        if (player.position &&
        iprojectile.position.y + iprojectile.height >= player.position.y &&
        iprojectile.position.y <= player.position.y + player.height &&
        iprojectile.position.x + iprojectile.width >= player.position.x &&
        iprojectile.position.x <= player.position.x + player.width){
        console.log("youlose")
        createparticles({
        object: player,
        color: 'white'
        })
        setTimeout(() => {
            invaderProjectiles.splice(jindex, 1)
            player.opacity = 0
            game.over = true

        }, 0) 
        setTimeout(() => {
            game.active = false
            currentGameState = STATES.GAMEOVER
        }, 2000) 
        }
    });
    projectiles.forEach((projectile, index)=> {
        if (projectile.position.y + projectile.radius <= 0) {
           setTimeout(() => {
            projectiles.splice(index, 1)
        }, 0)
        } else {
        projectile.update()
        }
    });


    grids.forEach((grid, gridIndex) => {
    grid.update()

    if (frames % 100 === 0 && grid.invaders.length > 0){
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }

 
    for (let i = grid.invaders.length - 1; i >= 0; i--) {
        const invader = grid.invaders[i]

        invader.update({velocity: grid.velocity})

        if (!invader.position || !invader.image) continue

        for (let j = projectiles.length - 1; j >= 0; j--) {
            const projectile = projectiles[j]

            if (
                projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                projectile.position.x + projectile.radius >= invader.position.x &&
                projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                projectile.position.y + projectile.radius >= invader.position.y
            ) {
                score += 100
                console.log(score)
                scoreEL.innerHTML = score
                createparticles(
                    {object: invader}
                )

                grid.invaders.splice(i, 1)
                projectiles.splice(j, 1)

                if (grid.invaders.length > 0) {
                    const firstInvader = grid.invaders[0]
                    const lastInvader = grid.invaders[grid.invaders.length - 1]

                    grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                    grid.position.x = firstInvader.position.x
                }
                else {
                    grids.splice(gridIndex, 1)
                }
                break
            }
        }
    }
})


    const speed = 7;
    const rotationamt = 0.15
    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -speed
        player.rotation = -rotationamt
    }
    else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = speed
        player.rotation = rotationamt
    }
    else {
        player.velocity.x = 0
        player.rotation = 0
    }
    // console.log(frames)
    if (frames % randomInt === 0){
        grids.push(new Grid())
        randomInt = (Math.floor(Math.random() * 500) + 500)
        frames = 0
        // console.log(randomInt)
    }
    
    frames++
}

if (player.image && player.image.onload) {player.image.onload();} {
    animate()
}

addEventListener('keydown', ({key}) => {
    if (game.over & key !== "Enter") return

    switch (key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
        case 'left':
            // console.log('left')
            keys.a.pressed = true
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
        case 'right':
            // console.log('right')
            keys.d.pressed = true
            break
        case ' ':
        case 'Space':
            // console.log('shoot')
        if (!keys.space.pressed) {
            keys.space.pressed = true

            projectiles.push(new Projectile({
            position: {
                x: player.position.x + player.width / 2,
                y: player.position.y
            },
            velocity: {
                x: 0,
                y: -10
            }
        }))
        }
        // console.log([projectiles])
        break
        case 'Enter':
            if (currentGameState === STATES.START) {
                currentGameState = STATES.PLAYING
            } else if (currentGameState === STATES.GAMEOVER) {
                score = 0
                scoreEL.innerHTML = score
                game.over = false
                game.active = true
                if (player.image) {
                    player.position = {
                        x: (canvas.width - player.width) / 2,
                        y: canvas.height - player.height - 20
                    }

                    player.velocity = { x: 0, y: 0 }
                    player.rotation = 0
                    player.opacity = 1
                }
                // console.log('Player after restart:', {
                // image: player.image,
                // position: player.position,
                // width: player.width,
                // height: player.height,
                // opacity: player.opacity
                // })
                projectiles.length = 0
                grids.length = 0
                invaderProjectiles.length = 0

                frames = 0
                currentGameState = STATES.PLAYING}
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
        case 'left':
            // console.log('left')
            keys.a.pressed = false
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
        case 'right':
            // console.log('right')
            keys.d.pressed = false
            break
        case ' ':
        case 'Space':
            // console.log('shoot')
            keys.space.pressed = false
            break
    }
})

animate();