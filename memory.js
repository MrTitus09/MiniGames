const timer = document.getElementById("timer");

let seconds = 0;

setInterval(() => {
    seconds++;

    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");

    timer.textContent = `${min}:${sec}`;
}, 1000);


const game = document.getElementById("game")

let emojis = [
    "🍎","🍎",
    "🐱","🐱",
    "⭐","⭐",
    "🚀","🚀",
    "🎮","🎮",
    "🍕","🍕",
    "🐸","🐸",
    "💎","💎"
];

// Karıştır
emojis.sort(() => Math.random() - 0.5);

let firstCard = null;
let secondCard = null;
let lockBoard = false;

for (let emoji of emojis) {

    const card = document.createElement("div");

    card.className = "card hidden";
    card.textContent = emoji;

    card.addEventListener("click", () => {

        if (lockBoard) return;
        if (!card.classList.contains("hidden")) return;

        card.classList.remove("hidden");

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        lockBoard = true;

        if (firstCard.textContent === secondCard.textContent) {

            firstCard = null;
            secondCard = null;
            lockBoard = false;

        } else {

            setTimeout(() => {

                firstCard.classList.add("hidden");
                secondCard.classList.add("hidden");

                firstCard = null;
                secondCard = null;
                lockBoard = false;

            }, 800);

        }

    });

    game.appendChild(card);

}