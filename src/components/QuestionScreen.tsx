import type { AssessmentStep, AnswerValue, PhotoAnswer } from "../types/assessment";
import { SpeakButton } from "./SpeakButton";
import { PhotoUpload } from "./PhotoUpload";
import "./QuestionScreen.css";

interface QuestionScreenProps {
  step: AssessmentStep;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  language: "en" | "fr" | "rw";
  photos: PhotoAnswer[];
  onPhotosChange: (photos: PhotoAnswer[]) => void;
}

export function QuestionScreen({
  step,
  value,
  onChange,
  language,
  photos,
  onPhotosChange,
}: QuestionScreenProps) {
  return (
    <div className="question-screen">
      <p className="question-screen__eyebrow">{step.word}</p>
      <div className="question-screen__prompt-row">
        <h2>{step.prompt}</h2>
        <SpeakButton text={`${step.prompt}. ${step.helper ?? ""}`} lang={language} />
      </div>
      {step.helper && <p className="question-screen__helper">{step.helper}</p>}

      <div className="question-screen__input">
        {step.kind === "choice-single" && (
          <div className="choice-list" role="radiogroup" aria-label={step.prompt}>
            {step.options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={value === opt.value}
                className={`choice-pill ${value === opt.value ? "choice-pill--selected" : ""}`}
                onClick={() => onChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step.kind === "choice-multi" && (
          <div className="choice-list">
            {step.options?.map((opt) => {
              const current: string[] = Array.isArray(value)
                ? (value.filter((v): v is string => typeof v === "string"))
                : [];
              const selected = current.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selected}
                  className={`choice-pill ${selected ? "choice-pill--selected" : ""}`}
                  onClick={() => {
                    onChange(
                      selected
                        ? current.filter((v) => v !== opt.value)
                        : [...current, opt.value]
                    );
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {step.kind === "textarea" && (
          <textarea
            className="text-input"
            rows={5}
            placeholder={step.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {step.kind === "text" && (
          <input
            className="text-input"
            type="text"
            placeholder={step.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {step.kind === "scale" && (
          <SeverityScale value={typeof value === "number" ? value : undefined} onChange={onChange} />
        )}

        {step.kind === "photo" && (
          <>
            <textarea
              className="text-input"
              rows={3}
              placeholder="Describe the location in words too, if you can…"
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
              style={{ marginBottom: 14 }}
            />
            <PhotoUpload photos={photos} onChange={onPhotosChange} />
          </>
        )}
      </div>
    </div>
  );
}

function SeverityScale({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const numbers = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="severity-scale">
      <div className="severity-scale__track">
        {numbers.map((n) => (
          <button
            key={n}
            type="button"
            className={`severity-scale__dot ${value === n ? "severity-scale__dot--selected" : ""}`}
            style={{ ["--dot-intensity" as string]: n / 10 }}
            aria-pressed={value === n}
            aria-label={`Severity ${n} out of 10`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="severity-scale__labels">
        <span>No discomfort</span>
        <span>Worst imaginable</span>
      </div>
    </div>
  );
}
