export interface ModuleDef {
  id: string;
  label: string;
  hue: number;
  description: string;
  category: string;
  isBreathing?: boolean;
}

export const MODULE_LIST: ModuleDef[] = [
  {
    id: "number",
    label: "Number Sense",
    hue: 200,
    description: "Recognise and understand numbers",
    category: "Foundation",
  },
  {
    id: "arith",
    label: "Arithmetic",
    hue: 150,
    description: "Add, subtract, multiply and divide",
    category: "Foundation",
  },
  {
    id: "money",
    label: "Money & Real Life",
    hue: 75,
    description: "Coins, notes and everyday costs",
    category: "Everyday Maths",
  },
  {
    id: "time",
    label: "Time & Scheduling",
    hue: 45,
    description: "Clocks, calendars and planning",
    category: "Everyday Maths",
  },
  {
    id: "sequence",
    label: "Counting & Sequences",
    hue: 260,
    description: "Patterns, counting and ordering",
    category: "Foundation",
  },
  {
    id: "calm",
    label: "Breathe & Grow",
    hue: 350,
    description: "Calm your mind before practising",
    category: "Wellbeing",
    isBreathing: true,
  },
  {
    id: "numberline",
    label: "Number Line",
    hue: 180,
    description: "Place numbers on a line",
    category: "Number Concepts",
  },
  {
    id: "estimation",
    label: "Estimation",
    hue: 30,
    description: "Estimate quantities and sizes",
    category: "Number Concepts",
  },
  {
    id: "stepseq",
    label: "Step-by-Step Sequencing",
    hue: 290,
    description: "Order the steps of a problem",
    category: "Reasoning",
  },
  {
    id: "fractions",
    label: "Fractions",
    hue: 120,
    description: "Halves, quarters and more",
    category: "Number Concepts",
  },
  {
    id: "measurement",
    label: "Measurement",
    hue: 20,
    description: "Length, weight and volume",
    category: "Everyday Maths",
  },
];

export const MODULE_MAP: Record<string, ModuleDef> = Object.fromEntries(
  MODULE_LIST.map((m) => [m.id, m]),
);

export function moduleColor(id: string, l = 0.65, c = 0.12): string {
  const m = MODULE_MAP[id];
  const hue = m?.hue ?? 220;
  return `oklch(${l} ${c} ${hue})`;
}

export function moduleAccent(id: string): string {
  return moduleColor(id, 0.55, 0.15);
}

export function moduleBg(id: string): string {
  return moduleColor(id, 0.94, 0.04);
}

export function moduleBorder(id: string): string {
  return moduleColor(id, 0.8, 0.08);
}
