const textBox = document.getElementById("text-box");
const inputBox = document.getElementById("input-box");
const answerInput = document.getElementById("answer");

const messages = [
  "……",
  "da riddle",
  "riddle me this bro",
  "k",
  "e",
  "y",
  "\nVery well",
];

let messageIndex = 0;
let charIndex = 0;
let currentMessage = "";
let typingSpeed = 40;
let isTyping = false;

const typeSound = new Audio("snd_text_ch1.wav");
typeSound.volume = 0.4;

function playTypeSound() {
  const s = typeSound.cloneNode();
  s.play();
}

function typeNextChar() {
  if (charIndex < currentMessage.length) {
    textBox.textContent += currentMessage.charAt(charIndex);
    playTypeSound();
    charIndex++;
    setTimeout(typeNextChar, typingSpeed);
  } else {
    isTyping = false;
    if (messageIndex === messages.length - 1) {
      inputBox.classList.remove("hidden");
      answerInput.focus();
    }
  }
}

function showNextMessage() {
  if (isTyping || messageIndex >= messages.length) return;

  textBox.textContent = ""; // clear previous
  currentMessage = messages[messageIndex];
  charIndex = 0;
  isTyping = true;
  typeNextChar();
  messageIndex++;
}

function startSequence() {
  showNextMessage();
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (
    ["z", " ", "enter"].includes(key) &&
    !isTyping &&
    inputBox.classList.contains("hidden")
  ) {
    e.preventDefault();
    showNextMessage();
  }
});

answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = answerInput.value.trim().toLowerCase();
    if (val === "key") {
      inputBox.classList.add("hidden");
      setTimeout(() => {
        window.location.href = "index2.html";
      }, 1500);
    } else {
      textBox.textContent = "LOUD INCORRECT BUZZER.";
      answerInput.value = "";
    }
  }
});

startSequence();
