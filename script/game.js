let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);

    setupUI();
    updateSoundIcon(); 
    showScreen("startScreen"); 
}


window.addEventListener("keydown", (event) => {
    if(event.keyCode == 39) keyboard.RIGHT = true;
    if(event.keyCode == 37) keyboard.LEFT = true;
    if(event.keyCode == 38) keyboard.UP = true;
    if(event.keyCode == 40) keyboard.DOWN = true;
    if(event.keyCode == 32) keyboard.SPACE = true;
    if(event.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (event) => {
    if(event.keyCode == 39) keyboard.RIGHT = false;
    if(event.keyCode == 37) keyboard.LEFT = false;
    if(event.keyCode == 38) keyboard.UP = false;
    if(event.keyCode == 40) keyboard.DOWN = false;
    if(event.keyCode == 32) keyboard.SPACE = false; 
    if(event.keyCode == 68) keyboard.D = false;
});


function toggleFullscreen() {
    let canvas = document.getElementById("canvas");
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function updateUIVisibility(screenId) {
    const bottomBar = document.querySelector(".bottom-bar");
    if (screenId === "startScreen") {
        bottomBar.style.display = "flex";
    } else {
        bottomBar.style.display = "none";
    }
}

function updateSoundIcon() {
    const soundBtn = document.getElementById("soundBtn");

    if (world.sound.muted) {
        soundBtn.src = "img/8_coin/volume_off.png";
    } else {
        soundBtn.src = "img/8_coin/volume_on.png";
    }
}



function setupUI() {
    document.getElementById("soundBtn").onclick = () => {
        world.handleClick("sound");
        updateSoundIcon();
    };

    document.getElementById("fullscreenBtn").onclick = () => {
        world.handleClick("fullscreen");
    };

    document.getElementById("startBtn").onclick = () => {
        world.handleClick("start");
        showScreen(null);
    };

    document.getElementById("homeWin").onclick = () => {
        world.handleClick("back");
        showScreen("startScreen");
    };
    
    document.getElementById("restartWin").onclick = () => {
        world.handleClick("restart");
        showScreen(null);
    };

    document.getElementById("homeLose").onclick = () => {
        world.handleClick("back");
        showScreen("startScreen");
    };

    document.getElementById("restartLose").onclick = () => {
        world.handleClick("restart");
        showScreen(null);
    };

    document.getElementById("privacyBtn").onclick = (e) => {
        e.preventDefault();
        openDialog("privacy");
    };

    document.getElementById("infoBtn").onclick = (e) => {
        e.preventDefault();
        openDialog("info");
    };

    document.getElementById("closeDialog").onclick = closeDialog;

    document.getElementById("dialog").onclick = (e) => {
    if (e.target.id === "dialog") {
        closeDialog();
    }
};

}

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));

    if (id) {
        document.getElementById(id).classList.add("active");
    }

    updateUIVisibility(id);
    if (this.gameState === "running") {
    showScreen(null); 
    this.drawGameObjects();
}
}

function openDialog(type) {
    const dialog = document.getElementById("dialog");

    dialog.classList.add("show");

    document.querySelectorAll(".dialog-content").forEach(el => {
        el.classList.remove("active");
    });

    if (type === "privacy") {
        document.getElementById("privacyContent").classList.add("active");
    }

    if (type === "info") {
        document.getElementById("infoContent").classList.add("active");
    }
}

function closeDialog() {
    document.getElementById("dialog").classList.remove("show");
}


