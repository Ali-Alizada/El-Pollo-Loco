let canvas;
let ctx;
let character = new charachter();

enemies = [
    new chicken(),
    new chicken(),
    new chicken()
 
]

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");


    console.log('My Charchter', character);

}
    