let dooropened = false;

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

function setupDoor(img, hoverSrc, idleSrc, openSrc, url) {
  img.addEventListener("mouseover", () => {
    if (!dooropened) img.src = hoverSrc;
  });
  img.addEventListener("mouseout", () => {
    if (!dooropened) img.src = idleSrc;
  });
  img.addEventListener("click", () => {
    if (!dooropened) {
      img.classList.add("doorshake");
      img.src = openSrc;
      const audio = new Audio("door.wav");
      audio.volume = 0.5;
      audio.play();
      dooropened = true;
      setTimeout(() => {
        window.location.href = url;
      }, 2000);
    }
  });
  const keySound = new Audio("snd_text_ch1.wav");
  keySound.volume = 0.4;

  input.addEventListener("keydown", (e) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const sound = keySound.cloneNode();
      sound.play();
    }
  });
}

setupDoor(door, "dd2.png", "dd1.png", "dd3.png", "30.html");

function updateUnlockedDoors() {
  const state = JSON.parse(localStorage.getItem("doorsOpened"));

  if (state.door2) {
    door2.classList.remove("hide");
    setupDoor(door2, "ee2.png", "ee1.png", "ee3.png", "67.html");
  }

  if (state.door3) {
    door3.classList.remove("hide");
    setupDoor(door3, "ee2.png", "ee1.png", "ee3.png", "48.html");
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
  const img = eggman.querySelector("img");
  img.style.animation = `spin ${spinDuration}s linear infinite`;

  eggmanSize += 0.5;
  if ((currentCount + 1) % 50 === 0) {
    levelup.currentTime = 0;
    levelup.play();
    img.style.width = `${eggmanSize}%`;
    img.style.height = `${eggmanSize}%`;
  }
});

button.addEventListener("click", () => {
  const state = JSON.parse(localStorage.getItem("doorsOpened"));
  const val = input.value.trim().toLowerCase();

  if (val === "hunter" && !state.door2) {
    state.door2 = true;
    localStorage.setItem("doorsOpened", JSON.stringify(state));
    new Audio("snd_ominous.wav").play();
    updateUnlockedDoors();
  } else if (val === "danger" && !state.door3) {
    state.door3 = true;
    localStorage.setItem("doorsOpened", JSON.stringify(state));
    new Audio("snd_ominous.wav").play();
    updateUnlockedDoors();
  } else if (val === "egg") {
    eggman.classList.remove("hide");
    new Audio("snd_egg_ch1.wav").play();
  } else if (val === "gurt") {
    localStorage.clear();
    new Audio("snd_hypnosis_ch1.wav").play();
    setTimeout(() => window.location.reload(), 1500);
  } else if (val === "gaster") {
    document.body.innerHTML = "";
  }

  input.value = "";
});

updateUnlockedDoors();
