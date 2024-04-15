import { fromEvent, connectable, ReplaySubject } from "rxjs";
import { filter, map, shareReplay, take, tap } from "rxjs/operators";

let thaiSpeaker: SpeechSynthesisVoice;
const speechSynthesis = window.speechSynthesis;

speechSynthesis.addEventListener("voiceschanged", () => {
  const voices = speechSynthesis.getVoices();
  const fVoices = voices.filter((voice) => voice.lang.includes("th"));
  thaiSpeaker = fVoices[0];
});

export function speakWithSpeechSynthesis(content: string) {
  if (thaiSpeaker) {
    const utterance = new SpeechSynthesisUtterance(content);
    // utterance.lang = "th-TH";
    utterance.voice = thaiSpeaker;
    utterance.volume = 1;
    utterance.pitch = 1;
    utterance.rate = 1.2;
    speechSynthesis.speak(utterance);
  }
}
