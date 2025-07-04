const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

window.addEventListener("resize", () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
});

//Key handling thing

let keysDown = [];

window.addEventListener("keydown", (e) => {
    if (!keysDown.includes(e.key)) {
        keysDown.push(e.key);
    };
});

window.addEventListener("keyup", (e) => {
    if (keysDown.includes(e.key)) {
        keysDown.splice(keysDown.indexOf(e.key),1);
    };
});

//Shooting bullet code

function normalizeVector(v) {
    const magnitude = Math.sqrt(v[0] * v[0] + v[1] * v[1]);

    if (magnitude != 0) {
        return {x: v[0] / magnitude, y: v[1] / magnitude};
    } else {
        return {x: 0, y: 0}
    }
};

window.addEventListener("click", (e) => {
    let mouseX = e.clientX - canvas.width / 2;
    let mouseY = e.clientY - canvas.height / 2;
    let normDirVec = normalizeVector([mouseX - plr.pos.x, mouseY - plr.pos.y]);
    bullets.push(
        new bullet(plr.pos, normDirVec)
    );
    plr.vel.x -= canvas.width * normDirVec.x * plr.bulletSpeed * 0.0005;
    plr.vel.y -= canvas.height * normDirVec.y * plr.bulletSpeed * 0.0005;
});

class player {
    constructor(pos) {
        this.pos = {x: pos[0], y: pos[1]};
        this.vel = {x:0, y:0};
        
        this.size = 0.1;
        this.maxHealth = 100;
        this.health = 100;

        this.speed = 5;
        this.reload = 0.5;
        this.damage = 1;
        this.bulletSpeed = 10;
    }

    move() {
        this.vel.x += (keysDown.includes("d") - keysDown.includes("a")) * canvas.width*0.001*this.speed;
        this.vel.y += (keysDown.includes("s") - keysDown.includes("w")) * canvas.width*0.001*this.speed;

        this.vel.x = Math.min(Math.max(this.vel.x, -this.speed*3), this.speed*3);
        this.vel.y = Math.min(Math.max(this.vel.y, -this.speed*3), this.speed*3);

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.vel.x *= 0.9;
        this.vel.y *= 0.9;
    }

    render() {
        ctx.fillStyle = "Red";

        ctx.beginPath();
        ctx.arc(this.pos.x + canvas.width/2, this.pos.y + canvas.height/2, canvas.height*this.size, 0, Math.PI * 2);
        ctx.fill();

        
    }
};

class bullet {
    constructor(pos, vel) {
        this.pos = {x: pos.x, y: pos.y};
        this.vel = {x: vel.x, y: vel.y};

        this.size = {x: canvas.width*plr.size/3, y: canvas.width*plr.size/3};
        this.bulletSpeed = plr.bulletSpeed;

        console.log(this.vel);
    }

    move() {
        this.pos.x += this.vel.x * this.bulletSpeed;
        this.pos.y += this.vel.y * this.bulletSpeed;
    }

    render() {
        const screenPos = {x: this.pos.x + canvas.width/2, y: this.pos.y + canvas.height/2}
        
        ctx.fillStyle = "white";
        ctx.save();

        ctx.translate(screenPos.x, screenPos.y);
        ctx.rotate(Math.atan2(this.vel.y, this.vel.x));
        
        ctx.beginPath();
        ctx.roundRect(-this.size.x/2, -this.size.y/2, this.size.x, this.size.y, 999);
        ctx.fill();

        ctx.restore();
    }
}

plr = new player([0,0]);
bullets = [];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bullets.forEach(bullet => {
        bullet.move();
        bullet.render();
    });

    plr.render();
    plr.move();

    requestAnimationFrame(animate);
}

animate();