import { ASSESSMENT_STEPS } from "../data/opqrstaa";
import type { AssessmentAnswers, PatientMeta, PhotoAnswer } from "../types/assessment";
import { SpeakButton } from "./SpeakButton";
import "./SummaryScreen.css";

interface SummaryScreenProps {
  meta: PatientMeta;
  answers: AssessmentAnswers;
  photos: PhotoAnswer[];
  onEdit: (stepIndex: number) => void;
  onRestart: () => void;
}

function formatAnswer(value: AssessmentAnswers[string], step: (typeof ASSESSMENT_STEPS)[number]): string {
  if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    return "Not answered";
  }
  if (step.stepId === "severity" && typeof value === "number") {
    return `${value} / 10`;
  }

  const labelFor = (raw: string) =>
    step.options?.find((opt) => opt.value === raw)?.label ?? raw;

  if (Array.isArray(value)) {
    return value.map((v) => labelFor(String(v))).join(", ");
  }
  if (typeof value === "string" && step.options) {
    return labelFor(value);
  }
  return String(value);
}

export function SummaryScreen({ meta, answers, photos, onEdit, onRestart }: SummaryScreenProps) {
  const summaryText = ASSESSMENT_STEPS.map(
    (step) => `${step.word}: ${formatAnswer(answers[step.stepId], step)}`
  ).join(". ");

  const handlePrint = () => window.print();

  return (
    <div className="summary-screen">
      <p className="summary-screen__eyebrow">Summary</p>
      <div className="summary-screen__heading-row">
        <h1>Assessment complete</h1>
        <SpeakButton text={summaryText} lang={meta.language} />
      </div>
      <p className="summary-screen__meta">
        {meta.patientLabel || "Unlabeled patient"} · assessed by{" "}
        {meta.assessorName || "unspecified"}
      </p>

      <dl className="summary-screen__list">
        {ASSESSMENT_STEPS.map((step, index) => (
          <div className="summary-row" key={step.stepId}>
            <dt>
              <span className="summary-row__letter">{step.letter}</span>
              {step.word}
            </dt>
            <dd>
              {formatAnswer(answers[step.stepId], step)}
              <button
                type="button"
                className="summary-row__edit"
                onClick={() => onEdit(index)}
              >
                Edit
              </button>
            </dd>
          </div>
        ))}
      </dl>

      {photos.length > 0 && (
        <div className="summary-screen__photos">
          <h3>Photos of the area</h3>
          <ul>
            {photos.map((photo) => (
              <li key={photo.id}>
                <img src={photo.dataUrl} alt={`Uploaded: ${photo.name}`} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="summary-screen__actions">
        <button type="button" className="summary-screen__print" onClick={handlePrint}>
          Print / save as PDF
        </button>
        <button type="button" className="summary-screen__restart" onClick={onRestart}>
          Start a new assessment
        </button>
      </div>
    </div>
  );
}
