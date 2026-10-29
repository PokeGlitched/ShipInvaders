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
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        if(this.position) {
            this.position.x += this.velocity.x
        }
    }
}

const player = new Player()
player.draw()

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
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
            player.velocity.x = -5
            break
        case 'd':
        case 'D':
        case 'ArrowRight':
        case 'right':
            console.log('right')
            break
        case ' ':
        case 'Space':
            console.log('shoot')
            break
    }
})