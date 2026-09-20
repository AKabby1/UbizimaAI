import { useState } from "react";
import { ASSESSMENT_STEPS } from "./data/opqrstaa";
import type { AssessmentAnswers, PatientMeta, PhotoAnswer } from "./types/assessment";
import { useLocalDraft } from "./hooks/useLocalDraft";
import { ProgressTrail } from "./components/ProgressTrail";
import { IntroScreen } from "./components/IntroScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { SummaryScreen } from "./components/SummaryScreen";
import "./App.css";

type Phase = "intro" | "question" | "summary";

const DEFAULT_META: PatientMeta = { patientLabel: "", assessorName: "", language: "en" };

function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [meta, setMeta] = useLocalDraft<PatientMeta>("opqrstaa-meta", DEFAULT_META);
  const [answers, setAnswers] = useLocalDraft<AssessmentAnswers>("opqrstaa-answers", {});
  const [photos, setPhotos] = useLocalDraft<PhotoAnswer[]>("opqrstaa-photos", []);
  const [stepIndex, setStepIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);

  const currentStep = ASSESSMENT_STEPS[stepIndex];
  const isLastStep = stepIndex === ASSESSMENT_STEPS.length - 1;

  const goNext = () => {
    if (isLastStep) {
      setPhase("summary");
      return;
    }
    const next = stepIndex + 1;
    setStepIndex(next);
    setFurthestIndex((f) => Math.max(f, next));
  };

  const goBack = () => {
    if (stepIndex === 0) {
      setPhase("intro");
      return;
    }
    setStepIndex((i) => i - 1);
  };

  const jumpTo = (index: number) => {
    setStepIndex(index);
    setPhase("question");
  };

  const restart = () => {
    setMeta(DEFAULT_META);
    setAnswers({});
    setPhotos([]);
    setStepIndex(0);
    setFurthestIndex(0);
    setPhase("intro");
  };

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <span className="app-shell__brand">OPQRST-AA</span>
        {phase === "question" && (
          <ProgressTrail
            currentIndex={stepIndex}
            furthestIndex={furthestIndex}
            onJump={jumpTo}
          />
        )}
      </header>

      <main className="app-shell__main">
        {phase === "intro" && (
          <IntroScreen
            meta={meta}
            onChange={setMeta}
            onStart={() => setPhase("question")}
          />
        )}

        {phase === "question" && (
          <QuestionScreen
            step={currentStep}
            value={answers[currentStep.stepId]}
            onChange={(value) =>
              setAnswers((prev) => ({ ...prev, [currentStep.stepId]: value }))
            }
            photos={photos}
            onPhotosChange={setPhotos}
            language={meta.language}
          />
        )}

        {phase === "summary" && (
          <SummaryScreen
            meta={meta}
            answers={answers}
            photos={photos}
            onEdit={jumpTo}
            onRestart={restart}
          />
        )}
      </main>

      {phase === "question" && (
        <footer className="app-shell__footer">
          <button type="button" className="app-shell__nav-btn app-shell__nav-btn--ghost" onClick={goBack}>
            Back
          </button>
          <button
            type="button"
            className="app-shell__nav-btn app-shell__nav-btn--solid"
            onClick={goNext}
          >
            {isLastStep ? "Review summary" : "Next"}
          </button>
        </footer>
      )}
    </div>
  );
}

export default App;
