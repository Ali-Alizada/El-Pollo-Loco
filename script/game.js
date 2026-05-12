let canvas;
let world;
let keyboard = new Keyboard();

// Joystick global state variables
let joystickActive = false;
let joystickCenterX = 0;

/**
 * Initializes the game: sets up canvas, UI, joystick, mobile controls, and the world.
 * @function init
 * @returns {void}
 */
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

/**
 * Sets up the sound button to toggle mute.
 * @function setupSoundButton
 * @returns {void}
 */
function setupSoundButton() {
    document.getElementById("soundBtn").onclick = () => {
        world.handleClick("sound");
        updateSoundIcon();
    };
}

/**
 * Sets up the fullscreen button to toggle full‑screen mode.
 * @function setupFullscreenButton
 * @returns {void}
 */
function setupFullscreenButton() {
    document.getElementById("fullscreenBtn").onclick = () => {
        world.handleClick("fullscreen");
    };
}

/**
 * Sets up the start button to begin the game.
 * @function setupStartButton
 * @returns {void}
 */
function setupStartButton() {
    document.getElementById("startBtn").onclick = () => {
        world.handleClick("start");
        showScreen(null);
    };
}

/**
 * Sets up the Home and Restart buttons for the win screen.
 * @function setupWinScreenButtons
 * @returns {void}
 */
function setupWinScreenButtons() {
    document.getElementById("homeWin").onclick = () => {
        world.handleClick("back");
        showScreen("startScreen");
    };
    document.getElementById("restartWin").onclick = () => {
        world.handleClick("restart");
        showScreen(null);
    };
}

/**
 * Sets up the Home and Restart buttons for the lose screen.
 * @function setupLoseScreenButtons
 * @returns {void}
 */
function setupLoseScreenButtons() {
    document.getElementById("homeLose").onclick = () => {
        world.handleClick("back");
        showScreen("startScreen");
    };
    document.getElementById("restartLose").onclick = () => {
        world.handleClick("restart");
        showScreen(null);
    };
}

/**
 * Sets up the buttons on the win/lose screens (Home & Restart).
 * @function setupGameOverButtons
 * @returns {void}
 */
function setupGameOverButtons() {
    setupWinScreenButtons();
    setupLoseScreenButtons();
}

/**
 * Sets up the privacy and info buttons plus the dialog close behaviour.
 * @function setupInfoPrivacyButtons
 * @returns {void}
 */
function setupInfoPrivacyButtons() {
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

/**
 * Main UI setup – calls all sub‑setup functions.
 * @function setupUI
 * @returns {void}
 */
function setupUI() {
    setupSoundButton();
    setupFullscreenButton();
    setupStartButton();
    setupGameOverButtons();
    setupInfoPrivacyButtons();
}

/**
 * Updates the sound icon depending on the mute status.
 * @function updateSoundIcon
 * @returns {void}
 */
function updateSoundIcon() {
    if (!world) return;
    const soundBtn = document.getElementById("soundBtn");
    soundBtn.src = world.sound.muted
        ? "img/8_coin/volume_off.png"
        : "img/8_coin/volume_on.png";
}

/**
 * Toggles fullscreen mode for the game container.
 * @function toggleFullscreen
 * @returns {void}
 */
function toggleFullscreen() {
    let container = document.getElementById("game-container");
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/**
 * Sets up touch events for the jump button.
 * @function setupJumpButton
 * @returns {void}
 */
function setupJumpButton() {
    const btnJump = document.getElementById("btnJump");
    btnJump.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });
    btnJump.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });
}

/**
 * Sets up touch events for the throw button.
 * @function setupThrowButton
 * @returns {void}
 */
function setupThrowButton() {
    const btnThrow = document.getElementById("btnThrow");
    btnThrow.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.D = true;
    });
    btnThrow.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.D = false;
    });
}

/**
 * Sets up touch buttons for mobile: jump and throw.
 * @function setupMobileControls
 * @returns {void}
 */
function setupMobileControls() {
    setupJumpButton();
    setupThrowButton();
}

/**
 * Displays a specific screen (start, win, lose) and hides the others.
 * @param {string|null} id - ID of the screen to show, or null to hide all.
 * @returns {void}
 */
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    if (id) {
        document.getElementById(id).classList.add("active");
    }
    updateUIVisibility(id);
    updateMobileControls();
}

/**
 * Shows or hides the bottom bar depending on the active screen.
 * @param {string|null} screenId - Currently active screen ID or null.
 * @returns {void}
 */
function updateUIVisibility(screenId) {
    const bottomBar = document.querySelector(".bottom-bar");
    bottomBar.style.display = screenId === "startScreen" ? "flex" : "none";
}

/**
 * Shows or hides the mobile controls (buttons + joystick) based on game state.
 * @function updateMobileControls
 * @returns {void}
 */
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

/**
 * Touch start handler for the joystick.
 * @param {TouchEvent} e - Touch event.
 * @returns {void}
 */
function joystickTouchStart(e) {
    e.preventDefault();
    joystickActive = true;
    const base = document.getElementById("joystick-base");
    const rect = base.getBoundingClientRect();
    joystickCenterX = rect.left + rect.width / 2;
}

/**
 * Touch move handler for the joystick – updates movement direction.
 * @param {TouchEvent} e - Touch event.
 * @returns {void}
 */
function joystickTouchMove(e) {
    if (!joystickActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    let dx = touch.clientX - joystickCenterX;
    const max = 40;
    dx = Math.max(-max, Math.min(max, dx));
    const knob = document.getElementById("joystick-knob");
    knob.style.transform = `translate(${dx}px, 0px)`;
    const axisX = dx / max;
    keyboard.axisX = axisX;
    keyboard.LEFT = axisX < -0.3;
    keyboard.RIGHT = axisX > 0.3;
}

/**
 * Touch end handler for the joystick – resets movement.
 * @param {TouchEvent} e - Touch event.
 * @returns {void}
 */
function joystickTouchEnd(e) {
    e.preventDefault();
    joystickActive = false;
    const knob = document.getElementById("joystick-knob");
    knob.style.transform = `translate(0px, 0px)`;
    keyboard.axisX = 0;
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
}

/**
 * Sets the joystick event listeners.
 * @function setupJoystick
 * @returns {void}
 */
function setupJoystick() {
    const base = document.getElementById("joystick-base");
    base.addEventListener("touchstart", joystickTouchStart);
    base.addEventListener("touchmove", joystickTouchMove);
    base.addEventListener("touchend", joystickTouchEnd);
}

/**
 * Opens the privacy or info dialog.
 * @param {string} type - Type of dialog: "privacy" or "info".
 * @returns {void}
 */
function openDialog(type) {
    const dialog = document.getElementById("dialog");
    dialog.classList.add("show");
    document.querySelectorAll(".dialog-content").forEach(el => el.classList.remove("active"));
    if (type === "privacy") {
        document.getElementById("privacyContent").classList.add("active");
    }
    if (type === "info") {
        document.getElementById("infoContent").classList.add("active");
    }
}

/**
 * Closes the currently open dialog.
 * @function closeDialog
 * @returns {void}
 */
function closeDialog() {
    document.getElementById("dialog").classList.remove("show");
}