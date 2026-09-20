import { useCallback, useEffect, useState } from "react";

// Wraps the browser's built-in speechSynthesis API. This runs entirely on
// the user's device — no backend, no API key, no cost. Voice availability
// (especially for French / Kinyarwanda) depends on what the operating
// system ships, so we degrade gracefully when a language isn't available.
export function useSpeech() {
  const [isSupported] = useState(() => "speechSynthesis" in window);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, langCode: "en" | "fr" | "rw") => {
      if (!isSupported) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      // Kinyarwanda has no dedicated speech-synthesis voice on most
      // systems yet, so we fall back to a neutral default and let the
      // browser do its best rather than staying silent.
      const bcp47 = { en: "en-US", fr: "fr-FR", rw: "rw-RW" }[langCode];
      const match = voices.find((v) => v.lang.startsWith(langCode));
      if (match) utterance.voice = match;
      utterance.lang = bcp47;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, voices]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
