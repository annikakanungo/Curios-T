export interface OntarioUnit {
  id: string;
  title: string;
  topics: string[];
}

export type CurriculumSystem = "Ontario" | "IB" | "AP";

export interface OntarioCourse {
  id: string;
  code: string;
  name: string;
  grade: number;
  subject: string;
  system?: CurriculumSystem;
  units: OntarioUnit[];
}

export const ontarioCourses: OntarioCourse[] = [
  {
    id: "mpm1d",
    code: "MPM1D",
    name: "Principles of Mathematics",
    grade: 9,
    subject: "Mathematics",
    units: [
      {
        id: "mpm1d-u1",
        title: "Number Sense and Algebra",
        topics: ["exponents", "order of operations", "simplifying polynomials", "solving equations"],
      },
      {
        id: "mpm1d-u2",
        title: "Linear Relations",
        topics: ["direct variation", "rate of change", "first differences", "linear patterns"],
      },
      {
        id: "mpm1d-u3",
        title: "Linear Equations",
        topics: ["slope", "y-intercept", "slope-intercept form", "graphing lines"],
      },
      {
        id: "mpm1d-u4",
        title: "Measurement and Geometry",
        topics: ["Pythagorean theorem", "area", "volume", "optimization"],
      },
    ],
  },
  {
    id: "snc1d",
    code: "SNC1D",
    name: "Science",
    grade: 9,
    subject: "Science",
    units: [
      {
        id: "snc1d-u1",
        title: "Biology: Sustainable Ecosystems",
        topics: ["food webs", "biotic and abiotic factors", "ecological succession", "human impact"],
      },
      {
        id: "snc1d-u2",
        title: "Chemistry: Atoms, Elements, and Compounds",
        topics: ["periodic table", "elements", "compounds", "chemical formulas"],
      },
      {
        id: "snc1d-u3",
        title: "Physics: The Characteristics of Electricity",
        topics: ["static electricity", "current electricity", "circuits", "Ohm's law"],
      },
      {
        id: "snc1d-u4",
        title: "Earth and Space Science: The Study of the Universe",
        topics: ["solar system", "stars", "galaxies", "space exploration"],
      },
    ],
  },
  {
    id: "eng1d",
    code: "ENG1D",
    name: "English",
    grade: 9,
    subject: "Language",
    units: [
      {
        id: "eng1d-u1",
        title: "Reading and Literature Studies",
        topics: ["literary devices", "theme", "character", "point of view"],
      },
      {
        id: "eng1d-u2",
        title: "Writing",
        topics: ["paragraph structure", "essay writing", "thesis statements", "revision"],
      },
      {
        id: "eng1d-u3",
        title: "Oral Communication",
        topics: ["active listening", "presentation skills", "discussion techniques"],
      },
      {
        id: "eng1d-u4",
        title: "Media Studies",
        topics: ["media literacy", "advertising techniques", "audience and purpose"],
      },
    ],
  },
  {
    id: "mpm2d",
    code: "MPM2D",
    name: "Principles of Mathematics",
    grade: 10,
    subject: "Mathematics",
    units: [
      {
        id: "mpm2d-u1",
        title: "Linear Systems",
        topics: ["solving linear systems", "substitution", "elimination", "applications"],
      },
      {
        id: "mpm2d-u2",
        title: "Analytic Geometry",
        topics: ["midpoint", "distance", "slope", "equations of lines"],
      },
      {
        id: "mpm2d-u3",
        title: "Quadratic Relations",
        topics: ["parabolas", "vertex form", "factored form", "standard form"],
      },
      {
        id: "mpm2d-u4",
        title: "Quadratic Expressions and Equations",
        topics: ["factoring", "completing the square", "quadratic formula", "applications"],
      },
    ],
  },
  {
    id: "snc2d",
    code: "SNC2D",
    name: "Science",
    grade: 10,
    subject: "Science",
    units: [
      {
        id: "snc2d-u1",
        title: "Biology: Tissues, Organs, and Systems",
        topics: ["cell specialization", "tissues", "organs", "organ systems"],
      },
      {
        id: "snc2d-u2",
        title: "Chemistry: Chemical Reactions",
        topics: ["ionic and molecular compounds", "chemical reactions", "conservation of mass", "acids and bases"],
      },
      {
        id: "snc2d-u3",
        title: "Physics: Light and Geometric Optics",
        topics: ["reflection", "refraction", "lenses", "ray diagrams"],
      },
      {
        id: "snc2d-u4",
        title: "Earth and Space Science: Climate Change",
        topics: ["climate systems", "greenhouse effect", "human activities", "sustainability"],
      },
    ],
  },
  {
    id: "chc2d",
    code: "CHC2D",
    name: "Canadian History",
    grade: 10,
    subject: "History",
    units: [
      {
        id: "chc2d-u1",
        title: "1914–1929: Canada in the World",
        topics: ["World War I", "Roaring Twenties", "women's suffrage", "industrialization"],
      },
      {
        id: "chc2d-u2",
        title: "1929–1945: Canada and the Great Depression and WWII",
        topics: ["Great Depression", "New Deal", "World War II", "Holocaust"],
      },
      {
        id: "chc2d-u3",
        title: "1945–1982: Canada in the Cold War Era",
        topics: ["Cold War", "Korean War", "Vietnam War", "Quiet Revolution"],
      },
      {
        id: "chc2d-u4",
        title: "1982–Present: Canada in a Changing World",
        topics: ["Constitution Act", "globalization", "Indigenous rights", "modern Canada"],
      },
    ],
  },
];

export const ibCourses: OntarioCourse[] = [
  {
    id: "ib-math-aa-sl",
    code: "IB MATH AA SL",
    name: "Mathematics: Analysis and Approaches SL",
    grade: 11,
    subject: "Mathematics",
    system: "IB",
    units: [
      { id: "ib-aa-u1", title: "Number and Algebra", topics: ["sequences and series", "exponents and logarithms", "binomial theorem", "proof"] },
      { id: "ib-aa-u2", title: "Functions", topics: ["function notation", "transformations", "quadratic functions", "rational functions"] },
      { id: "ib-aa-u3", title: "Geometry and Trigonometry", topics: ["trigonometric ratios", "unit circle", "trig identities", "trig equations"] },
      { id: "ib-aa-u4", title: "Statistics and Probability", topics: ["descriptive statistics", "correlation", "probability rules", "distributions"] },
      { id: "ib-aa-u5", title: "Calculus", topics: ["limits", "differentiation", "optimization", "integration"] },
    ],
  },
  {
    id: "ib-math-ai-hl",
    code: "IB MATH AI HL",
    name: "Mathematics: Applications and Interpretation HL",
    grade: 12,
    subject: "Mathematics",
    system: "IB",
    units: [
      { id: "ib-ai-u1", title: "Number and Algebra", topics: ["standard form", "matrices", "complex numbers", "systems of equations"] },
      { id: "ib-ai-u2", title: "Functions and Modelling", topics: ["linear models", "exponential models", "regression", "piecewise functions"] },
      { id: "ib-ai-u3", title: "Statistics and Probability", topics: ["sampling", "hypothesis testing", "chi-squared", "Markov chains"] },
      { id: "ib-ai-u4", title: "Calculus", topics: ["derivatives", "kinematics", "differential equations", "numerical integration"] },
    ],
  },
  {
    id: "ib-biology-hl",
    code: "IB BIO HL",
    name: "Biology HL",
    grade: 12,
    subject: "Science",
    system: "IB",
    units: [
      { id: "ib-bio-u1", title: "Unity and Diversity", topics: ["water", "nucleic acids", "origins of cells", "classification"] },
      { id: "ib-bio-u2", title: "Form and Function", topics: ["cell structure", "membrane transport", "gas exchange", "enzymes"] },
      { id: "ib-bio-u3", title: "Interaction and Interdependence", topics: ["neural signalling", "hormones", "ecological niches", "population dynamics"] },
      { id: "ib-bio-u4", title: "Continuity and Change", topics: ["DNA replication", "cell cycle", "natural selection", "climate change"] },
    ],
  },
  {
    id: "ib-chemistry-sl",
    code: "IB CHEM SL",
    name: "Chemistry SL",
    grade: 11,
    subject: "Science",
    system: "IB",
    units: [
      { id: "ib-chem-u1", title: "Models of the Particulate Nature of Matter", topics: ["atomic structure", "periodicity", "bonding", "the mole"] },
      { id: "ib-chem-u2", title: "What Drives Chemical Reactions", topics: ["enthalpy", "entropy", "spontaneity", "energy cycles"] },
      { id: "ib-chem-u3", title: "How Much and How Fast", topics: ["stoichiometry", "reaction rates", "equilibrium", "acids and bases"] },
    ],
  },
  {
    id: "ib-history-hl",
    code: "IB HIST HL",
    name: "History HL",
    grade: 12,
    subject: "History",
    system: "IB",
    units: [
      { id: "ib-hist-u1", title: "Authoritarian States", topics: ["rise to power", "consolidation", "Hitler", "Mao", "Castro"] },
      { id: "ib-hist-u2", title: "The Cold War", topics: ["origins", "Cuban Missile Crisis", "détente", "end of the Cold War"] },
      { id: "ib-hist-u3", title: "Causes and Effects of Wars", topics: ["World War I", "World War II", "Spanish Civil War", "peace treaties"] },
    ],
  },
  {
    id: "ib-english-a-sl",
    code: "IB ENG A SL",
    name: "English A: Language and Literature SL",
    grade: 11,
    subject: "Language",
    system: "IB",
    units: [
      { id: "ib-eng-u1", title: "Readers, Writers and Texts", topics: ["literary devices", "close reading", "authorial choice", "text types"] },
      { id: "ib-eng-u2", title: "Time and Space", topics: ["historical context", "cultural context", "global issues", "perspective"] },
      { id: "ib-eng-u3", title: "Intertextuality", topics: ["comparative study", "genre conventions", "allusion", "adaptation"] },
    ],
  },
];

export const apCourses: OntarioCourse[] = [
  {
    id: "ap-calc-ab",
    code: "AP CALC AB",
    name: "AP Calculus AB",
    grade: 12,
    subject: "Mathematics",
    system: "AP",
    units: [
      { id: "ap-calcab-u1", title: "Limits and Continuity", topics: ["limits", "one-sided limits", "continuity", "asymptotes"] },
      { id: "ap-calcab-u2", title: "Differentiation", topics: ["definition of derivative", "power rule", "product and quotient rules", "chain rule"] },
      { id: "ap-calcab-u3", title: "Applications of Differentiation", topics: ["related rates", "optimization", "mean value theorem", "curve sketching"] },
      { id: "ap-calcab-u4", title: "Integration", topics: ["Riemann sums", "fundamental theorem of calculus", "u-substitution", "area and volume"] },
    ],
  },
  {
    id: "ap-calc-bc",
    code: "AP CALC BC",
    name: "AP Calculus BC",
    grade: 12,
    subject: "Mathematics",
    system: "AP",
    units: [
      { id: "ap-calcbc-u1", title: "Advanced Integration Techniques", topics: ["integration by parts", "partial fractions", "improper integrals"] },
      { id: "ap-calcbc-u2", title: "Parametric, Polar, and Vector Functions", topics: ["parametric derivatives", "polar area", "vector-valued functions"] },
      { id: "ap-calcbc-u3", title: "Infinite Sequences and Series", topics: ["convergence tests", "Taylor series", "Maclaurin series", "radius of convergence"] },
    ],
  },
  {
    id: "ap-biology",
    code: "AP BIO",
    name: "AP Biology",
    grade: 11,
    subject: "Science",
    system: "AP",
    units: [
      { id: "ap-bio-u1", title: "Chemistry of Life", topics: ["water properties", "macromolecules", "enzymes", "pH"] },
      { id: "ap-bio-u2", title: "Cell Structure and Function", topics: ["organelles", "membrane transport", "compartmentalization"] },
      { id: "ap-bio-u3", title: "Cellular Energetics", topics: ["photosynthesis", "cellular respiration", "enzyme regulation"] },
      { id: "ap-bio-u4", title: "Heredity and Gene Expression", topics: ["meiosis", "Mendelian genetics", "transcription", "translation"] },
    ],
  },
  {
    id: "ap-chemistry",
    code: "AP CHEM",
    name: "AP Chemistry",
    grade: 12,
    subject: "Science",
    system: "AP",
    units: [
      { id: "ap-chem-u1", title: "Atomic Structure and Properties", topics: ["moles", "electron configuration", "periodic trends", "photoelectron spectroscopy"] },
      { id: "ap-chem-u2", title: "Bonding and Intermolecular Forces", topics: ["Lewis structures", "VSEPR", "hybridization", "intermolecular forces"] },
      { id: "ap-chem-u3", title: "Kinetics and Equilibrium", topics: ["rate laws", "reaction mechanisms", "Le Chatelier's principle", "K expressions"] },
      { id: "ap-chem-u4", title: "Thermodynamics and Electrochemistry", topics: ["enthalpy", "entropy", "Gibbs free energy", "galvanic cells"] },
    ],
  },
  {
    id: "ap-world-history",
    code: "AP WHAP",
    name: "AP World History: Modern",
    grade: 11,
    subject: "History",
    system: "AP",
    units: [
      { id: "ap-whap-u1", title: "The Global Tapestry (1200–1450)", topics: ["Song China", "Dar al-Islam", "state building", "trade networks"] },
      { id: "ap-whap-u2", title: "Land-Based Empires (1450–1750)", topics: ["Ottomans", "Mughals", "Safavids", "legitimizing power"] },
      { id: "ap-whap-u3", title: "Revolutions (1750–1900)", topics: ["Industrial Revolution", "nationalism", "imperialism", "Atlantic revolutions"] },
      { id: "ap-whap-u4", title: "Global Conflict and Decolonization (1900–present)", topics: ["World Wars", "Cold War", "decolonization", "globalization"] },
    ],
  },
  {
    id: "ap-english-lang",
    code: "AP ENG LANG",
    name: "AP English Language and Composition",
    grade: 11,
    subject: "Language",
    system: "AP",
    units: [
      { id: "ap-lang-u1", title: "Rhetorical Situation", topics: ["audience", "purpose", "exigence", "speaker credibility"] },
      { id: "ap-lang-u2", title: "Claims and Evidence", topics: ["thesis statements", "evidence selection", "commentary", "line of reasoning"] },
      { id: "ap-lang-u3", title: "Style and Argument", topics: ["diction", "syntax", "rhetorical appeals", "counterargument"] },
    ],
  },
];

export const curriculumSystems: CurriculumSystem[] = ["Ontario", "IB", "AP"];

export const allCourses: OntarioCourse[] = [
  ...ontarioCourses.map((c) => ({ ...c, system: c.system ?? ("Ontario" as const) })),
  ...ibCourses,
  ...apCourses,
];

export function getCoursesBySystem(system: CurriculumSystem): OntarioCourse[] {
  return allCourses.filter((c) => (c.system ?? "Ontario") === system);
}

export function getCourseById(id: string): OntarioCourse | undefined {
  return allCourses.find((c) => c.id === id);
}

export function getUnitById(courseId: string, unitId: string): OntarioUnit | undefined {
  const course = getCourseById(courseId);
  return course?.units.find((u) => u.id === unitId);
}
