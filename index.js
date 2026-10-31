const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight


class Player{
    constructor(){
        

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0

        const image = new Image()
        image.src = 'assets/images/spaceship.png'

        image.onload = () => {
            const resizescale = 0.15
            this.image = image
            this.width = image.width * resizescale
            this.height = image.height * resizescale
            this.position = {
                    x: (canvas.width - this.width)/2,
                    y: canvas.height - this.height - 20
            }
        }
    }
    draw() {
            //c.fillStyle = 'red'
         //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if (!this.image || !this.position) return;
            c.save()
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

        this.radius = 3
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

class Invader{
    constructor(position){

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
    update() {
        this.draw()
        if(this.position) {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

        }
    }
}


class Grid{
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
    
        this.velocity = {
            x: 0,
            y: 0
        } 
    
    for (let i = 0; i < 10; i++) {
        this.invaders.push(new Invader({position: {
            x: 0,
            y: 0
        }}))
        }
        console.log(this.invaders)
    }
    update() {}

}


const player = new Player()
const projectiles = []
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
const grids = [new Grid]

player.draw()

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectiles.forEach((projectile, index)=> {
        if (projectile.position.y + projectile.radius <= 0) {
           setTimeout(() => {
            projectiles.splice(index, 1)
        }, 0)
        } else {
        projectile.update()
        }
    });


    grids.forEach(grid => {
        grid.invaders.forEach(invader => {
            invader.update()
        })
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
}

if (player.image && player.image.onload) {player.image.onload();} {
    animate()
}

addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
        case 'left':
            console.log('left')
            keys.a.pressed = true
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
        case 'right':
            console.log('right')
            keys.d.pressed = true
            break
        case ' ':
        case 'Space':
            console.log('shoot')
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width/2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            console.log([projectiles])
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
        case 'left':
            console.log('left')
            keys.a.pressed = false
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
        case 'right':
            console.log('right')
            keys.d.pressed = false
            break
        case ' ':
        case 'Space':
            console.log('shoot')
            break
    }
})