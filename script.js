const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");
const game = document.getElementById("game");
const ending = document.getElementById("ending");

const dice = document.getElementById("dice");
const messageBox = document.getElementById("messageBox");
const messageTitle = document.getElementById("messageTitle");
const message = document.getElementById("message");
const rollCount = document.getElementById("rollCount");

const replayBtn = document.getElementById("replayBtn");

let rolls = 0;
let audioContext = null;


/* =========================
   CHIBI
========================= */

function createChibi(src, className, alt) {
    const img = document.createElement("img");

    img.src = "ludo_chibi_assets/" + src;
    img.alt = alt || "";
    img.className = "chibi " + className;

    document.body.appendChild(img);

    requestAnimationFrame(function () {
        img.classList.add("chibi-show");
    });

    return img;
}

function removeChibis() {
    document.querySelectorAll(".chibi").forEach(function (chibi) {
        chibi.remove();
    });
}


/* =========================
   AUDIO
========================= */

function initAudio() {
    if (audioContext) return;

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) return;

    audioContext = new AudioContext();
}

function playTone(
    frequency,
    duration = 0.18,
    volume = 0.08
) {
    if (!audioContext) return;

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    const now =
        audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
        0.0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        now + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);
}

function diceSound() {
    playTone(430, 0.1, 0.06);

    setTimeout(function () {
        playTone(620, 0.12, 0.07);
    }, 70);

    setTimeout(function () {
        playTone(820, 0.18, 0.08);
    }, 140);
}

function finalSound() {
    const notes = [
        523,
        659,
        784,
        988
    ];

    notes.forEach(function (note, index) {
        setTimeout(function () {
            playTone(note, 0.5, 0.09);
        }, index * 150);
    });
}


/* =========================
   INTRO
========================= */

startBtn.addEventListener("click", function () {

    initAudio();

    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {
        audioContext.resume();
    }

    playTone(523, 0.3, 0.08);

    intro.classList.add("hidden");
    game.classList.remove("hidden");

    createChibi(
        "dice.png",
        "chibi-dice",
        "رايدن شوغن مع النرد"
    );

    setTimeout(function () {
        createChibi(
            "board.png",
            "chibi-board",
            "رايدن شوغن فوق رقعة اللودو"
        );
    }, 500);
});


/* =========================
   DICE
========================= */

const diceFaces = {
    1: [5],

    2: [1, 9],

    3: [1, 5, 9],

    4: [1, 3, 7, 9],

    5: [1, 3, 5, 7, 9],

    6: [1, 3, 4, 6, 7, 9]
};

function showDice(number) {

    document
        .querySelectorAll(".dot")
        .forEach(function (dot) {
            dot.style.display = "none";
        });

    diceFaces[number].forEach(function (position) {

        const dot =
            document.querySelector(
                ".dot-" + position
            );

        if (dot) {
            dot.style.display = "block";
        }
    });
}

function randomDice() {
    return Math.floor(
        Math.random() * 6
    ) + 1;
}


/* =========================
   MESSAGES
========================= */

const rollMessages = [
    {
        title: "رمية البداية",
        text: "أول ضغطة بدأت اللعبة… نشوف وين يوصلنا النرد."
    },

    {
        title: "خطوة جديدة",
        text: "كل رمية تعني خطوة جديدة… والمهم نستمتع بالطريق."
    },

    {
        title: "النرد اليوم عنده كلام",
        text: "واضح أن النرد قرر يشارك في الهدية."
    },

    {
        title: "قربنا",
        text: "بدأت الرحلة تقرب من نهايتها… لكن المفاجأة مازالت."
    },

    {
        title: "آخر خطوات",
        text: "باقي القليل… لا توقفي الآن."
    },

    {
        title: "وصلنا",
        text: "آخر رمية… وبعدها عندنا شيء خاص لدعدوعة."
    }
];

function showRollMessage(number) {

    const index =
        Math.min(
            rolls - 1,
            rollMessages.length - 1
        );

    const data =
        rollMessages[index];

    messageBox.classList.add("changing");

    setTimeout(function () {

        messageTitle.textContent =
            data.title + " — " + number;

        message.textContent =
            data.text;

        messageBox.classList.remove(
            "changing"
        );

    }, 180);
}


/* =========================
   CHIBI CHANGES
========================= */

function changeChibiAfterRoll() {

    document
        .querySelectorAll(".chibi")
        .forEach(function (chibi) {
            chibi.classList.remove(
                "chibi-bounce"
            );
        });

    const old =
        document.querySelector(
            ".chibi-dice"
        );

    if (old) {
        old.classList.add(
            "chibi-bounce"
        );
    }

    if (rolls === 2) {

        createChibi(
            "electro.png",
            "chibi-electro",
            "رايدن شوغن مع البرق"
        );
    }

    if (rolls === 4) {

        const oldElectro =
            document.querySelector(
                ".chibi-electro"
            );

        if (oldElectro) {
            oldElectro.remove();
        }

        createChibi(
            "plush.png",
            "chibi-plush",
            "رايدن شوغن مع دمية"
        );
    }
}


/* =========================
   ROLL
========================= */

dice.addEventListener("click", function () {

    if (
        dice.classList.contains("rolling")
    ) {
        return;
    }

    initAudio();

    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {
        audioContext.resume();
    }

    rolls++;

    dice.classList.add("rolling");

    diceSound();

    let animationTime = 0;

    const animation =
        setInterval(function () {

            showDice(
                randomDice()
            );

            animationTime++;

            if (animationTime >= 7) {

                clearInterval(animation);

                const result =
                    randomDice();

                showDice(result);

                dice.classList.remove(
                    "rolling"
                );

                rollCount.textContent =
                    "الرميات: " + rolls;

                showRollMessage(
                    result
                );

                changeChibiAfterRoll();

                if (rolls >= 6) {

                    setTimeout(
                        showEnding,
                        1600
                    );
                }
            }

        }, 90);
});


/* =========================
   LUDO PIECES
========================= */

document
    .querySelectorAll(".piece")
    .forEach(function (piece) {

        piece.addEventListener(
            "click",
            function () {

                initAudio();

                playTone(
                    720,
                    0.2,
                    0.07
                );

                const text =
                    piece.dataset.message;

                messageTitle.textContent =
                    "قطعة من اللودو";

                message.textContent =
                    text;

                piece.style.transform =
                    "scale(1.2)";

                setTimeout(function () {

                    piece.style.transform =
                        "";

                }, 220);
            }
        );
    });


/* =========================
   ENDING
========================= */

function showEnding() {

    removeChibis();

    finalSound();

    game.classList.add("hidden");
    ending.classList.remove("hidden");

    createChibi(
        "birthday.png",
        "chibi-birthday",
        "رايدن شوغن تحتفل بعيد الميلاد"
    );

    setTimeout(function () {

        ending.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);
}


/* =========================
   REPLAY
========================= */

replayBtn.addEventListener(
    "click",
    function () {

        rolls = 0;

        showDice(1);

        rollCount.textContent =
            "الرميات: 0";

        messageTitle.textContent =
            "النرد ينتظر ضغطتك";

        message.textContent =
            "اضغطي عليه وشوفي المفاجأة";

        ending.classList.add("hidden");

        game.classList.remove("hidden");

        removeChibis();

        createChibi(
            "dice.png",
            "chibi-dice",
            "رايدن شوغن مع النرد"
        );

        game.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
);


/* =========================
   DEFAULT DICE
========================= */

showDice(1);
