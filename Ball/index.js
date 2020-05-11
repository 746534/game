var obj = document.getElementById("mycanvas"),
    w = window.innerWidth,
    h = window.innerHeight,
    s = w + h,
    foodArr = [],
    huabu = {
        ax: w * 3,
        ay: h * 3
    }
My = {
    x: w / 2,
    y: h / 2,
    r: 6,
    next_x: w / 2,
    next_y: h / 2,
    posX: w / 2,
    posY: h / 2,
    tiji: 0
}

var Scolor = ["red", "green", "blue", "white", "yellow", "#ccc"];
var context = obj.getContext("2d");
// console.log(Scolor)
function canvasN() {
    obj.width = w;
    obj.height = h;
    obj.style.background = "black"
    createfood()
    Mymove()
}

function role(x, y, r, ys, yy) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI)
    context.fillStyle = ys;
    context.shadowBlur = yy;
    context.shadowColor = ys;
    context.fill();
}

function food(_x, _y, _c) {
    this.left = _x;
    this.top = _y;
    this.color = _c;
    role(this.left, this.top, 2, this.color, 0)
}

function createfood() {
    for (var i = 0; i < s; i++) {
        var posLeft = Math.floor(Math.random() * huabu.ax),
            posTop = Math.floor(Math.random() * huabu.ay),
            length = Scolor.length,
            _S = Scolor[Math.floor(Math.random() * length)];

        foodArr[i] = new food(posLeft, posTop, _S)
    }
}

document.onmousemove = function (e) {
    var e = e || window.event;

    My.next_x = e.clientX;
    My.next_y = e.clientY;
}



setInterval(function () {
    context.clearRect(0, 0, w, h)
    Mymove();

}, 10)

function Mymove() {
    role(My.x, My.y, My.r, "white", 20)
   
    var move_x = (My.next_x - My.x) / 200,
        move_y = (My.next_y - My.y) / 200;

    My.posX += move_x;
    My.posY += move_y;
    
    for (var i = 0; i < foodArr.length; i++) {
        foodArr[i].left -= move_x;
        foodArr[i].top -= move_y;
        if (foodArr[i].left <= My.x + My.r && foodArr[i].left >= My.x - My.r && foodArr[i].top <= My.y + My.r && foodArr[i].top >= My.y - My.r) {
            foodArr.splice(i, 1)
            My.tiji += 1
            console.log(My.tiji)
        }
        if (My.posX < huabu.ax / 6) {
            My.x += move_x;
            move_x = 0
        } else if (My.posX > huabu.ax - w / 2) {
            My.x += move_x;
            move_x = 0
        }

        if (My.posY < huabu.ay / 6) {
            My.y += move_y
            move_y = 0
        } else if (My.posY > huabu.ay - h / 2) {
            My.y += move_y
            move_y = 0
        }
        role(foodArr[i].left, foodArr[i].top, 2, foodArr[i].color, 0)
    }

    

    // if (My.tiji >= 0 && My.tiji < 15) {
    //     My.r = 9
    // }
}
canvasN()