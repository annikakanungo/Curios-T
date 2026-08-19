export interface OntarioUnit {
  id: string;
  title: string;
  topics: string[];
}

export interface OntarioCourse {
  id: string;
  code: string;
  name: string;
  grade: number;
  subject: string;
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

export function getCourseById(id: string): OntarioCourse | undefined {
  return ontarioCourses.find((c) => c.id === id);
}

export function getUnitById(courseId: string, unitId: string): OntarioUnit | undefined {
  const course = getCourseById(courseId);
  return course?.units.find((u) => u.id === unitId);
}
