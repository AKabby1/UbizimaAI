import type { PatientMeta } from "../types/assessment";
import "./IntroScreen.css";

interface IntroScreenProps {
  meta: PatientMeta;
  onChange: (meta: PatientMeta) => void;
  onStart: () => void;
}

const LANGUAGES: { value: PatientMeta["language"]; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "rw", label: "Ikinyarwanda" },
];

export function IntroScreen({ meta, onChange, onStart }: IntroScreenProps) {
  return (
    <div className="intro-screen">
      <p className="intro-screen__eyebrow">Patient assessment</p>
      <h1>
        Onset, Provocation, Quality, Region,
        <br />
        Severity, Time, and what's around it.
      </h1>
      <p className="intro-screen__lede">
        A guided OPQRST-AA interview. Answer one question at a time, listen to any
        question read aloud, and review everything together at the end.
      </p>

      <div className="intro-screen__form">
        <label className="intro-field">
          <span>Patient identifier</span>
          <input
            type="text"
            placeholder="e.g. initials or record number"
            value={meta.patientLabel}
            onChange={(e) => onChange({ ...meta, patientLabel: e.target.value })}
          />
        </label>

        <label className="intro-field">
          <span>Your name (assessor)</span>
          <input
            type="text"
            placeholder="e.g. your name"
            value={meta.assessorName}
            onChange={(e) => onChange({ ...meta, assessorName: e.target.value })}
          />
        </label>

        <div className="intro-field">
          <span>Language</span>
          <div className="intro-screen__lang-row">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                type="button"
                className={`choice-pill ${meta.language === lang.value ? "choice-pill--selected" : ""}`}
                onClick={() => onChange({ ...meta, language: lang.value })}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button type="button" className="intro-screen__start" onClick={onStart}>
        Begin assessment
      </button>
    </div>
  );
}
