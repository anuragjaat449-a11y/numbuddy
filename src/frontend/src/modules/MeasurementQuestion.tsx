import type React from "react";
import type { MeasurementQuestion as MQ } from "../game/questions";
import AnswerButtons from "./AnswerButtons";

interface Props {
  question: MQ;
  answered: boolean;
  selectedIdx: number | null;
  correctIdx: number | null;
  colors: { accent: string; bg: string; border: string };
  onChoice: (idx: number, isCorrect: boolean, correctIndex: number) => void;
}

const MEASUREMENT_TIPS: Record<string, string> = {
  length_ruler: "Tip: count the spaces between marks, not the marks themselves",
  length_compare: "Tip: the longer bar shows the bigger measurement",
  weight_compare: "Tip: the larger circle represents the heavier object",
  weight_scale: "Tip: find where the needle is pointing on the scale",
  volume_cup: "Tip: read the number at the water line",
};

function RulerSVG({
  rulerCm,
  rulerMax,
  accent,
  bg,
  border,
}: {
  rulerCm: number;
  rulerMax: number;
  accent: string;
  bg: string;
  border: string;
}) {
  const width = 320;
  const height = 70;
  const padL = 20;
  const padR = 20;
  const rulerY = 28;
  const rulerH = 28;
  const rulerW = width - padL - padR;
  const cmToPx = rulerW / rulerMax;
  const arrowX = padL + rulerCm * cmToPx;

  const ticks: React.ReactElement[] = [];
  for (let i = 0; i <= rulerMax; i++) {
    const x = padL + i * cmToPx;
    const isLong = i % 5 === 0;
    const tickH = isLong ? 12 : 7;
    ticks.push(
      <line
        key={i}
        x1={x}
        y1={rulerY}
        x2={x}
        y2={rulerY + tickH}
        stroke={accent}
        strokeWidth={isLong ? 1.5 : 1}
      />,
    );
    if (isLong) {
      ticks.push(
        <text
          key={`l${i}`}
          x={x}
          y={rulerY + rulerH - 2}
          textAnchor="middle"
          fontSize="9"
          fill={accent}
        >
          {i}
        </text>,
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={`Ruler from 0 to ${rulerMax} cm with arrow at ${rulerCm} cm`}
      role="img"
    >
      <title>Ruler showing {rulerCm} cm</title>
      {/* Ruler body */}
      <rect
        x={padL}
        y={rulerY}
        width={rulerW}
        height={rulerH}
        fill={bg}
        stroke={border}
        strokeWidth={1.5}
        rx={3}
      />
      {ticks}
      {/* Arrow pointing down */}
      <polygon
        points={`${arrowX},${rulerY - 14} ${arrowX - 7},${rulerY - 4} ${arrowX + 7},${rulerY - 4}`}
        fill={accent}
      />
      <line
        x1={arrowX}
        y1={rulerY - 4}
        x2={arrowX}
        y2={rulerY}
        stroke={accent}
        strokeWidth={2}
      />
    </svg>
  );
}

function LengthCompareSVG({
  itemALabel,
  itemBLabel,
  itemAValue,
  itemBValue,
  itemAUnit,
  accent,
  bg,
  border,
}: {
  itemALabel: string;
  itemBLabel: string;
  itemAValue: number;
  itemBValue: number;
  itemAUnit: string;
  accent: string;
  bg: string;
  border: string;
}) {
  const maxVal = Math.max(itemAValue, itemBValue);
  const barMaxW = 260;
  const barH = 28;
  const widthA = Math.round((itemAValue / maxVal) * barMaxW);
  const widthB = Math.round((itemBValue / maxVal) * barMaxW);
  const longer = itemAValue > itemBValue ? "A" : "B";

  return (
    <svg
      width={320}
      height={110}
      viewBox="0 0 320 110"
      aria-label={`Length comparison: ${itemALabel} is ${itemAValue} ${itemAUnit}, ${itemBLabel} is ${itemBValue} ${itemAUnit}`}
      role="img"
    >
      <title>
        Length comparison between {itemALabel} and {itemBLabel}
      </title>
      {/* Bar A */}
      <text x={10} y={22} fontSize="12" fontWeight="600" fill={accent}>
        {itemALabel}
      </text>
      <rect
        x={10}
        y={28}
        width={widthA}
        height={barH}
        fill={longer === "A" ? accent : bg}
        stroke={border}
        strokeWidth={1.5}
        rx={4}
      />
      <text
        x={widthA + 16}
        y={47}
        fontSize="11"
        fill={longer === "A" ? accent : "oklch(0.45 0.04 55)"}
      >
        {itemAValue} {itemAUnit}
      </text>
      {/* Bar B */}
      <text x={10} y={80} fontSize="12" fontWeight="600" fill={accent}>
        {itemBLabel}
      </text>
      <rect
        x={10}
        y={86}
        width={widthB}
        height={barH}
        fill={longer === "B" ? accent : bg}
        stroke={border}
        strokeWidth={1.5}
        rx={4}
      />
      <text
        x={widthB + 16}
        y={105}
        fontSize="11"
        fill={longer === "B" ? accent : "oklch(0.45 0.04 55)"}
      >
        {itemBValue} {itemAUnit}
      </text>
    </svg>
  );
}

function WeightCompareSVG({
  weightALabel,
  weightBLabel,
  weightAValue,
  weightBValue,
  weightUnit,
  accent,
  bg,
  border,
}: {
  weightALabel: string;
  weightBLabel: string;
  weightAValue: number;
  weightBValue: number;
  weightUnit: string;
  accent: string;
  bg: string;
  border: string;
}) {
  const maxVal = Math.max(weightAValue, weightBValue);
  const minR = 22;
  const maxR = 50;
  const rA = Math.round(minR + (weightAValue / maxVal) * (maxR - minR));
  const rB = Math.round(minR + (weightBValue / maxVal) * (maxR - minR));
  const heavier = weightAValue > weightBValue ? "A" : "B";

  return (
    <svg
      width={320}
      height={130}
      viewBox="0 0 320 130"
      aria-label={`Weight comparison: ${weightALabel} is ${weightAValue} ${weightUnit}, ${weightBLabel} is ${weightBValue} ${weightUnit}`}
      role="img"
    >
      <title>
        Weight comparison between {weightALabel} and {weightBLabel}
      </title>
      {/* Circle A */}
      <circle
        cx={90}
        cy={70}
        r={rA}
        fill={heavier === "A" ? accent : bg}
        stroke={border}
        strokeWidth={2}
      />
      <text
        x={90}
        y={67}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={heavier === "A" ? "oklch(0.98 0.01 55)" : accent}
      >
        {weightALabel}
      </text>
      <text
        x={90}
        y={81}
        textAnchor="middle"
        fontSize="10"
        fill={heavier === "A" ? "oklch(0.98 0.01 55)" : "oklch(0.45 0.04 55)"}
      >
        {weightAValue} {weightUnit}
      </text>
      {/* Circle B */}
      <circle
        cx={230}
        cy={70}
        r={rB}
        fill={heavier === "B" ? accent : bg}
        stroke={border}
        strokeWidth={2}
      />
      <text
        x={230}
        y={67}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={heavier === "B" ? "oklch(0.98 0.01 55)" : accent}
      >
        {weightBLabel}
      </text>
      <text
        x={230}
        y={81}
        textAnchor="middle"
        fontSize="10"
        fill={heavier === "B" ? "oklch(0.98 0.01 55)" : "oklch(0.45 0.04 55)"}
      >
        {weightBValue} {weightUnit}
      </text>
    </svg>
  );
}

function WeightScaleSVG({
  scaleValue,
  scaleMax,
  scaleUnit,
  accent,
  bg,
  border,
}: {
  scaleValue: number;
  scaleMax: number;
  scaleUnit: string;
  accent: string;
  bg: string;
  border: string;
}) {
  const cx = 140;
  const cy = 120;
  const r = 90;
  // Needle angle: 0 = -135deg (left), scaleMax = +135deg (right)
  const ratio = scaleValue / scaleMax;
  const angleRad = (-135 + ratio * 270) * (Math.PI / 180);
  const needleLen = 65;
  const nx = cx + Math.cos(angleRad) * needleLen;
  const ny = cy + Math.sin(angleRad) * needleLen;

  const ticks: React.ReactElement[] = [];
  const numTicks = 5;
  for (let i = 0; i <= numTicks; i++) {
    const a = (-135 + (i / numTicks) * 270) * (Math.PI / 180);
    const x1 = cx + Math.cos(a) * (r - 4);
    const y1 = cy + Math.sin(a) * (r - 4);
    const x2 = cx + Math.cos(a) * (r - 14);
    const y2 = cy + Math.sin(a) * (r - 14);
    const lx = cx + Math.cos(a) * (r - 24);
    const ly = cy + Math.sin(a) * (r - 24);
    const label = Math.round((i / numTicks) * scaleMax);
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={accent}
        strokeWidth={2}
      />,
    );
    ticks.push(
      <text
        key={`t${i}`}
        x={lx}
        y={ly + 4}
        textAnchor="middle"
        fontSize="10"
        fill={accent}
      >
        {label}
      </text>,
    );
  }

  return (
    <svg
      width={280}
      height={160}
      viewBox="0 0 280 160"
      aria-label={`Scale showing ${scaleValue} ${scaleUnit} out of ${scaleMax} ${scaleUnit}`}
      role="img"
    >
      <title>
        Weight scale showing {scaleValue} {scaleUnit}
      </title>
      <circle cx={cx} cy={cy} r={r} fill={bg} stroke={border} strokeWidth={2} />
      {ticks}
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={accent}
      >
        {scaleUnit}
      </text>
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke={accent}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={6} fill={accent} />
    </svg>
  );
}

function VolumeCupSVG({
  cupFillMl,
  cupMaxMl,
  accent,
  bg,
  border,
}: {
  cupFillMl: number;
  cupMaxMl: number;
  accent: string;
  bg: string;
  border: string;
}) {
  const cupTopW = 80;
  const cupBottomW = 56;
  const cupH = 140;
  const cupX = 30;
  const cupTopY = 20;
  const cupBottomY = cupTopY + cupH;
  // Trapezoid points
  const tl = { x: cupX, y: cupTopY };
  const tr = { x: cupX + cupTopW, y: cupTopY };
  const br = { x: cupX + cupTopW - (cupTopW - cupBottomW) / 2, y: cupBottomY };
  const bl = { x: cupX + (cupTopW - cupBottomW) / 2, y: cupBottomY };

  // Fill line y position (0 = bottom, 1 = top)
  const fillRatio = cupFillMl / cupMaxMl;
  const fillY = cupBottomY - fillRatio * cupH;
  // Interpolate x at fillY
  const t = (cupBottomY - fillY) / cupH;
  const fillLeftX = bl.x - t * (bl.x - tl.x);
  const fillRightX = br.x + t * (tr.x - br.x);

  // Markings
  const step = cupMaxMl <= 250 ? 50 : cupMaxMl <= 500 ? 100 : 200;
  const marks: React.ReactElement[] = [];
  for (let ml = step; ml < cupMaxMl; ml += step) {
    const mRatio = ml / cupMaxMl;
    const mY = cupBottomY - mRatio * cupH;
    const mT = (cupBottomY - mY) / cupH;
    const mRX = br.x + mT * (tr.x - br.x);
    marks.push(
      <g key={ml}>
        <line
          x1={mRX}
          y1={mY}
          x2={mRX + 10}
          y2={mY}
          stroke={accent}
          strokeWidth={1}
        />
        <text x={mRX + 14} y={mY + 4} fontSize="9" fill={accent}>
          {ml} ml
        </text>
      </g>,
    );
  }

  const cupPath = `M ${tl.x} ${tl.y} L ${tr.x} ${tr.y} L ${br.x} ${br.y} L ${bl.x} ${bl.y} Z`;
  const fillPath = `M ${fillLeftX} ${fillY} L ${fillRightX} ${fillY} L ${br.x} ${br.y} L ${bl.x} ${bl.y} Z`;

  return (
    <svg
      width={200}
      height={180}
      viewBox="0 0 200 180"
      aria-label={`Measuring cup with ${cupFillMl} ml of liquid out of ${cupMaxMl} ml`}
      role="img"
    >
      <title>Measuring cup showing {cupFillMl} ml</title>
      {/* Fill */}
      <path d={fillPath} fill={bg} />
      {/* Cup outline */}
      <path d={cupPath} fill="none" stroke={border} strokeWidth={2} />
      {/* Fill line */}
      <line
        x1={fillLeftX}
        y1={fillY}
        x2={fillRightX}
        y2={fillY}
        stroke={accent}
        strokeWidth={2}
      />
      {marks}
      {/* Max label */}
      <text x={tr.x + 4} y={cupTopY + 4} fontSize="9" fill={accent}>
        {cupMaxMl} ml
      </text>
      {/* Handle */}
      <path
        d={`M ${tr.x} ${cupTopY + 30} Q ${tr.x + 24} ${cupTopY + 50} ${tr.x} ${cupTopY + 80}`}
        fill="none"
        stroke={border}
        strokeWidth={2}
      />
    </svg>
  );
}

export default function MeasurementQuestion({
  question,
  answered,
  selectedIdx,
  correctIdx,
  colors,
  onChoice,
}: Props) {
  const correctIndex = question.answer;

  const renderVisual = () => {
    switch (question.variant) {
      case "length_ruler":
        return (
          <RulerSVG
            rulerCm={question.rulerCm ?? 5}
            rulerMax={question.rulerMax ?? 10}
            accent={colors.accent}
            bg={colors.bg}
            border={colors.border}
          />
        );
      case "length_compare":
        return (
          <LengthCompareSVG
            itemALabel={question.itemALabel ?? "A"}
            itemBLabel={question.itemBLabel ?? "B"}
            itemAValue={question.itemAValue ?? 5}
            itemBValue={question.itemBValue ?? 3}
            itemAUnit={question.itemAUnit ?? "cm"}
            accent={colors.accent}
            bg={colors.bg}
            border={colors.border}
          />
        );
      case "weight_compare":
        return (
          <WeightCompareSVG
            weightALabel={question.weightALabel ?? "A"}
            weightBLabel={question.weightBLabel ?? "B"}
            weightAValue={question.weightAValue ?? 5}
            weightBValue={question.weightBValue ?? 3}
            weightUnit={question.weightUnit ?? "kg"}
            accent={colors.accent}
            bg={colors.bg}
            border={colors.border}
          />
        );
      case "weight_scale":
        return (
          <WeightScaleSVG
            scaleValue={question.scaleValue ?? 5}
            scaleMax={question.scaleMax ?? 10}
            scaleUnit={question.scaleUnit ?? "kg"}
            accent={colors.accent}
            bg={colors.bg}
            border={colors.border}
          />
        );
      case "volume_cup":
        return (
          <VolumeCupSVG
            cupFillMl={question.cupFillMl ?? 150}
            cupMaxMl={question.cupMaxMl ?? 250}
            accent={colors.accent}
            bg={colors.bg}
            border={colors.border}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <p
        className="text-base md:text-lg font-medium mb-5 text-center"
        style={{ color: "oklch(0.22 0.02 55)" }}
      >
        {question.prompt}
      </p>

      {MEASUREMENT_TIPS[question.variant] && (
        <div
          className="rounded-lg px-3 py-1.5 mb-3 text-xs text-center"
          style={{ backgroundColor: colors.bg, color: colors.accent }}
        >
          {MEASUREMENT_TIPS[question.variant]}
        </div>
      )}

      <div
        className="rounded-xl p-3 mb-2 flex items-center justify-center"
        style={{ backgroundColor: "oklch(0.97 0.01 210)" }}
      >
        {renderVisual()}
      </div>

      {answered && (
        <p
          className="text-sm mt-4 px-4 text-center"
          style={{ color: "oklch(0.40 0.10 130)" }}
        >
          {question.explanation}
        </p>
      )}

      <AnswerButtons
        choices={question.choices}
        correctValue={question.choices[correctIndex]}
        answered={answered}
        selectedIdx={selectedIdx}
        correctIdx={correctIdx}
        colors={colors}
        onChoice={onChoice}
      />
    </div>
  );
}
