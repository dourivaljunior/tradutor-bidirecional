// =======================================
// BACKEND URL
// =======================================

const API_URL =
  "https://SEU_BACKEND.onrender.com/translate";

// =======================================
// ELEMENTOS
// =======================================

const startBtn =
  document.getElementById("startBtn");

const stopBtn =
  document.getElementById("stopBtn");

const statusText =
  document.getElementById("statusText");

const originalText =
  document.getElementById("originalText");

const translatedText =
  document.getElementById("translatedText");

const micLed =
  document.getElementById("micLed");

const vuBars =
  document.querySelectorAll(".vu-bar");

// =======================================
// CONTROLE
// =======================================

let recognition;

let listening = false;

let speaking = false;

// =======================================
// SPEECH RECOGNITION
// =======================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

recognition =
  new SpeechRecognition();

recognition.continuous = true;

recognition.interimResults = false;

recognition.lang = "pt-BR";

// =======================================
// INICIAR
// =======================================

startBtn.addEventListener("click", () => {

  if (listening) return;

  listening = true;

  recognition.start();

  statusText.innerText =
    "🎤 Ouvindo conversa...";

  micLed.classList.add("active");

});

// =======================================
// FINALIZAR
// =======================================

stopBtn.addEventListener("click", () => {

  listening = false;

  recognition.stop();

  speechSynthesis.cancel();

  statusText.innerText =
    "⏹ Conversa encerrada";

  micLed.classList.remove("active");

  resetVu();

});

// =======================================
// RECEBER FALA
// =======================================

recognition.onresult =
  async (event) => {

    if (speaking) return;

    const transcript =
      event.results[
        event.results.length - 1
      ][0].transcript.trim();

    if (transcript.length < 2)
      return;

    originalText.innerText =
      transcript;

    statusText.innerText =
      "🌐 Traduzindo...";

    try {

      const response =
        await fetch(API_URL, {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            text: transcript

          })

        });

      const data =
        await response.json();

      translatedText.innerText =
        data.translation;

      speakText(
        data.translation,
        data.voice
      );

    } catch (error) {

      console.error(error);

      statusText.innerText =
        "❌ Erro conexão";

    }

};

// =======================================
// FALAR TEXTO
// =======================================

function speakText(text, lang) {

  speaking = true;

  const utterance =
    new SpeechSynthesisUtterance(
      text
    );

  utterance.lang = lang;

  utterance.rate = 1;

  utterance.pitch = 1;

  utterance.onstart = () => {

    statusText.innerText =
      "🔊 Reproduzindo áudio...";

  };

  utterance.onend = () => {

    speaking = false;

    statusText.innerText =
      "🎤 Ouvindo conversa...";

  };

  speechSynthesis.speak(
    utterance
  );

}

// =======================================
// VU METER
// =======================================

function animateVu() {

  vuBars.forEach(bar => {

    const h =
      Math.floor(
        Math.random() * 140
      ) + 20;

    bar.style.height =
      `${h}px`;

  });

}

function resetVu() {

  vuBars.forEach(bar => {

    bar.style.height =
      "20px";

  });

}

setInterval(() => {

  if (
    listening &&
    !speaking
  ) {

    animateVu();

  } else {

    resetVu();

  }

}, 120);

// =======================================
// AUTO RESTART
// =======================================

recognition.onend = () => {

  if (
    listening &&
    !speaking
  ) {

    setTimeout(() => {

      recognition.start();

    }, 300);

  }

};
