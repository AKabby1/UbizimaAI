import { useSpeech } from "../hooks/useSpeech";
import "./SpeakButton.css";

interface SpeakButtonProps {
  text: string;
  lang: "en" | "fr" | "rw";
}

export function SpeakButton({ text, lang }: SpeakButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  if (!isSupported) return null;

  return (
    <button
      type="button"
      className="speak-button"
      aria-pressed={isSpeaking}
      onClick={() => (isSpeaking ? stop() : speak(text, lang))}
    >
      <SpeakerIcon active={isSpeaking} />
      <span>{isSpeaking ? "Stop" : "Listen"}</span>
    </button>
  );
}

function SpeakerIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 9v6h4l5 4V5L8 9H4Z"
        fill="currentColor"
      />
      {active ? (
        <path
          d="M17.5 8.5a5 5 0 0 1 0 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M16.5 9a3.5 3.5 0 0 1 0 6M19 6.8a7 7 0 0 1 0 10.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
