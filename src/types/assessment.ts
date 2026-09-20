// Shared types for the OPQRST-AA patient assessment flow.

export type QuestionKind =
  | "choice-single"
  | "choice-multi"
  | "scale"
  | "text"
  | "textarea"
  | "photo";

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface AssessmentStep {
  /** The mnemonic letter this step belongs to, e.g. "O", "P", "A" */
  letter: string;
  /** Distinguishes the two "A" steps (Associated vs Aggravating/Alleviating) */
  stepId: string;
  /** The full word(s) the letter stands for */
  word: string;
  /** The question shown to the user */
  prompt: string;
  /** Supporting helper text shown under the prompt */
  helper?: string;
  kind: QuestionKind;
  options?: ChoiceOption[];
  placeholder?: string;
}

export interface PhotoAnswer {
  id: string;
  name: string;
  dataUrl: string;
}

export type AnswerValue = string | string[] | number | PhotoAnswer[] | undefined;

export interface AssessmentAnswers {
  [stepId: string]: AnswerValue;
}

export interface PatientMeta {
  patientLabel: string;
  assessorName: string;
  language: "en" | "fr" | "rw";
}
