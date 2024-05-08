const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.maxSpeed = 5; // Velocidad máxima permitida
        this.isColliding = false;
        this.collideColor = "red";
        this.originalColor = color; // Color original del círculo

        this.dx = Math.random() < 0.5 ? -1 * this.speed : 1 * this.speed; // Dirección x inicial aleatoria
        this.dy = Math.random() < 0.5 ? -1 * this.speed : 1 * this.speed; // Dirección y inicial aleatoria
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        this.draw(context);

        // Verificar colisión con los bordes de la ventana
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > window_height) {
            this.dy = -this.dy;
        }

        // Verificar colisión con otros círculos
        for (let otherCircle of circles) {
            if (otherCircle !== this) {
                const distance = getDistance(this.posX, this.posY, otherCircle.posX, otherCircle.posY);
                if (distance < (this.radius + otherCircle.radius)) {
                    // Cambiar color a rojo para ambos círculos involucrados en la colisión
                    this.isColliding = true;
                    otherCircle.isColliding = true;
                    this.color = this.collideColor; // Cambiar color a rojo
                    otherCircle.color = otherCircle.collideColor; // Cambiar color a rojo
                    // Cambiar direcciones para rebote
                    const dx = otherCircle.posX - this.posX;
                    const dy = otherCircle.posY - this.posY;
                    const angle = Math.atan2(dy, dx);
                    const targetX = this.posX + Math.cos(angle) * (this.radius + otherCircle.radius);
                    const targetY = this.posY + Math.sin(angle) * (this.radius + otherCircle.radius);
                    const ax = (targetX - otherCircle.posX) * 0.1;
                    const ay = (targetY - otherCircle.posY) * 0.1;
                    this.dx -= ax;
                    this.dy -= ay;
                }
            }
        }

        // Verificar si ninguno de los otros círculos está colisionando con este círculo
        if (!this.isColliding) {
            this.color = this.originalColor; // Restaurar el color original
        }

        // Actualizar posición y controlar la velocidad máxima
        this.posX += this.dx;
        this.posY += this.dy;

        // Controlar la velocidad máxima
        const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        if (speed > this.maxSpeed) {
            const factor = this.maxSpeed / speed;
            this.dx *= factor;
            this.dy *= factor;
        }

        // Restaurar isColliding después de un breve período para que los colores cambien
        setTimeout(() => {
            this.isColliding = false;
        }, 100);
    }
}

function getDistance(posx1, posY1, posX2, posY2) {
    return Math.sqrt(Math.pow((posX2 - posx1), 2) + Math.pow((posY2 - posY1), 2));
}

let circles = [];
for (let i = 0; i < 10; i++) {
    let randomX = Math.random() * window_width;
    let randomY = Math.random() * window_height;
    let randomRadius = Math.floor(Math.random() * 100 + 30);
    circles.push(new Circle(randomX, randomY, randomRadius, "blue", (i + 1).toString(), 1));
}

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    for (let circle of circles) {
        circle.update(ctx, circles);
    }
};

updateCircles();