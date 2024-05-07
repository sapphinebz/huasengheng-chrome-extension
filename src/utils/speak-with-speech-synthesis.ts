import {
  MonoTypeOperatorFunction,
  Observable,
  Subject,
  combineLatest,
  fromEvent,
  take,
} from "rxjs";

const speechSynthesis = window.speechSynthesis;
const onContextSpeech$ = new Subject<string>();

const thaiVoiceActor$ = new Observable<SpeechSynthesisVoice>((subscriber) => {
  return fromEvent(speechSynthesis, "voiceschanged").subscribe(() => {
    const voices = speechSynthesis.getVoices();
    const fVoices = voices.filter((voice) => voice.lang.includes("th"));
    if (fVoices.length > 0) {
      subscriber.next(fVoices[0]);
      subscriber.complete();
    }
  });
});

combineLatest([onContextSpeech$, thaiVoiceActor$.pipe(toBeReady())]).subscribe(
  ([content, voiceActor]) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(content);
    // utterance.lang = "th-TH";
    utterance.voice = voiceActor;
    utterance.volume = 1;
    utterance.pitch = 1;
    utterance.rate = 1.2;
    speechSynthesis.speak(utterance);
  }
);

export function speakWithSpeechSynthesis(content: string) {
  onContextSpeech$.next(content);
}

function toBeReady(): MonoTypeOperatorFunction<SpeechSynthesisVoice> {
  return (thaiSpeech$: Observable<SpeechSynthesisVoice>) =>
    new Observable<SpeechSynthesisVoice>((subscriber) => {
      const interactOnWeb$ = fromEvent(document, "click");
      return combineLatest([thaiSpeech$, interactOnWeb$]).subscribe(
        ([speechActor]) => {
          subscriber.next(speechActor);
          subscriber.complete();
        }
      );
    });
}
