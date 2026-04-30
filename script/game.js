let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
    setupUI();
    setupJoystick();
    setupMobileControls();

    world = new World(canvas, keyboard);
    window.world = world;
    updateSoundIcon();
}

window.addEventListener("keydown", (event) => {
    if (event.keyCode == 39) keyboard.RIGHT = true;
    if (event.keyCode == 37) keyboard.LEFT = true;
    if (event.keyCode == 32) keyboard.SPACE = true;
    if (event.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (event) => {
    if (event.keyCode == 39) keyboard.RIGHT = false;
    if (event.keyCode == 37) keyboard.LEFT = false;
    if (event.keyCode == 32) keyboard.SPACE = false;
    if (event.keyCode == 68) keyboard.D = false;
});

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
        if (e.target.id === "dialog") closeDialog();
    };
}

function updateSoundIcon() {
    if (!world) return;

    const soundBtn = document.getElementById("soundBtn");
    soundBtn.src = world.sound.muted
        ? "img/8_coin/volume_off.png"
        : "img/8_coin/volume_on.png";
}

function toggleFullscreen() {
    let container = document.getElementById("game-container");
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function setupMobileControls() {
    const btnJump = document.getElementById("btnJump");
    const btnThrow = document.getElementById("btnThrow");

    btnJump.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });

    btnJump.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });

    btnThrow.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.D = true;
    });

    btnThrow.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.D = false;
    });
}

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s =>
        s.classList.remove("active")
    );

    if (id) {
        document.getElementById(id).classList.add("active");
    }
    updateUIVisibility(id);
    updateMobileControls();
}

function updateUIVisibility(screenId) {
    const bottomBar = document.querySelector(".bottom-bar");
    bottomBar.style.display =
        screenId === "startScreen" ? "flex" : "none";
}

function updateMobileControls() {
    const controls = document.getElementById("mobile-controls");
    const joystick = document.getElementById("joystick");

    if (!world) return;

    if (world.gameState === "running") {
        controls.classList.add("active");
        joystick.classList.add("active");
    } else {
        controls.classList.remove("active");
        joystick.classList.remove("active");
    }
}

function setupJoystick() {
    const base = document.getElementById("joystick-base");
    const knob = document.getElementById("joystick-knob");

    let active = false;
    let centerX;

    base.addEventListener("touchstart", (e) => {
        e.preventDefault();
        active = true;
        const rect = base.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
    });

    base.addEventListener("touchmove", (e) => {
        if (!active) return;
        e.preventDefault();

        const touch = e.touches[0];
        let dx = touch.clientX - centerX;

        const max = 40;
        dx = Math.max(-max, Math.min(max, dx));

        knob.style.transform = `translate(${dx}px, 0px)`;

        keyboard.axisX = dx / max;
        keyboard.LEFT = keyboard.axisX < -0.3;
        keyboard.RIGHT = keyboard.axisX > 0.3;
    });

    base.addEventListener("touchend", (e) => {
        e.preventDefault();
        active = false;

        knob.style.transform = `translate(0px, 0px)`;

        keyboard.axisX = 0;
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
    });
}

function openDialog(type) {
    const dialog = document.getElementById("dialog");
    dialog.classList.add("show");

    document.querySelectorAll(".dialog-content").forEach(el =>
        el.classList.remove("active")
    );

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