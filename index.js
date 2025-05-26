var dooropened = false;

if (!localStorage.getItem("doorsOpened")) {
  localStorage.setItem(
    "doorsOpened",
    JSON.stringify({ door2: false, door3: false })
  );
}

const door = document.querySelector(".doorimg");
const door2 = document.querySelector(".doorimg2");
const door3 = document.querySelector(".doorimg3");
const button = document.querySelector(".button");
const eggman = document.querySelector(".eggman");
const eggs = document.querySelector(".eggs");
const input = document.querySelector(".dinput");

let spinDuration = 5;
let eggmanSize = 100;

door.addEventListener("mouseover", () => {
  if (!dooropened) door.src = "dd2.png";
});
door.addEventListener("mouseout", () => {
  if (!dooropened) door.src = "dd1.png";
});
door.addEventListener("click", () => {
  if (!dooropened) {
    door.classList.add("doorshake");
    door.src = "dd3.png";
    const audio = new Audio("door.wav");
    audio.volume = 0.5;
    audio.play();
    dooropened = true;
    setTimeout(() => {
      window.location.href = "30.html";
    }, 2000);
  }
});

function updateUnlockedDoors() {
  const state = JSON.parse(localStorage.getItem("doorsOpened"));

  if (state.door2) {
    door2.classList.remove("hide");
    door2.src = "ee1.png";
    door2.addEventListener("mouseover", () => {
      if (!dooropened) door2.src = "ee2.png";
    });
    door2.addEventListener("mouseout", () => {
      if (!dooropened) door2.src = "ee1.png";
    });
    door2.addEventListener("click", () => {
      if (!dooropened) {
        door2.classList.add("doorshake");
        door2.src = "ee3.png";
        const audio = new Audio("door.wav");
        audio.volume = 0.5;
        audio.play();
        dooropened = true;
        setTimeout(() => {
          window.location.href = "67.html";
        }, 2000);
      }
    });
  }

  if (state.door3) {
    door3.classList.remove("hide");
    door3.src = "ee1.png";
    door3.addEventListener("mouseover", () => {
      if (!dooropened) door3.src = "ee2.png";
    });
    door3.addEventListener("mouseout", () => {
      if (!dooropened) door3.src = "ee1.png";
    });
    door3.addEventListener("click", () => {
      if (!dooropened) {
        door3.classList.add("doorshake");
        door3.src = "ee3.png";
        const audio = new Audio("door.wav");
        audio.volume = 0.5;
        audio.play();
        dooropened = true;
        setTimeout(() => {
          window.location.href = "48.html";
        }, 2000);
      }
    });
  }
}
const glass = new Audio("snd_glass_crunch.wav");
glass.volume = 0.2;

const levelup = new Audio("snd_levelup.wav");
levelup.volume = 0.5;

eggman.addEventListener("click", () => {
  glass.currentTime = 0;
  glass.play();
  const currentCount = parseInt(eggs.textContent, 10);
  eggs.textContent = currentCount + 1;
  spinDuration /= 1.1;
  document.styleSheets[0].insertRule(
    `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`,
    document.styleSheets[0].cssRules.length
  );
  eggman.querySelector(
    "img"
  ).style.animation = `spin ${spinDuration}s linear infinite`;
  eggmanSize += 0.5;
  if (currentCount % 50 === 0) {
    levelup.currentTime = 0;
    levelup.play();
    eggman.querySelector("img").style.width = `${eggmanSize}%`;
    eggman.querySelector("img").style.height = `${eggmanSize}%`;
  }
});

button.addEventListener("click", () => {
  const state = JSON.parse(localStorage.getItem("doorsOpened"));
  input.value = input.value.trim();
  const val = input.value.toLowerCase();

  if (val === "hunter" && !state.door2) {
    state.door2 = true;
    localStorage.setItem("doorsOpened", JSON.stringify(state));
    const unlockAudio = new Audio("snd_ominous.wav");
    unlockAudio.volume = 0.2;
    unlockAudio.play();
    updateUnlockedDoors();
  } else if (val === "danger" && !state.door3) {
    state.door3 = true;
    localStorage.setItem("doorsOpened", JSON.stringify(state));
    const unlockAudio = new Audio("snd_ominous.wav");
    unlockAudio.volume = 0.2;
    unlockAudio.play();
    updateUnlockedDoors();
  } else if (val === "egg") {
    eggman.classList.remove("hide");
    const eggAudio = new Audio("snd_creepyjingle.wav");
    eggAudio.volume = 0.5;
    eggAudio.play();
  } else if (val === "gurt") {
    localStorage.clear();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else if (val === "") {
    localStorage.clear();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    input.value = "";
  }

  input.value = "";
});

updateUnlockedDoors();
