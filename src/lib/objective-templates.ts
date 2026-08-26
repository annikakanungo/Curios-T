export interface ObjectiveTemplate {
  id: string;
  label: string;
  subject: string;
  text: string;
}

/** Ready-made learning outcomes students can pick instead of typing their own. */
export const OBJECTIVE_TEMPLATES: ObjectiveTemplate[] = [
  {
    id: "algebra-basics",
    label: "Algebra basics",
    subject: "Math",
    text: "Simplify expressions, solve one- and two-step linear equations, and translate word problems into algebraic form.",
  },
  {
    id: "quadratics",
    label: "Quadratics",
    subject: "Math",
    text: "Factor quadratic expressions, solve quadratic equations, and interpret the vertex, zeros, and axis of symmetry.",
  },
  {
    id: "cell-structure",
    label: "Cell structure",
    subject: "Biology",
    text: "Identify organelles and their functions, compare plant and animal cells, and relate structure to cellular processes.",
  },
  {
    id: "chemical-reactions",
    label: "Chemical reactions",
    subject: "Chemistry",
    text: "Classify reaction types, balance chemical equations, and predict products using reactivity patterns.",
  },
  {
    id: "forces-motion",
    label: "Forces and motion",
    subject: "Physics",
    text: "Apply Newton's laws, interpret motion graphs, and solve problems involving velocity, acceleration, and net force.",
  },
  {
    id: "historical-thinking",
    label: "Historical thinking",
    subject: "History",
    text: "Evaluate primary and secondary sources, establish cause and consequence, and assess historical significance and continuity.",
  },
  {
    id: "literary-analysis",
    label: "Literary analysis",
    subject: "English",
    text: "Analyse theme, characterisation, and literary devices, and support interpretations with textual evidence.",
  },
  {
    id: "data-statistics",
    label: "Data and statistics",
    subject: "Math",
    text: "Summarise data with measures of centre and spread, interpret graphs, and reason about sampling and bias.",
  },
];
