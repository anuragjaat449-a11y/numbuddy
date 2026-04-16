import type { CatId, Difficulty } from "../App";

export type QuestionData =
  | NumberQuestion
  | MagnitudeQuestion
  | GroupingQuestion
  | ArithQuestion
  | ArithScaffoldQuestion
  | ArithMultiplyQuestion
  | MoneyQuestion
  | MoneyBillsQuestion
  | MoneyChangeQuestion
  | MoneyReceiptQuestion
  | TimeQuestion
  | TimeCalendarQuestion
  | TimeElapsedQuestion
  | SequenceQuestion
  | PlaceValueQuestion
  | NumberLineQuestion
  | NumberLineHalfwayQuestion
  | NumberLineCloserQuestion
  | NumberLineHopsQuestion
  | OddEvenQuestion
  | EstimationQuestion
  | StepSeqQuestion
  | FractionsQuestion
  | MeasurementQuestion
  | NumberSenseTextQuestion
  | TimeScheduleQuestion;

export type AnyNumberLineQuestion =
  | NumberLineQuestion
  | NumberLineHalfwayQuestion
  | NumberLineCloserQuestion
  | NumberLineHopsQuestion;

export interface NumberQuestion {
  type: "number";
  value: number;
  dots: [number, number][];
  choices: number[];
  flashDuration: number;
}

export interface MagnitudeQuestion {
  type: "magnitude";
  a: number;
  b: number;
  answer: "a" | "b";
}

export interface GroupingQuestion {
  type: "grouping";
  total: number;
  groupA: number;
  groupB: number;
  choices: number[];
}

export interface ArithQuestion {
  type: "arith";
  op: "+" | "-";
  a: number;
  b: number;
  answer: number;
  choices: number[];
}

export interface ArithScaffoldQuestion {
  type: "arith_scaffold";
  op: "+" | "-";
  a: number;
  b: number;
  answer: number;
  steps: string[];
  choices: number[];
}

export interface ArithMultiplyQuestion {
  type: "arith_multiply";
  a: number;
  b: number;
  answer: number;
  choices: number[];
}

export interface MoneyQuestion {
  type: "money";
  coins: { value: number; label: string; color: string }[];
  total: number;
  choices: number[];
}

export interface MoneyBillsQuestion {
  type: "money_bills";
  bills: { value: number; label: string; color: string }[];
  total: number;
  choices: number[];
}

export interface MoneyChangeQuestion {
  type: "money_change";
  cost: number;
  paid: number;
  change: number;
  choices: number[];
}

export interface MoneyReceiptQuestion {
  type: "money_receipt";
  items: { name: string; price: number }[];
  total: number;
  choices: number[];
}

export interface TimeQuestion {
  type: "time";
  hour: number;
  minute: number;
  answer: string;
  choices: string[];
}

export interface TimeCalendarQuestion {
  type: "time_calendar";
  monthName: string;
  startDay: number;
  endDay: number;
  answer: number;
  choices: number[];
}

export interface TimeElapsedQuestion {
  type: "time_elapsed";
  startHour: number;
  startMinute: number;
  elapsedMinutes: number;
  answer: string;
  choices: string[];
}

export interface SequenceQuestion {
  type: "sequence";
  sequence: (number | null)[];
  answer: number;
  blankIndex: number;
  choices: number[];
  step: number;
  questionLabel?: string;
  sequenceType?: "linear" | "double" | "alternating";
}

export interface PlaceValueQuestion {
  type: "placevalue";
  number: number;
  ask: "tens" | "ones";
  answer: number;
  choices: number[];
}

export interface NumberLineQuestion {
  type: "numberline";
  markerValue: number;
  rangeMin: number;
  rangeMax: number;
  choices: number[];
}

export interface NumberLineHalfwayQuestion {
  type: "numberline_halfway";
  low: number;
  high: number;
  answer: number;
  rangeMin: number;
  rangeMax: number;
  choices: number[];
}

export interface NumberLineCloserQuestion {
  type: "numberline_closer";
  target: number;
  anchorA: number;
  anchorB: number;
  rangeMin: number;
  rangeMax: number;
  answer: number;
  choices: number[];
}

export interface NumberLineHopsQuestion {
  type: "numberline_hops";
  start: number;
  hops: number;
  hopSize: number;
  answer: number;
  rangeMin: number;
  rangeMax: number;
  choices: number[];
}

export interface OddEvenQuestion {
  type: "odd_even";
  value: number;
  answer: "odd" | "even";
  choices: ("odd" | "even")[];
}

export interface EstimationQuestion {
  type: "estimation";
  variant?: "dots" | "bars" | "jar"; // default "dots" if absent
  // dots variant (existing)
  dotCount?: number;
  dots?: [number, number][];
  // bars variant
  barValues?: number[]; // array of 3 bar heights (0-50)
  askBarIndex?: number; // which bar to ask about (0-2)
  // jar variant
  fillPercent?: number; // 0-100
  // shared
  answerLabel: string;
  choices: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DOT_PATTERNS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [28, 32],
    [72, 68],
  ],
  3: [
    [28, 25],
    [72, 25],
    [50, 72],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [28, 25],
    [72, 25],
    [50, 50],
    [28, 75],
    [72, 75],
  ],
  6: [
    [28, 22],
    [72, 22],
    [28, 50],
    [72, 50],
    [28, 78],
    [72, 78],
  ],
  7: [
    [28, 20],
    [72, 20],
    [50, 36],
    [28, 52],
    [72, 52],
    [28, 78],
    [72, 78],
  ],
  8: [
    [28, 18],
    [72, 18],
    [28, 44],
    [72, 44],
    [28, 70],
    [72, 70],
    [50, 30],
    [50, 56],
  ],
  9: [
    [28, 18],
    [72, 18],
    [28, 44],
    [72, 44],
    [28, 70],
    [72, 70],
    [50, 18],
    [50, 44],
    [50, 70],
  ],
  10: [
    [28, 18],
    [72, 18],
    [28, 44],
    [72, 44],
    [28, 70],
    [72, 70],
    [50, 18],
    [50, 44],
    [50, 70],
    [50, 56],
  ],
  11: [
    [22, 15],
    [50, 15],
    [78, 15],
    [22, 42],
    [50, 42],
    [78, 42],
    [22, 68],
    [50, 68],
    [78, 68],
    [35, 82],
    [65, 82],
  ],
};

function jitter(dots: [number, number][]): [number, number][] {
  return dots.map(([x, y]) => [
    x + (Math.random() - 0.5) * 8,
    y + (Math.random() - 0.5) * 8,
  ]);
}

function makeDistractors(
  answer: number,
  count: number,
  min: number,
  max: number,
): number[] {
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, -4, 4]);
  const distractors: number[] = [];
  for (const off of offsets) {
    const val = answer + off;
    if (
      val >= min &&
      val <= max &&
      !distractors.includes(val) &&
      val !== answer
    ) {
      distractors.push(val);
    }
    if (distractors.length === count) break;
  }
  let filler = min;
  while (distractors.length < count) {
    if (filler !== answer && !distractors.includes(filler))
      distractors.push(filler);
    filler++;
  }
  return distractors;
}

function makeNumberSenseTextQuestion(
  difficulty: Difficulty,
): NumberSenseTextQuestion {
  const r = Math.random();
  const type =
    r < 0.25
      ? "between"
      : r < 0.5
        ? "more_than"
        : r < 0.75
          ? "less_than"
          : "closest_to";
  if (type === "between") {
    const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;
    const lo = randInt(1, max - 2);
    const hi = lo + randInt(2, 5);
    const answer = randInt(lo + 1, hi - 1);
    const rawDistractors = makeDistractors(
      answer,
      6,
      Math.max(1, lo - 2),
      hi + 3,
    );
    const distractors = rawDistractors.filter((n) => n <= lo || n >= hi);
    while (distractors.length < 3) {
      const cand = answer + distractors.length + 1;
      if (cand !== answer && !distractors.includes(cand))
        distractors.push(cand);
    }
    return {
      type: "number_sense_text",
      prompt: `Which number is between ${lo} and ${hi}?`,
      choices: shuffle([answer, ...distractors.slice(0, 3)]),
      answer,
    };
  }
  if (type === "less_than") {
    const base =
      difficulty === "easy"
        ? randInt(3, 8)
        : difficulty === "medium"
          ? randInt(4, 15)
          : randInt(8, 30);
    const less = difficulty === "easy" ? randInt(1, 2) : randInt(1, 4);
    const answerLess = base - less;
    const distractorsLess = makeDistractors(
      answerLess,
      3,
      Math.max(1, answerLess - 5),
      answerLess + 5,
    );
    return {
      type: "number_sense_text",
      prompt: `What is ${less} less than ${base}?`,
      choices: shuffle([answerLess, ...distractorsLess]),
      answer: answerLess,
    };
  }
  if (type === "closest_to") {
    const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;
    const target = randInt(3, max - 3);
    const answerClose = target + (Math.random() < 0.5 ? 1 : -1);
    const d2 = target + (answerClose > target ? -3 : 3);
    const d3 = target + (answerClose > target ? -5 : 5);
    const d4 = target + (answerClose > target ? 4 : -4);
    const choices = shuffle([answerClose, d2, d3, d4].filter((n) => n >= 1));
    while (choices.length < 4) choices.push(choices[choices.length - 1] + 2);
    return {
      type: "number_sense_text",
      prompt: `Which number is closest to ${target}?`,
      choices: choices.slice(0, 4),
      answer: answerClose,
    };
  }
  const base =
    difficulty === "easy"
      ? randInt(1, 5)
      : difficulty === "medium"
        ? randInt(2, 10)
        : randInt(5, 20);
  const more = difficulty === "easy" ? randInt(1, 3) : randInt(1, 5);
  const answerMore = base + more;
  const distractorsMore = makeDistractors(answerMore, 3, 1, answerMore + 10);
  return {
    type: "number_sense_text",
    prompt: `What is ${more} more than ${base}?`,
    choices: shuffle([answerMore, ...distractorsMore]),
    answer: answerMore,
  };
}

const SCHEDULE_SCENARIOS = [
  { activity: "school", prep: "get ready" },
  { activity: "football practice", prep: "get changed" },
  { activity: "your dentist appointment", prep: "get ready" },
  { activity: "the school bus", prep: "get to the stop" },
  { activity: "swimming class", prep: "get ready" },
  { activity: "your piano lesson", prep: "get ready" },
  { activity: "the library visit", prep: "get to the library" },
  { activity: "your doctor's appointment", prep: "get ready" },
  { activity: "after-school club", prep: "get changed" },
  { activity: "your art class", prep: "get your supplies" },
  { activity: "your tutor session", prep: "get your books" },
  { activity: "the cinema", prep: "get ready" },
];

const ACTIVITY_SCENARIOS = [
  { activity: "reading time", verb: "finish" },
  { activity: "your maths lesson", verb: "finish" },
  { activity: "the film", verb: "end" },
  { activity: "your walk", verb: "finish" },
  { activity: "cooking dinner", verb: "finish" },
  { activity: "your science experiment", verb: "finish" },
  { activity: "the baking session", verb: "finish" },
  { activity: "your PE lesson", verb: "finish" },
  { activity: "storytime", verb: "end" },
  { activity: "the assembly", verb: "end" },
  { activity: "the museum tour", verb: "complete" },
  { activity: "your practice run", verb: "complete" },
];

function makeTimeScheduleQuestion(): TimeScheduleQuestion {
  const type = Math.random() < 0.5 ? "wakeup" : "end";
  const prepMins = [10, 15, 20, 30][randInt(0, 3)];
  const padTime = (n: number) => n.toString().padStart(2, "0");

  if (type === "wakeup") {
    const scenario =
      SCHEDULE_SCENARIOS[randInt(0, SCHEDULE_SCENARIOS.length - 1)];
    const startHour = randInt(7, 10);
    const startMinute = [0, 15, 30][randInt(0, 2)];
    const totalMinsBefore = startHour * 60 + startMinute - prepMins;
    const wakeHour = Math.floor(totalMinsBefore / 60);
    const wakeMin = totalMinsBefore % 60;
    if (wakeHour < 6 || wakeMin < 0) {
      return makeTimeScheduleQuestion();
    }
    const answerW = `${wakeHour}:${padTime(wakeMin)}`;
    const allTimesW: string[] = [];
    for (let h = 6; h <= 11; h++) {
      for (const m of [0, 15, 30, 45]) {
        const t = `${h}:${padTime(m)}`;
        if (t !== answerW) allTimesW.push(t);
      }
    }
    const wrongsW = shuffle(allTimesW).slice(0, 3);
    const promptW = `${scenario.activity.charAt(0).toUpperCase() + scenario.activity.slice(1)} starts at ${startHour}:${padTime(startMinute)}. You need ${prepMins} minutes to ${scenario.prep}. What time should you wake up?`;
    return {
      type: "time_schedule",
      prompt: promptW,
      choices: shuffle([answerW, ...wrongsW]),
      answer: answerW,
    };
  }
  const scenario =
    ACTIVITY_SCENARIOS[randInt(0, ACTIVITY_SCENARIOS.length - 1)];
  const startHour = randInt(1, 11);
  const startMinute = [0, 15, 30][randInt(0, 2)];
  const totalMins = startHour * 60 + startMinute + prepMins;
  const endHour = Math.floor(totalMins / 60) % 12 || 12;
  const endMin = totalMins % 60;
  const answerE = `${endHour}:${padTime(endMin)}`;
  const allTimesE: string[] = [];
  for (let h = 1; h <= 12; h++) {
    for (const m of [0, 15, 30, 45]) {
      const t = `${h}:${padTime(m)}`;
      if (t !== answerE) allTimesE.push(t);
    }
  }
  const wrongsE = shuffle(allTimesE).slice(0, 3);
  const promptE = `${scenario.activity.charAt(0).toUpperCase() + scenario.activity.slice(1)} starts at ${startHour}:${padTime(startMinute)} and lasts ${prepMins} minutes. When will it ${scenario.verb}?`;
  return {
    type: "time_schedule",
    prompt: promptE,
    choices: shuffle([answerE, ...wrongsE]),
    answer: answerE,
  };
}

function makeNumberQuestion(difficulty: Difficulty): NumberQuestion {
  const maxVal = difficulty === "easy" ? 5 : difficulty === "medium" ? 7 : 9;
  const flashDuration =
    difficulty === "easy" ? 2000 : difficulty === "medium" ? 1500 : 1000;
  const value = randInt(1, maxVal);
  const dots = jitter(DOT_PATTERNS[value]);
  const pool = Array.from({ length: maxVal }, (_, i) => i + 1).filter(
    (n) => n !== value,
  );
  const distractors = shuffle(pool).slice(0, 3);
  return {
    type: "number",
    value,
    dots,
    choices: shuffle([value, ...distractors]),
    flashDuration,
  };
}

function makeMagnitudeQuestion(difficulty: Difficulty): MagnitudeQuestion {
  const maxVal =
    difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 200;
  const minGap = difficulty === "hard" ? 1 : difficulty === "medium" ? 3 : 2;
  let a: number;
  let b: number;
  do {
    a = randInt(1, maxVal);
    b = randInt(1, maxVal);
  } while (Math.abs(a - b) < minGap || a === b);
  const answer: "a" | "b" = a > b ? "a" : "b";
  return { type: "magnitude", a, b, answer };
}

function makeGroupingQuestion(difficulty: Difficulty): GroupingQuestion {
  const minTotal = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 8;
  const maxTotal =
    difficulty === "easy" ? 8 : difficulty === "medium" ? 15 : 25;
  const total = randInt(minTotal, maxTotal);
  const groupA = randInt(1, total - 1);
  const groupB = total - groupA;
  const distractors = makeDistractors(total, 3, 2, maxTotal + 5);
  return {
    type: "grouping",
    total,
    groupA,
    groupB,
    choices: shuffle([total, ...distractors]),
  };
}

function makeOddEvenQuestion(difficulty: Difficulty): OddEvenQuestion {
  const maxVal =
    difficulty === "easy" ? 20 : difficulty === "medium" ? 50 : 100;
  const value = randInt(1, maxVal);
  const answer: "odd" | "even" = value % 2 === 0 ? "even" : "odd";
  return {
    type: "odd_even",
    value,
    answer,
    choices: ["odd", "even"] as ("odd" | "even")[],
  };
}

function makeArithQuestion(difficulty: Difficulty): ArithQuestion {
  const op = Math.random() < 0.5 ? "+" : "-";
  let a: number;
  let b: number;
  let answer: number;
  if (difficulty === "easy") {
    if (op === "+") {
      a = randInt(1, 5);
      b = randInt(1, 10 - a);
      answer = a + b;
    } else {
      a = randInt(2, 10);
      b = randInt(1, a - 1);
      answer = a - b;
    }
  } else if (difficulty === "hard") {
    if (op === "+") {
      a = randInt(1, 12);
      b = randInt(1, 12);
      answer = a + b;
    } else {
      a = randInt(5, 20);
      b = randInt(1, a - 1);
      answer = a - b;
    }
  } else {
    if (op === "+") {
      a = randInt(1, 8);
      b = randInt(1, 8);
      answer = a + b;
    } else {
      a = randInt(3, 12);
      b = randInt(1, a - 1);
      answer = a - b;
    }
  }
  const distractors = makeDistractors(answer, 3, 0, 25);
  return {
    type: "arith",
    op,
    a,
    b,
    answer,
    choices: shuffle([answer, ...distractors]),
  };
}

function makeArithScaffoldQuestion(): ArithScaffoldQuestion {
  const op = Math.random() < 0.5 ? "+" : "-";
  let a: number;
  let b: number;
  let answer: number;
  let steps: string[];

  if (op === "+") {
    a = randInt(1, 8);
    b = randInt(1, 8);
    answer = a + b;
    if (a + b > 10) {
      const split = 10 - a;
      const remainder = b - split;
      steps = [
        `${a} + ${b}`,
        `= ${a} + ${split} + ${remainder}`,
        `= 10 + ${remainder}`,
        "= ?",
      ];
    } else {
      steps = [`${a} + ${b}`, `= ${answer}`, "= ?"];
    }
  } else {
    a = randInt(4, 15);
    b = randInt(1, a - 1);
    answer = a - b;
    if (a - b < 10 && a >= 10) {
      const toTen = a - 10;
      const remaining = b - toTen;
      if (remaining > 0) {
        steps = [
          `${a} \u2212 ${b}`,
          `= ${a} \u2212 ${toTen} \u2212 ${remaining}`,
          `= 10 \u2212 ${remaining}`,
          "= ?",
        ];
      } else {
        steps = [`${a} \u2212 ${b}`, `= ${answer}`, "= ?"];
      }
    } else {
      steps = [`${a} \u2212 ${b}`, `= ${answer}`, "= ?"];
    }
  }

  const distractors = makeDistractors(answer, 3, 0, 20);
  return {
    type: "arith_scaffold",
    op,
    a,
    b,
    answer,
    steps,
    choices: shuffle([answer, ...distractors]),
  };
}

function makeArithMultiplyQuestion(
  difficulty: Difficulty,
): ArithMultiplyQuestion {
  const tables =
    difficulty === "hard" ? [2, 3, 4, 5, 6, 7, 8, 9] : [2, 3, 4, 5];
  const table = tables[randInt(0, tables.length - 1)];
  const factor = randInt(1, 10);
  const answer = table * factor;
  const distractors = makeDistractors(answer, 3, 0, 90);
  return {
    type: "arith_multiply",
    a: table,
    b: factor,
    answer,
    choices: shuffle([answer, ...distractors]),
  };
}

const COIN_DEFS = [
  { value: 1, label: "1c", color: "#b87333" },
  { value: 5, label: "5c", color: "#9e9e9e" },
  { value: 10, label: "10c", color: "#757575" },
  { value: 25, label: "25c", color: "#bdbdbd" },
];

function makeMoneyQuestion(difficulty: Difficulty): MoneyQuestion {
  const maxTotal = difficulty === "easy" ? 50 : 100;
  let coins: typeof COIN_DEFS = [];
  let total = 0;
  do {
    const count = randInt(2, 5);
    const pool = difficulty === "easy" ? COIN_DEFS.slice(0, 3) : COIN_DEFS;
    coins = Array.from(
      { length: count },
      () => pool[randInt(0, pool.length - 1)],
    );
    total = coins.reduce((s, c) => s + c.value, 0);
  } while (total > maxTotal || total < 2);
  const offsets = shuffle([-10, -5, -1, 1, 5, 10]);
  const distractors: number[] = [];
  for (const off of offsets) {
    const val = total + off;
    if (
      val > 0 &&
      val <= maxTotal &&
      !distractors.includes(val) &&
      val !== total
    )
      distractors.push(val);
    if (distractors.length === 3) break;
  }
  return {
    type: "money",
    coins,
    total,
    choices: shuffle([total, ...distractors]),
  };
}

const BILL_DEFS = [
  { value: 1, label: "$1", color: "oklch(0.55 0.12 145)" },
  { value: 5, label: "$5", color: "oklch(0.50 0.13 225)" },
  { value: 10, label: "$10", color: "oklch(0.60 0.14 70)" },
  { value: 20, label: "$20", color: "oklch(0.55 0.13 55)" },
];

function makeMoneyBillsQuestion(): MoneyBillsQuestion {
  let bills: typeof BILL_DEFS = [];
  let total = 0;
  do {
    const count = randInt(2, 4);
    bills = Array.from({ length: count }, () => BILL_DEFS[randInt(0, 3)]);
    total = bills.reduce((s, b) => s + b.value, 0);
  } while (total > 30 || total < 2);
  const distractors = makeDistractors(total, 3, 1, 30);
  return {
    type: "money_bills",
    bills,
    total,
    choices: shuffle([total, ...distractors]),
  };
}

function makeMoneyChangeQuestion(difficulty: Difficulty): MoneyChangeQuestion {
  // Pick a realistic bill denomination based on difficulty
  const billOptions =
    difficulty === "easy"
      ? [100] // cents: $1 only
      : difficulty === "medium"
        ? [100, 500] // $1 or $5
        : [100, 500, 1000, 2000]; // $1, $5, $10, or $20
  const paidCents = billOptions[randInt(0, billOptions.length - 1)];
  // Cost must leave positive change and stay below paid amount
  const maxCost = paidCents - 5;
  const minCost = difficulty === "easy" ? 10 : 25;
  const cost = randInt(Math.min(minCost, maxCost - 5), maxCost);
  const change = paidCents - cost;
  const distractors = makeDistractors(change, 3, 1, paidCents - 1);
  return {
    type: "money_change",
    cost,
    paid: paidCents,
    change,
    choices: shuffle([change, ...distractors]),
  };
}

const RECEIPT_ITEMS = [
  { name: "Apple", price: 1 },
  { name: "Banana", price: 1 },
  { name: "Bread", price: 3 },
  { name: "Butter", price: 2 },
  { name: "Cereal", price: 4 },
  { name: "Cheese", price: 5 },
  { name: "Cookie", price: 2 },
  { name: "Egg", price: 3 },
  { name: "Grapes", price: 3 },
  { name: "Jam", price: 3 },
  { name: "Juice", price: 4 },
  { name: "Milk", price: 4 },
  { name: "Muffin", price: 2 },
  { name: "Orange", price: 1 },
  { name: "Pasta", price: 2 },
  { name: "Pear", price: 1 },
  { name: "Rice", price: 3 },
  { name: "Soup", price: 5 },
  { name: "Tomato", price: 2 },
  { name: "Yogurt", price: 6 },
];

export function makeMoneyReceiptQuestion(): MoneyReceiptQuestion {
  const count = randInt(2, 4);
  const pool = shuffle([...RECEIPT_ITEMS]);
  const items = pool.slice(0, count);
  const total = items.reduce((s, i) => s + i.price, 0);
  const distractors = makeDistractors(total, 3, 1, 30);
  return {
    type: "money_receipt",
    items,
    total,
    choices: shuffle([total, ...distractors]),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function makeTimeQuestion(difficulty: Difficulty): TimeQuestion {
  let minute: number;
  if (difficulty === "easy") {
    minute = [0, 30][randInt(0, 1)];
  } else if (difficulty === "medium") {
    minute = [0, 15, 30, 45][randInt(0, 3)];
  } else {
    minute = randInt(0, 11) * 5;
  }
  const hour = randInt(1, 12);
  const answer = `${hour}:${pad(minute)}`;
  const allTimes: string[] = [];
  if (difficulty === "hard") {
    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m += 5) {
        const t = `${h}:${pad(m)}`;
        if (t !== answer) allTimes.push(t);
      }
    }
  } else {
    for (let h = 1; h <= 12; h++) {
      for (const m of [0, 15, 30, 45]) {
        const t = `${h}:${pad(m)}`;
        if (t !== answer) allTimes.push(t);
      }
    }
  }
  const wrongs = shuffle(allTimes).slice(0, 3);
  return {
    type: "time",
    hour,
    minute,
    answer,
    choices: shuffle([answer, ...wrongs]),
  };
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function makeTimeCalendarQuestion(): TimeCalendarQuestion {
  const monthName = MONTH_NAMES[randInt(0, 11)];
  const startDay = randInt(1, 21);
  const endDay = startDay + randInt(1, 7);
  const answer = endDay - startDay;
  const distractors = makeDistractors(answer, 3, 1, 10);
  return {
    type: "time_calendar",
    monthName,
    startDay,
    endDay,
    answer,
    choices: shuffle([answer, ...distractors]),
  };
}

export function makeTimeElapsedQuestion(): TimeElapsedQuestion {
  const elapsedOptions = [10, 15, 20, 30, 45, 60];
  const elapsedMinutes = elapsedOptions[randInt(0, elapsedOptions.length - 1)];
  const startHour = randInt(1, 11);
  const startMinute = [0, 15, 30][randInt(0, 2)];
  const totalMinutes = startHour * 60 + startMinute + elapsedMinutes;
  const endHour = Math.floor(totalMinutes / 60) % 12 || 12;
  const endMinute = totalMinutes % 60;
  const answer = `${endHour}:${pad(endMinute)}`;
  const allTimes: string[] = [];
  for (let h = 1; h <= 12; h++) {
    for (const m of [0, 15, 30, 45]) {
      const t = `${h}:${pad(m)}`;
      if (t !== answer) allTimes.push(t);
    }
  }
  const wrongs = shuffle(allTimes).slice(0, 3);
  return {
    type: "time_elapsed",
    startHour,
    startMinute,
    elapsedMinutes,
    answer,
    choices: shuffle([answer, ...wrongs]),
  };
}

function makeSequenceQuestion(difficulty: Difficulty): SequenceQuestion {
  // Hard: alternating step sequences (e.g. +1,+3,+1,+3)
  if (difficulty === "hard" && Math.random() < 0.25) {
    const stepA = randInt(1, 3);
    let stepB = randInt(1, 3);
    while (stepB === stepA) stepB = randInt(1, 3);
    const startVal = randInt(1, 10);
    const nums: number[] = [startVal];
    for (let i = 0; i < 4; i++) {
      nums.push(nums[nums.length - 1] + (i % 2 === 0 ? stepA : stepB));
    }
    const blankIndex = randInt(2, 4);
    const answer = nums[blankIndex];
    const seq: (number | null)[] = nums.map((n, i) =>
      i === blankIndex ? null : n,
    );
    const distractors = makeDistractors(
      answer,
      3,
      Math.max(0, answer - 10),
      answer + 10,
    );
    return {
      type: "sequence",
      sequence: seq,
      answer,
      blankIndex,
      choices: shuffle([answer, ...distractors]),
      step: stepA,
      sequenceType: "alternating",
      questionLabel: `The pattern alternates +${stepA} and +${stepB}. What number goes in the blank?`,
    };
  }

  // Medium/Hard: doubling sequences (2,4,8,16...)
  if (difficulty !== "easy" && Math.random() < 0.2) {
    const base = randInt(1, 4);
    const nums = [base, base * 2, base * 4, base * 8, base * 16];
    const blankIndex = randInt(1, 3);
    const answer = nums[blankIndex];
    const seq: (number | null)[] = nums.map((n, i) =>
      i === blankIndex ? null : n,
    );
    const distractors = makeDistractors(answer, 3, 1, base * 32);
    return {
      type: "sequence",
      sequence: seq,
      answer,
      blankIndex,
      choices: shuffle([answer, ...distractors]),
      step: 0,
      sequenceType: "double",
      questionLabel: "Each number doubles. What number goes in the blank?",
    };
  }

  // Hard: skip-counting
  if (difficulty === "hard" && Math.random() < 0.4) {
    const skipStep = [2, 5, 10][randInt(0, 2)];
    const start = randInt(0, 10) * skipStep;
    const nums = [
      start,
      start + skipStep,
      start + 2 * skipStep,
      start + 3 * skipStep,
      start + 4 * skipStep,
    ];
    // Allow blankIndex 0 sometimes for "what comes before?"
    const allowBefore = Math.random() < 0.25;
    const blankIndex = allowBefore ? 0 : randInt(1, 3);
    const answer = nums[blankIndex];
    const seq: (number | null)[] = nums.map((n, i) =>
      i === blankIndex ? null : n,
    );
    const distractors = makeDistractors(
      answer,
      3,
      Math.max(0, answer - 20),
      answer + 20,
    );
    return {
      type: "sequence",
      sequence: seq,
      answer,
      blankIndex,
      choices: shuffle([answer, ...distractors]),
      step: skipStep,
      questionLabel: allowBefore
        ? "What number comes before the blank?"
        : undefined,
    };
  }

  // Medium/hard: 50% chance of descending
  const descending =
    (difficulty === "medium" || difficulty === "hard") && Math.random() < 0.5;

  const maxStep = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 6;
  const step = randInt(1, maxStep);

  let nums: number[];
  if (descending) {
    const maxStart = difficulty === "hard" ? 60 : 30;
    const start = randInt(step * 4 + 1, maxStart);
    nums = [
      start,
      start - step,
      start - 2 * step,
      start - 3 * step,
      start - 4 * step,
    ];
  } else {
    const maxStart = difficulty === "hard" ? 50 : 20;
    const start = randInt(1, maxStart);
    nums = [
      start,
      start + step,
      start + 2 * step,
      start + 3 * step,
      start + 4 * step,
    ];
  }

  // Allow blankIndex 0 sometimes on medium/hard for "what comes before?"
  const allowBefore =
    difficulty !== "easy" && !descending && Math.random() < 0.2;
  const blankIndex = allowBefore ? 0 : randInt(1, 3);
  const answer = nums[blankIndex];
  const seq: (number | null)[] = nums.map((n, i) =>
    i === blankIndex ? null : n,
  );

  const minD = Math.max(0, Math.min(...nums) - 5);
  const maxD = Math.max(...nums) + 5;
  const distractors = makeDistractors(answer, 3, minD, maxD);
  return {
    type: "sequence",
    sequence: seq,
    answer,
    blankIndex,
    choices: shuffle([answer, ...distractors]),
    step: descending ? -step : step,
    questionLabel: allowBefore
      ? "What number comes before the blank?"
      : undefined,
  };
}

function makePlaceValueQuestion(difficulty: Difficulty): PlaceValueQuestion {
  let num: number;
  if (difficulty === "easy") {
    num = randInt(11, 49);
  } else if (difficulty === "medium") {
    num = randInt(50, 99);
  } else {
    num = randInt(100, 199);
  }
  const ask: "tens" | "ones" = Math.random() < 0.5 ? "tens" : "ones";
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  const answer = ask === "tens" ? tens : ones;
  const distractors = makeDistractors(answer, 3, 0, 19);
  return {
    type: "placevalue",
    number: num,
    ask,
    answer,
    choices: shuffle([answer, ...distractors]),
  };
}

function makeNumberLineQuestion(difficulty: Difficulty): NumberLineQuestion {
  if (difficulty === "hard" && Math.random() < 0.4) {
    const rangeMin = -10;
    const rangeMax = 10;
    const markerValue = randInt(rangeMin + 1, rangeMax - 1);
    const allChoices = Array.from(
      { length: rangeMax - rangeMin + 1 },
      (_, i) => rangeMin + i,
    );
    const distPool = allChoices.filter((v) => v !== markerValue);
    const distractors = shuffle(distPool).slice(0, 3);
    return {
      type: "numberline",
      markerValue,
      rangeMin,
      rangeMax,
      choices: shuffle([markerValue, ...distractors]),
    };
  }

  const rangeMax =
    difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;
  const markerValue = randInt(1, rangeMax - 1);
  const distractors = makeDistractors(markerValue, 3, 0, rangeMax);
  return {
    type: "numberline",
    markerValue,
    rangeMin: 0,
    rangeMax,
    choices: shuffle([markerValue, ...distractors]),
  };
}

function makeNumberLineHalfwayQuestion(
  difficulty: Difficulty,
): NumberLineHalfwayQuestion {
  const rangeMax =
    difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
  let low: number;
  let high: number;
  // Ensure even difference so midpoint is an integer
  do {
    low = randInt(0, rangeMax - 4);
    const gap = randInt(2, difficulty === "easy" ? 4 : 8) * 2; // always even
    high = low + gap;
  } while (high > rangeMax);
  const answer = (low + high) / 2;
  const distractors = makeDistractors(answer, 3, 0, rangeMax);
  return {
    type: "numberline_halfway",
    low,
    high,
    answer,
    rangeMin: 0,
    rangeMax,
    choices: shuffle([answer, ...distractors]),
  };
}

function makeNumberLineCloserQuestion(
  difficulty: Difficulty,
): NumberLineCloserQuestion {
  const rangeMax =
    difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
  let anchorA: number;
  let anchorB: number;
  let target: number;
  let attempts = 0;
  do {
    anchorA = randInt(0, Math.floor(rangeMax / 2) - 2);
    anchorB = randInt(Math.floor(rangeMax / 2) + 2, rangeMax);
    target = randInt(anchorA + 1, anchorB - 1);
    attempts++;
  } while (
    attempts < 50 &&
    (target === anchorA ||
      target === anchorB ||
      Math.abs(target - anchorA) === Math.abs(target - anchorB))
  );
  const answer =
    Math.abs(target - anchorA) < Math.abs(target - anchorB) ? anchorA : anchorB;
  return {
    type: "numberline_closer",
    target,
    anchorA,
    anchorB,
    rangeMin: 0,
    rangeMax,
    answer,
    choices: shuffle([anchorA, anchorB]),
  };
}

function makeNumberLineHopsQuestion(
  difficulty: Difficulty,
): NumberLineHopsQuestion {
  const rangeMax =
    difficulty === "easy" ? 20 : difficulty === "medium" ? 30 : 50;
  let start: number;
  let hops: number;
  let hopSize: number;
  let answer: number;
  let attempts = 0;
  do {
    start = randInt(0, Math.floor(rangeMax / 3));
    hops =
      difficulty === "easy" ? 2 : randInt(2, difficulty === "hard" ? 5 : 3);
    hopSize =
      difficulty === "easy"
        ? randInt(1, 2)
        : randInt(1, difficulty === "hard" ? 5 : 3);
    answer = start + hops * hopSize;
    attempts++;
  } while (attempts < 100 && answer > rangeMax);
  const distractors = makeDistractors(answer, 3, 0, rangeMax);
  return {
    type: "numberline_hops",
    start,
    hops,
    hopSize,
    answer,
    rangeMin: 0,
    rangeMax,
    choices: shuffle([answer, ...distractors]),
  };
}

function scatterDots(count: number, minDist: number): [number, number][] {
  const dots: [number, number][] = [];
  let attempts = 0;
  const maxAttempts = count * 300;
  while (dots.length < count && attempts < maxAttempts) {
    attempts++;
    const x = 5 + Math.random() * 90;
    const y = 5 + Math.random() * 90;
    const tooClose = dots.some(
      ([dx, dy]) => Math.hypot(x - dx, y - dy) < minDist,
    );
    if (!tooClose) dots.push([x, y]);
  }
  return dots;
}

function makeEstimationBarQuestion(difficulty: Difficulty): EstimationQuestion {
  const maxHeight =
    difficulty === "easy" ? 20 : difficulty === "medium" ? 35 : 50;
  const roundTo = difficulty === "hard" ? 10 : 5;
  const barValues = [
    randInt(Math.floor(maxHeight * 0.15), maxHeight),
    randInt(Math.floor(maxHeight * 0.15), maxHeight),
    randInt(Math.floor(maxHeight * 0.15), maxHeight),
  ];
  const askBarIndex = randInt(0, 2);
  const targetValue = barValues[askBarIndex];
  const correct = Math.max(
    roundTo,
    Math.round(targetValue / roundTo) * roundTo,
  );
  const answerLabel = `around ${correct}`;
  const choiceSet = new Set<number>();
  choiceSet.add(correct);
  for (let offset = roundTo; choiceSet.size < 4; offset += roundTo) {
    if (correct - offset > 0) choiceSet.add(correct - offset);
    if (choiceSet.size < 4) choiceSet.add(correct + offset);
  }
  const choices = shuffle(
    Array.from(choiceSet)
      .slice(0, 4)
      .map((n) => `around ${n}`),
  );
  return {
    type: "estimation",
    variant: "bars",
    barValues,
    askBarIndex,
    dotCount: 0,
    dots: [],
    answerLabel,
    choices,
  };
}

function makeEstimationJarQuestion(): EstimationQuestion {
  const FILL_LABELS = [
    "about a quarter full",
    "about half full",
    "about three-quarters full",
    "almost full",
  ] as const;
  const buckets = [20, 40, 65, 88];
  const bucketIndex = randInt(0, 3);
  const fillPercent = buckets[bucketIndex] + randInt(-8, 8);
  const correctLabel = FILL_LABELS[bucketIndex];
  return {
    type: "estimation",
    variant: "jar",
    fillPercent: Math.max(5, Math.min(95, fillPercent)),
    dotCount: 0,
    dots: [],
    answerLabel: correctLabel,
    choices: shuffle([...FILL_LABELS]),
  };
}

export function makeEstimationQuestion(
  difficulty: Difficulty,
): EstimationQuestion {
  const r = Math.random();
  if (r < 0.34) return makeEstimationBarQuestion(difficulty);
  if (r < 0.54) return makeEstimationJarQuestion();
  // dots variant (original logic preserved below)
  let dotCount: number;
  let roundTo: number;
  let choiceStep: number;

  if (difficulty === "easy") {
    dotCount = randInt(5, 15);
    roundTo = 5;
    choiceStep = 5;
  } else if (difficulty === "medium") {
    dotCount = randInt(15, 30);
    roundTo = 5;
    choiceStep = 5;
  } else {
    dotCount = randInt(30, 50);
    roundTo = 10;
    choiceStep = 10;
  }

  const minDist = difficulty === "hard" ? 5 : 8;
  const dots = scatterDots(dotCount, minDist);
  const actualCount = dots.length;

  const correctRaw = Math.round(actualCount / roundTo) * roundTo;
  const correct = Math.max(roundTo, correctRaw);
  const answerLabel = `around ${correct}`;

  const choiceSet = new Set<number>();
  choiceSet.add(correct);
  for (let offset = choiceStep; choiceSet.size < 4; offset += choiceStep) {
    if (correct - offset > 0) choiceSet.add(correct - offset);
    if (choiceSet.size < 4) choiceSet.add(correct + offset);
  }
  const choices = shuffle(
    Array.from(choiceSet)
      .slice(0, 4)
      .map((n) => `around ${n}`),
  );

  return {
    type: "estimation",
    variant: "dots",
    dotCount: actualCount,
    dots: dots as [number, number][],
    answerLabel,
    choices,
  };
}

export function generateQuestion(
  catId: Exclude<CatId, "calm">,
  difficulty: Difficulty,
): QuestionData {
  switch (catId) {
    case "number": {
      const r = Math.random();
      if (difficulty !== "hard" && r < 0.25)
        return makeOddEvenQuestion(difficulty);
      if (r < 0.45) return makeNumberQuestion(difficulty);
      if (r < 0.6) return makeNumberSenseTextQuestion(difficulty);
      if (r < 0.8) return makeMagnitudeQuestion(difficulty);
      return makeGroupingQuestion(difficulty);
    }
    case "arith": {
      if (difficulty === "hard" && Math.random() < 0.25) {
        return makeArithMultiplyQuestion(difficulty);
      }
      if (difficulty === "easy") {
        return makeArithQuestion(difficulty);
      }
      return Math.random() < 0.5
        ? makeArithQuestion(difficulty)
        : makeArithScaffoldQuestion();
    }
    case "money": {
      if (difficulty === "hard" && Math.random() < 0.2) {
        return makeMoneyReceiptQuestion();
      }
      if (difficulty === "hard" && Math.random() < 0.3) {
        return makeMoneyChangeQuestion(difficulty);
      }
      if (difficulty === "hard") {
        return Math.random() < 0.5
          ? makeMoneyQuestion(difficulty)
          : makeMoneyBillsQuestion();
      }
      return Math.random() < 0.7
        ? makeMoneyQuestion(difficulty)
        : makeMoneyBillsQuestion();
    }
    case "time": {
      const r = Math.random();
      if (difficulty === "hard" && r < 0.35) return makeTimeElapsedQuestion();
      if (difficulty === "hard" && r < 0.55) return makeTimeScheduleQuestion();
      if (difficulty === "medium" && r < 0.25) return makeTimeElapsedQuestion();
      if (difficulty === "medium" && r < 0.4) return makeTimeScheduleQuestion();
      return r < 0.6
        ? makeTimeQuestion(difficulty)
        : makeTimeCalendarQuestion();
    }
    case "sequence":
      return Math.random() < 0.5
        ? makeSequenceQuestion(difficulty)
        : makePlaceValueQuestion(difficulty);
    case "numberline": {
      const r = Math.random();
      if (difficulty === "easy") {
        // easy: original identify + closer
        return r < 0.5
          ? makeNumberLineQuestion(difficulty)
          : makeNumberLineCloserQuestion(difficulty);
      }
      if (difficulty === "medium") {
        // medium: all four types
        if (r < 0.25) return makeNumberLineQuestion(difficulty);
        if (r < 0.5) return makeNumberLineHalfwayQuestion(difficulty);
        if (r < 0.75) return makeNumberLineCloserQuestion(difficulty);
        return makeNumberLineHopsQuestion(difficulty);
      }
      // hard: all types + decimal midpoints
      if (r < 0.2) return makeNumberLineQuestion(difficulty);
      if (r < 0.4) return makeNumberLineHalfwayQuestion(difficulty);
      if (r < 0.55) return makeNumberLineCloserQuestion(difficulty);
      if (r < 0.75) return makeNumberLineHopsQuestion(difficulty);
      return makeDecimalMidpointQuestion();
    }
    case "estimation":
      return makeEstimationQuestion(difficulty);
    case "stepseq":
      return makeStepSeqQuestion(difficulty);
    case "fractions":
      return makeFractionsQuestion(difficulty);
    case "measurement":
      return makeMeasurementQuestion(difficulty);
  }
}

export interface NumberSenseTextQuestion {
  type: "number_sense_text";
  prompt: string;
  choices: number[];
  answer: number;
}

export interface TimeScheduleQuestion {
  type: "time_schedule";
  prompt: string;
  choices: string[];
  answer: string;
}

export interface StepSeqQuestion {
  type: "stepseq";
  prompt: string;
  steps: string[];
  missingIndex: number;
  choices: string[];
  answer: number;
}

// ---------------------------------------------------------------------------
// Step-by-Step Sequencing scenarios
// ---------------------------------------------------------------------------

interface SeqScenario {
  steps: string[];
  name: string;
}

const SCENARIOS_EASY: SeqScenario[] = [
  {
    name: "making toast",
    steps: [
      "Put bread in the toaster",
      "Press the lever down",
      "Wait for toast to pop up",
      "Butter the toast",
    ],
  },
  {
    name: "washing hands",
    steps: [
      "Turn on the water",
      "Wet your hands",
      "Add soap and rub",
      "Rinse and dry",
    ],
  },
  {
    name: "putting on shoes",
    steps: ["Sit down", "Pick up a shoe", "Put your foot in", "Tie the laces"],
  },
  {
    name: "getting a drink",
    steps: [
      "Get a glass",
      "Open the fridge",
      "Pour the drink",
      "Close the fridge",
    ],
  },
  {
    name: "sending a text",
    steps: [
      "Pick up your phone",
      "Open messages",
      "Type your message",
      "Press send",
    ],
  },
  {
    name: "watering a plant",
    steps: [
      "Get a watering can",
      "Fill it with water",
      "Pour water on the plant",
      "Put the can away",
    ],
  },
  {
    name: "making a bed",
    steps: [
      "Straighten the sheet",
      "Pull up the duvet",
      "Fluff the pillow",
      "Place pillow at the top",
    ],
  },
];

const SCENARIOS_MEDIUM: SeqScenario[] = [
  {
    name: "making a sandwich",
    steps: [
      "Take two slices of bread",
      "Spread butter on one slice",
      "Add your filling",
      "Place the other slice on top",
    ],
  },
  {
    name: "paying at a store",
    steps: [
      "Walk to the register",
      "Put items on the counter",
      "Hand over your money",
      "Take your receipt",
    ],
  },
  {
    name: "catching a bus",
    steps: [
      "Check the timetable",
      "Walk to the bus stop",
      "Wait for the right bus",
      "Get on and pay the fare",
    ],
  },
  {
    name: "reading a clock",
    steps: [
      "Look at the hour hand",
      "Find the number it points to",
      "Look at the minute hand",
      "Count the minutes from 12",
    ],
  },
  {
    name: "following a recipe",
    steps: [
      "Read all the ingredients",
      "Gather what you need",
      "Follow each step in order",
      "Check the dish is ready",
    ],
  },
  {
    name: "getting ready in the morning",
    steps: [
      "Wake up and get out of bed",
      "Wash your face",
      "Get dressed",
      "Eat breakfast",
    ],
  },
  {
    name: "posting a letter",
    steps: [
      "Write the letter",
      "Put it in an envelope",
      "Write the address on the front",
      "Add a stamp and post it",
    ],
  },
];

const SCENARIOS_HARD: SeqScenario[] = [
  {
    name: "making a cup of tea",
    steps: [
      "Boil the kettle",
      "Put a teabag in the mug",
      "Pour in the hot water",
      "Let it brew for two minutes",
      "Remove the teabag and add milk",
    ],
  },
  {
    name: "cooking pasta",
    steps: [
      "Fill a pot with water",
      "Bring water to a boil",
      "Add salt and pasta",
      "Cook for the time on the pack",
      "Drain the pasta",
    ],
  },
  {
    name: "planning a trip",
    steps: [
      "Choose your destination",
      "Check travel options",
      "Book your tickets",
      "Pack what you need",
      "Set an alarm for the morning",
    ],
  },
  {
    name: "checking out at a library",
    steps: [
      "Choose your books",
      "Bring them to the desk",
      "Give the librarian your card",
      "Wait for them to scan the books",
      "Put the books in your bag",
    ],
  },
  {
    name: "filling in a form",
    steps: [
      "Read the instructions",
      "Gather your details",
      "Fill in each section",
      "Check your answers",
      "Sign and submit",
    ],
  },
  {
    name: "following a morning routine",
    steps: [
      "Turn off the alarm",
      "Brush your teeth",
      "Shower and get dressed",
      "Have breakfast",
      "Check you have everything before leaving",
    ],
  },
  {
    name: "shopping for groceries",
    steps: [
      "Write a shopping list",
      "Go to the shop",
      "Find each item on your list",
      "Go to the checkout",
      "Pack bags and pay",
    ],
  },
];

function makeDecimalMidpointQuestion(): NumberLineHalfwayQuestion {
  const intPairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [0, 2],
    [2, 4],
  ];
  const [low, high] = intPairs[Math.floor(Math.random() * intPairs.length)];
  const answer = (low + high) / 2;
  // Distractors: nearby values with 0.5 steps
  const pool = [
    low - 0.5,
    low,
    low + 0.5,
    answer,
    high - 0.5,
    high,
    high + 0.5,
  ].filter((v) => v !== answer && v >= -0.5);
  const distractors = shuffle(pool).slice(0, 3);
  return {
    type: "numberline_halfway",
    low,
    high,
    answer,
    rangeMin: Math.max(0, low - 1),
    rangeMax: high + 1,
    choices: shuffle([answer, ...distractors]),
  };
}

const SCENARIOS_ADDITIONAL_EASY: SeqScenario[] = [
  {
    name: "making toast",
    steps: [
      "Put bread in toaster",
      "Wait for it to pop",
      "Spread butter",
      "Put on a plate",
    ],
  },
  {
    name: "getting dressed",
    steps: [
      "Put on underwear",
      "Put on shirt",
      "Put on trousers",
      "Put on shoes",
    ],
  },
  {
    name: "brushing teeth",
    steps: [
      "Put toothpaste on brush",
      "Brush teeth for 2 minutes",
      "Rinse mouth",
      "Rinse the brush",
    ],
  },
];

const SCENARIOS_ADDITIONAL_MEDIUM: SeqScenario[] = [
  {
    name: "making a sandwich",
    steps: [
      "Get out bread",
      "Add filling",
      "Put on the other slice",
      "Cut in half",
    ],
  },
  {
    name: "packing a schoolbag",
    steps: [
      "Check what you need",
      "Put books in bag",
      "Add pencil case",
      "Zip up the bag",
    ],
  },
];

const SCENARIOS_ADDITIONAL_HARD: SeqScenario[] = [
  {
    name: "posting a letter",
    steps: [
      "Write the letter",
      "Put it in an envelope",
      "Write the address",
      "Put on a stamp",
      "Post it",
    ],
  },
];

function makeStepSeqQuestion(difficulty: Difficulty): StepSeqQuestion {
  const pool =
    difficulty === "easy"
      ? [...SCENARIOS_EASY, ...SCENARIOS_ADDITIONAL_EASY]
      : difficulty === "medium"
        ? [...SCENARIOS_MEDIUM, ...SCENARIOS_ADDITIONAL_MEDIUM]
        : [...SCENARIOS_HARD, ...SCENARIOS_ADDITIONAL_HARD];

  const scenario = pool[Math.floor(Math.random() * pool.length)];
  const steps = [...scenario.steps];

  const missingIndex = randInt(0, steps.length - 1);
  const correctStep = steps[missingIndex];

  const allSteps = pool
    .flatMap((s) => s.steps)
    .filter((s) => s !== correctStep);
  const shuffledDistractors = shuffle(allSteps).slice(0, 3);

  const choices = shuffle([correctStep, ...shuffledDistractors]);
  const answer = choices.indexOf(correctStep);

  const displaySteps = steps.map((s, i) => (i === missingIndex ? "?" : s));

  return {
    type: "stepseq",
    prompt: `${scenario.name.charAt(0).toUpperCase() + scenario.name.slice(1)} \u2014 what is the missing step?`,
    steps: displaySteps,
    missingIndex,
    choices,
    answer,
  };
}

// ---------------------------------------------------------------------------
// Fractions
// ---------------------------------------------------------------------------

export interface FractionsQuestion {
  type: "fractions";
  prompt: string;
  svgA: string;
  svgB?: string;
  labelA?: string;
  labelB?: string;
  choices: string[];
  answer: number;
  explanation: string;
}

function makeFractionBarSVG(
  numerator: number,
  denominator: number,
  shadeColor = "oklch(0.55 0.15 130)",
  unshadeColor = "oklch(0.93 0.04 130)",
  borderColor = "oklch(0.40 0.10 130)",
): string {
  const W = 240;
  const H = 48;
  const partW = W / denominator;
  const parts = Array.from({ length: denominator }, (_, i) => {
    const x = i * partW;
    const fill = i < numerator ? shadeColor : unshadeColor;
    return `<rect x="${x.toFixed(1)}" y="0" width="${partW.toFixed(1)}" height="${H}" fill="${fill}" />`;
  }).join("\n    ");
  const dividers = Array.from({ length: denominator + 1 }, (_, i) => {
    const x = (i * partW).toFixed(1);
    return `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${borderColor}" stroke-width="1.5" />`;
  }).join("\n    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${numerator} out of ${denominator} equal parts shaded"><title>${numerator}/${denominator} fraction bar</title>
    ${parts}
    <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${borderColor}" stroke-width="2" />
    ${dividers}
  </svg>`;
}

function makeFractionsQuestion(difficulty: Difficulty): FractionsQuestion {
  const r = Math.random();

  if (difficulty === "easy") {
    // Identify shaded fraction — halves or quarters
    const configs = [
      { n: 1, d: 2 },
      { n: 1, d: 4 },
      { n: 2, d: 4 },
      { n: 3, d: 4 },
    ];
    const { n, d } = configs[Math.floor(Math.random() * configs.length)];
    const correct = `${n}/${d}`;
    const distractors = ["1/2", "1/4", "2/4", "3/4", "1/3", "2/3"].filter(
      (v) => v !== correct,
    );
    const wrong = shuffle(distractors).slice(0, 3);
    const choices = shuffle([correct, ...wrong]);
    const answer = choices.indexOf(correct);
    return {
      type: "fractions",
      prompt: "What fraction is shaded?",
      svgA: makeFractionBarSVG(n, d),
      choices,
      answer,
      explanation: `That's right! ${n} out of ${d} equal parts are shaded, so the fraction is ${n}/${d}.`,
    };
  }

  if (difficulty === "medium") {
    if (r < 0.5) {
      // Identify — thirds or eighths
      const configs = [
        { n: 1, d: 3 },
        { n: 2, d: 3 },
        { n: 3, d: 8 },
        { n: 5, d: 8 },
        { n: 7, d: 8 },
        { n: 1, d: 8 },
      ];
      const { n, d } = configs[Math.floor(Math.random() * configs.length)];
      const correct = `${n}/${d}`;
      const distractors = [
        "1/3",
        "2/3",
        "1/8",
        "3/8",
        "5/8",
        "7/8",
        "1/4",
        "3/4",
      ].filter((v) => v !== correct);
      const wrong = shuffle(distractors).slice(0, 3);
      const choices = shuffle([correct, ...wrong]);
      const answer = choices.indexOf(correct);
      return {
        type: "fractions",
        prompt: "What fraction is shaded?",
        svgA: makeFractionBarSVG(n, d),
        choices,
        answer,
        explanation: `Well done! ${n} out of ${d} equal parts are shaded, so the answer is ${n}/${d}.`,
      };
    }
    // Compare two fractions — which is bigger?
    {
      const pairs: [number, number, number, number][] = [
        [1, 2, 1, 4],
        [3, 4, 1, 2],
        [2, 3, 1, 3],
        [3, 4, 2, 4],
        [1, 3, 2, 3],
      ];
      const [n1, d1, n2, d2] = pairs[Math.floor(Math.random() * pairs.length)];
      const v1 = n1 / d1;
      const v2 = n2 / d2;
      const correct = v1 > v2 ? "The first bar" : "The second bar";
      const choices = shuffle([
        "The first bar",
        "The second bar",
        "They are equal",
        "Can't tell",
      ]);
      const answer = choices.indexOf(correct);
      const biggerFrac = v1 > v2 ? `${n1}/${d1}` : `${n2}/${d2}`;
      return {
        type: "fractions",
        prompt: "Which fraction bar shows a bigger amount?",
        svgA: makeFractionBarSVG(n1, d1),
        svgB: makeFractionBarSVG(n2, d2),
        labelA: `${n1}/${d1}`,
        labelB: `${n2}/${d2}`,
        choices,
        answer,
        explanation: `${biggerFrac} is the larger fraction. Comparing the shaded parts helps you see which is more.`,
      };
    }
  }

  // Hard — equivalent fractions and fifths/sixths
  const hardR = Math.random();
  if (hardR < 0.4) {
    // Equivalent fractions
    const equivSets: { prompt: string; correct: string; choices: string[] }[] =
      [
        {
          prompt: "Which fraction is equivalent to 1/2?",
          correct: "2/4",
          choices: shuffle(["2/4", "1/3", "3/8", "3/6"]),
        },
        {
          prompt: "Which fraction is equivalent to 2/4?",
          correct: "1/2",
          choices: shuffle(["1/2", "1/3", "3/8", "2/3"]),
        },
        {
          prompt: "Which fraction is equivalent to 2/3?",
          correct: "4/6",
          choices: shuffle(["4/6", "3/4", "2/4", "3/6"]),
        },
        {
          prompt: "Which fraction equals 3/6?",
          correct: "1/2",
          choices: shuffle(["1/2", "2/3", "1/3", "3/8"]),
        },
      ];
    const eq = equivSets[Math.floor(Math.random() * equivSets.length)];
    const answer = eq.choices.indexOf(eq.correct);
    return {
      type: "fractions",
      prompt: eq.prompt,
      svgA: (() => {
        const promptMatch = eq.prompt.match(/(\d+\/\d+)\?/);
        const [promptN, promptD] = promptMatch
          ? promptMatch[1].split("/").map(Number)
          : [1, 2];
        return makeFractionBarSVG(promptN, promptD);
      })(),
      choices: eq.choices,
      answer,
      explanation: `Correct! ${eq.correct} is the same amount as another fraction — equal fractions cover the same area on a bar.`,
    };
  }

  // Identify fifths or sixths
  const configs = [
    { n: 1, d: 5 },
    { n: 2, d: 5 },
    { n: 4, d: 5 },
    { n: 1, d: 6 },
    { n: 3, d: 6 },
    { n: 5, d: 6 },
  ];
  const { n, d } = configs[Math.floor(Math.random() * configs.length)];
  const correct = `${n}/${d}`;
  const distractors = [
    "1/5",
    "2/5",
    "3/5",
    "4/5",
    "1/6",
    "2/6",
    "3/6",
    "5/6",
  ].filter((v) => v !== correct);
  const wrong = shuffle(distractors).slice(0, 3);
  const choices = shuffle([correct, ...wrong]);
  const answer = choices.indexOf(correct);
  return {
    type: "fractions",
    prompt: "What fraction is shaded?",
    svgA: makeFractionBarSVG(n, d),
    choices,
    answer,
    explanation: `That's it! ${n} out of ${d} equal parts are shaded, making the fraction ${n}/${d}.`,
  };
}

export interface MeasurementQuestion {
  type: "measurement";
  variant:
    | "length_ruler"
    | "length_compare"
    | "weight_compare"
    | "weight_scale"
    | "volume_cup";
  prompt: string;
  rulerCm?: number;
  rulerMax?: number;
  itemALabel?: string;
  itemBLabel?: string;
  itemAValue?: number;
  itemBValue?: number;
  itemAUnit?: string;
  weightALabel?: string;
  weightBLabel?: string;
  weightAValue?: number;
  weightBValue?: number;
  weightUnit?: string;
  scaleValue?: number;
  scaleUnit?: string;
  scaleMax?: number;
  cupFillMl?: number;
  cupMaxMl?: number;
  choices: string[];
  answer: number;
  explanation: string;
}

function makeMeasurementQuestion(difficulty: Difficulty): MeasurementQuestion {
  const r = Math.random();
  if (r < 0.25) return makeLengthRulerQuestion(difficulty);
  if (r < 0.5) return makeLengthCompareQuestion(difficulty);
  if (r < 0.7) return makeWeightCompareQuestion(difficulty);
  if (r < 0.85) return makeWeightScaleQuestion(difficulty);
  return makeVolumeCupQuestion(difficulty);
}

function makeLengthRulerQuestion(difficulty: Difficulty): MeasurementQuestion {
  const rulerMax =
    difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
  const rulerCm = randInt(1, rulerMax - 1);
  const correct = `${rulerCm} cm`;
  const distractors = makeDistractors(rulerCm, 3, 1, rulerMax).map(
    (n) => `${n} cm`,
  );
  const choices = shuffle([correct, ...distractors]);
  return {
    type: "measurement",
    variant: "length_ruler",
    prompt: "Where does the arrow point on the ruler?",
    rulerCm,
    rulerMax,
    choices,
    answer: choices.indexOf(correct),
    explanation: `The arrow points to ${rulerCm} cm on the ruler.`,
  };
}

function makeLengthCompareQuestion(
  difficulty: Difficulty,
): MeasurementQuestion {
  const maxVal =
    difficulty === "easy" ? 10 : difficulty === "medium" ? 30 : 100;
  const unit =
    difficulty === "hard" ? (Math.random() < 0.5 ? "m" : "cm") : "cm";
  const OBJECTS = [
    "pencil",
    "ribbon",
    "worm",
    "caterpillar",
    "string",
    "stick",
    "rope",
    "snake",
    "ruler",
    "straw",
  ];
  const [labelA, labelB] = shuffle([...OBJECTS]).slice(0, 2);
  let valA: number;
  let valB: number;
  do {
    valA = randInt(1, maxVal);
    valB = randInt(1, maxVal);
  } while (valA === valB);
  const correct = valA > valB ? `The ${labelA}` : `The ${labelB}`;
  const choices = shuffle([
    `The ${labelA}`,
    `The ${labelB}`,
    "They are the same",
    "Cannot tell",
  ]);
  return {
    type: "measurement",
    variant: "length_compare",
    prompt: "Which is longer?",
    itemALabel: labelA,
    itemBLabel: labelB,
    itemAValue: valA,
    itemBValue: valB,
    itemAUnit: unit,
    choices,
    answer: choices.indexOf(correct),
    explanation: `${valA > valB ? labelA : labelB} (${Math.max(valA, valB)} ${unit}) is longer than ${valA > valB ? labelB : labelA} (${Math.min(valA, valB)} ${unit}).`,
  };
}

function makeWeightCompareQuestion(
  difficulty: Difficulty,
): MeasurementQuestion {
  const ITEMS = [
    "apple",
    "feather",
    "book",
    "rock",
    "orange",
    "coin",
    "shoe",
    "bottle",
    "egg",
    "pen",
  ];
  const [labelA, labelB] = shuffle([...ITEMS]).slice(0, 2);
  const maxVal =
    difficulty === "easy" ? 200 : difficulty === "medium" ? 500 : 1000;
  const unit = "g";
  let valA: number;
  let valB: number;
  do {
    valA = randInt(1, maxVal);
    valB = randInt(1, maxVal);
  } while (valA === valB);
  const correct = valA > valB ? `The ${labelA}` : `The ${labelB}`;
  const choices = shuffle([
    `The ${labelA}`,
    `The ${labelB}`,
    "They weigh the same",
    "Cannot tell",
  ]);
  return {
    type: "measurement",
    variant: "weight_compare",
    prompt: "Which is heavier?",
    weightALabel: labelA,
    weightBLabel: labelB,
    weightAValue: valA,
    weightBValue: valB,
    weightUnit: unit,
    choices,
    answer: choices.indexOf(correct),
    explanation: `${valA > valB ? labelA : labelB} (${Math.max(valA, valB)} ${unit}) is heavier than ${valA > valB ? labelB : labelA} (${Math.min(valA, valB)} ${unit}).`,
  };
}

function makeWeightScaleQuestion(difficulty: Difficulty): MeasurementQuestion {
  const scaleMax =
    difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 100;
  const unit = difficulty === "easy" ? "kg" : "g";
  const step = difficulty === "easy" ? 1 : difficulty === "medium" ? 5 : 10;
  const scaleValue = randInt(1, Math.floor(scaleMax / step)) * step;
  const correct = `${scaleValue} ${unit}`;
  const distractors = makeDistractors(scaleValue, 3, step, scaleMax).map(
    (n) => `${n} ${unit}`,
  );
  const choices = shuffle([correct, ...distractors]);
  return {
    type: "measurement",
    variant: "weight_scale",
    prompt: "What does the scale show?",
    scaleValue,
    scaleUnit: unit,
    scaleMax,
    choices,
    answer: choices.indexOf(correct),
    explanation: `The scale needle points to ${scaleValue} ${unit}.`,
  };
}

function makeVolumeCupQuestion(difficulty: Difficulty): MeasurementQuestion {
  const cupMaxMl =
    difficulty === "easy" ? 250 : difficulty === "medium" ? 500 : 1000;
  const step = difficulty === "easy" ? 50 : difficulty === "medium" ? 100 : 200;
  const fills = Array.from(
    { length: Math.floor(cupMaxMl / step) - 1 },
    (_, i) => (i + 1) * step,
  );
  const cupFillMl = fills[randInt(0, fills.length - 1)];
  const correct = `${cupFillMl} ml`;
  const distractors = makeDistractors(cupFillMl, 3, step, cupMaxMl - step).map(
    (n) => `${n} ml`,
  );
  const choices = shuffle([correct, ...distractors]);
  return {
    type: "measurement",
    variant: "volume_cup",
    prompt: "How much liquid is in the cup?",
    cupFillMl,
    cupMaxMl,
    choices,
    answer: choices.indexOf(correct),
    explanation: `The liquid reaches the ${cupFillMl} ml mark.`,
  };
}
