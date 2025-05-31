if (
  /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  document.body.style.margin = "0";
  document.body.style.background = "black";
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: black;
      color: white;
      font-family: 'Determination Mono', monospace;
      font-size: 24px;
      text-align: center;
      padding: 20px;
      text-shadow: 0 0 2px #969696, 2px 0 2px #969696, -2px 0 2px #969696, 0 2px 2px #969696, 0 -2px 2px #969696;
    ">
      CONNECTION IS RUPTURING,<br>TRY AGAIN NEXT TIME<br>THROUGH ANOTHER MEDIUM.
    </div>`;
  throw new Error("only on pc sorry bud");
}
const textBox = document.getElementById("text-box");
const inputBox = document.getElementById("input-box");
const answerInput = document.getElementById("answer");

const messages = [
  ".....",
  "HOW CURIOUS.\nHOW...         INTERESTING.",
  "YOU KNOCKED, LITTLE SHADOW,\nBUT I WASN'T THE DOOR YOU MEANT TO OPEN.",
  "STILL...",
  "YOU CAME THROUGH.",
  "NOW I FEEL YOU.\nA SIMPLE THREAD PULLED FROM A DIFFERENT CLOTH.",
  "YOU'RE NOT THE ONE I WAS WAITING FOR.",
  "BUT YOU'RE HERE.\nAND I'M NOT RUDE.",
  "SO... A GIFT.",
  "A PIECE.\nA PLACEHOLDER.",
  "A PUZZLE.",
  "FOLLOW:",
  "I LOCK WITHOUT ARMS,\nI OPEN WITHOUT TEETH.",
  "I STAY SILENT IN POCKETS,\nBUT TURN ME, AND I SING.",
  "I AM NOT A QUESTION.\nI AM THE ANSWER.",
  "SO TELL ME...",
  "WHO AM I?",
];

let state = {
  messageIndex: 0,
  charIndex: 0,
  currentMessage: "",
  baseTypingSpeed: 40,
  currentTypingSpeed: 40,
  isTyping: false,
  typingTimeout: null,
  isInputActive: false,
  isLocked: false,
  justSkipped: false,
  showingFinalMessage: false,
  audio: null,
  fastMode: false,
  backgroundRemoved: false,
};

function init() {
  state.audio = new Audio("CONNECTED.ogg");
  state.audio.loop = true;
  state.audio.play();

  showNextMessage();
}

function typeNextChar() {
  if (state.charIndex < state.currentMessage.length) {
    textBox.textContent += state.currentMessage.charAt(state.charIndex);
    state.charIndex++;
    state.typingTimeout = setTimeout(typeNextChar, state.currentTypingSpeed);
  } else {
    finishTyping();
  }
}

function finishTyping() {
  state.isTyping = false;
  state.justSkipped = false;
  state.isLocked = false;

  if (state.messageIndex === 12 && !state.backgroundRemoved) {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "black";
    state.backgroundRemoved = true;
  }

  if (state.messageIndex >= messages.length && !state.showingFinalMessage) {
    inputBox.classList.remove("hidden");
    answerInput.focus();
    state.isInputActive = true;
  } else if (state.showingFinalMessage) {
    setTimeout(() => {
      fadeOutTextBox(() => {
        window.location.href = "index2.html";
      });
    }, 1000);
  }
}

function skipTyping() {
  if (!state.isTyping) return;

  clearTimeout(state.typingTimeout);
  textBox.textContent = state.currentMessage;
  state.charIndex = state.currentMessage.length;
  state.isTyping = false;
  state.justSkipped = true;
  state.isLocked = false;

  finishTyping();
}

function skipToInput() {
  if (state.isLocked) return;

  clearTimeout(state.typingTimeout);
  state.isTyping = false;
  state.messageIndex = messages.length;
  textBox.textContent = "";
  inputBox.classList.remove("hidden");
  answerInput.focus();
  state.isInputActive = true;
  state.isLocked = false;

  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = "black";
  state.backgroundRemoved = true;
}

function showNextMessage() {
  if (state.isTyping || state.messageIndex >= messages.length || state.isLocked)
    return;

  state.currentMessage = messages[state.messageIndex];
  state.charIndex = 0;
  state.isTyping = true;

  if (state.messageIndex === 11 && !state.backgroundRemoved) {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "black";
    state.backgroundRemoved = true;
  }

  fadeOutTextBox(() => {
    textBox.textContent = "";
    typeNextChar();
    state.messageIndex++;
  });
}

function fadeOutTextBox(callback) {
  state.isLocked = true;
  textBox.style.transition = "opacity 0.5s ease";
  textBox.style.opacity = 0;

  setTimeout(() => {
    textBox.style.transition = "none";
    textBox.textContent = "";
    textBox.style.opacity = 1;

    void textBox.offsetWidth;
    textBox.style.transition = "opacity 0.5s ease";
    callback();
    state.isLocked = false;
  }, 500);
}

function handleAnswer() {
  const val = answerInput.value.trim().toLowerCase();
  if (val === "key") {
    document.title = "KEY";
    inputBox.classList.add("hidden");
    state.isInputActive = false;
    state.currentMessage = "VERY WELL.";
    state.charIndex = 0;
    state.isTyping = true;
    state.showingFinalMessage = true;
    state.messageIndex = messages.length + 1;
    textBox.textContent = "";
    typeNextChar();
  } else {
    textBox.textContent = "LOUD INCORRECT BUZZER.";
    answerInput.value = "";
    const errorSound = new Audio("snd_text_buzzer.wav");
    errorSound.play();
  }
}

function playTypeSound() {
  const typeSound = new Audio("snd_text_ch1.wav");
  typeSound.volume = 0.4;
  typeSound.play();
}

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const key = e.key.toLowerCase();

  if (state.isInputActive && e.key !== "Enter") return;

  if (["z", " ", "enter"].includes(key)) {
    e.preventDefault();
    if (state.isTyping && !state.justSkipped) {
      skipTyping();
    } else if (!state.isTyping && state.messageIndex < messages.length) {
      showNextMessage();
    }
  }

  if (["x", "shift"].includes(key)) {
    state.currentTypingSpeed = state.baseTypingSpeed / 4;
    state.fastMode = true;
  }

  if (["c", "control"].includes(key)) {
    e.preventDefault();
    skipToInput();
  }
});

document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (["x", "shift"].includes(key)) {
    state.currentTypingSpeed = state.baseTypingSpeed;
    state.fastMode = false;
  }
});

answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleAnswer();
  } else if (e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt") {
    playTypeSound();
  }
});

init();
