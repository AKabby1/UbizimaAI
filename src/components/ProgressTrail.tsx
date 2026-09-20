import { ASSESSMENT_STEPS } from "../data/opqrstaa";
import "./ProgressTrail.css";

interface ProgressTrailProps {
  currentIndex: number;
  furthestIndex: number;
  onJump: (index: number) => void;
}

export function ProgressTrail({ currentIndex, furthestIndex, onJump }: ProgressTrailProps) {
  return (
    <nav className="progress-trail" aria-label="Assessment progress">
      {ASSESSMENT_STEPS.map((step, index) => {
        const state =
          index === currentIndex ? "current" : index < furthestIndex ? "done" : "upcoming";
        const reachable = index <= furthestIndex;

        return (
          <button
            key={step.stepId}
            type="button"
            className={`trail-letter trail-letter--${state}`}
            disabled={!reachable}
            aria-current={index === currentIndex ? "step" : undefined}
            title={step.word}
            onClick={() => reachable && onJump(index)}
          >
            {step.letter}
          </button>
        );
      })}
    </nav>
  );
}
