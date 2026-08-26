'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { max, scaleBand, scaleLinear } from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import type { SurveyRatingValue } from '@/features/serviceEntrySurveys/serviceEntrySurveysThunks';

export interface SurveyRatingChartDatum {
  id: string;
  label: string;
  distribution: Partial<Record<SurveyRatingValue, number>>;
}

export interface SurveyRatingLegendItem {
  value: SurveyRatingValue;
  label: string;
  color: string;
}

interface SurveyRatingStackedBarChartProps {
  data: SurveyRatingChartDatum[];
  legend: SurveyRatingLegendItem[];
  height?: number;
}

interface TooltipState {
  label: string;
  rating: string;
  count: number;
  percentage: number;
  color: string;
  x: number;
  y: number;
}

const MARGIN = { top: 28, right: 18, bottom: 58, left: 42 };
const MIN_WIDTH = 520;

function formatQuestionLabel(label: string) {
  return label.length > 18 ? `${label.slice(0, 17)}...` : label;
}

function roundedTopPath(width: number, top: number, bottom: number) {
  const radius = Math.min(10, Math.max(0, (bottom - top) / 2));
  return [
    `M 0 ${bottom}`,
    `L 0 ${top + radius}`,
    `Q 0 ${top} ${radius} ${top}`,
    `L ${width - radius} ${top}`,
    `Q ${width} ${top} ${width} ${top + radius}`,
    `L ${width} ${bottom}`,
    'Z',
  ].join(' ');
}

export function SurveyRatingStackedBarChart({
  data,
  legend,
  height = 300,
}: SurveyRatingStackedBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientId = useId().replace(/:/g, '');
  const [width, setWidth] = useState(MIN_WIDTH);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(MIN_WIDTH, entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const chart = useMemo(() => {
    const innerWidth = width - MARGIN.left - MARGIN.right;
    const innerHeight = height - MARGIN.top - MARGIN.bottom;
    const totalForQuestion = (item: SurveyRatingChartDatum) =>
      legend.reduce((total, rating) => total + (item.distribution[rating.value] ?? 0), 0);
    const maximum = max(data, totalForQuestion) ?? 0;
    const domainMaximum = Math.max(1, maximum);
    const x = scaleBand<string>()
      .domain(data.map((item) => item.id))
      .range([0, innerWidth])
      .padding(0.3);
    const y = scaleLinear().domain([0, domainMaximum]).nice(4).range([innerHeight, 0]);

    return { innerWidth, innerHeight, x, y, totalForQuestion, ticks: y.ticks(4) };
  }, [data, height, legend, width]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-x-auto rounded-2xl border border-border/50 bg-muted/[0.16] px-2 pb-3 pt-2"
    >
      <div className="min-w-[520px]" style={{ minWidth: MIN_WIDTH }}>
        <svg
          aria-label="Distribucion de calificaciones"
          className="block w-full overflow-visible"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            {legend.map((rating) => (
              <linearGradient
                key={rating.value}
                id={`${gradientId}-${rating.value}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor={rating.color} stopOpacity="1" />
                <stop offset="100%" stopColor={rating.color} stopOpacity="0.72" />
              </linearGradient>
            ))}
          </defs>
          <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            {chart.ticks.map((tick) => (
              <g key={tick} transform={`translate(0, ${chart.y(tick)})`}>
                <line stroke="var(--surface-border)" strokeDasharray="3 4" x2={chart.innerWidth} />
                <text fill="var(--muted-foreground)" fontSize="11" textAnchor="end" x={-10} y={4}>
                  {tick}
                </text>
              </g>
            ))}

            {data.map((item, itemIndex) => {
              const x = chart.x(item.id) ?? 0;
              const barWidth = chart.x.bandwidth();
              const total = chart.totalForQuestion(item);
              let accumulated = 0;

              return (
                <g key={item.id} transform={`translate(${x}, 0)`}>
                  <title>{item.label}</title>
                  <defs>
                    <clipPath id={`${gradientId}-clip-${item.id}`}>
                      <rect height={chart.innerHeight} rx={10} width={barWidth} />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#${gradientId}-clip-${item.id})`}>
                    {legend.map((rating, ratingIndex) => {
                      const count = item.distribution[rating.value] ?? 0;
                      const previous = accumulated;
                      accumulated += count;
                      const barHeight = Math.max(0, chart.y(previous) - chart.y(accumulated));
                      const barY = chart.y(accumulated);

                      const isTopSegment = legend
                        .slice(ratingIndex + 1)
                        .every((nextRating) => !item.distribution[nextRating.value]);
                      const transition = {
                        delay: itemIndex * 0.09 + ratingIndex * 0.035,
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1] as const,
                      };

                      return count ? (
                        <g key={rating.value}>
                          {isTopSegment ? (
                            <motion.path
                              animate={{
                                d: roundedTopPath(barWidth, barY, barY + barHeight),
                                opacity: 1,
                              }}
                              d={roundedTopPath(barWidth, chart.innerHeight, chart.innerHeight)}
                              fill={`url(#${gradientId}-${rating.value})`}
                              initial={{ opacity: 0 }}
                              transition={transition}
                              onMouseMove={(event) => {
                                const bounds =
                                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                                if (!bounds) return;
                                setTooltip({
                                  label: item.label,
                                  rating: rating.label,
                                  count,
                                  percentage: total ? (count / total) * 100 : 0,
                                  color: rating.color,
                                  x: event.clientX - bounds.left,
                                  y: event.clientY - bounds.top,
                                });
                              }}
                            />
                          ) : (
                            <motion.rect
                              animate={{ height: barHeight, opacity: 1, y: barY }}
                              fill={`url(#${gradientId}-${rating.value})`}
                              height={0}
                              initial={{ height: 0, opacity: 0, y: chart.innerHeight }}
                              transition={transition}
                              width={barWidth}
                              onMouseMove={(event) => {
                                const bounds =
                                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                                if (!bounds) return;
                                setTooltip({
                                  label: item.label,
                                  rating: rating.label,
                                  count,
                                  percentage: total ? (count / total) * 100 : 0,
                                  color: rating.color,
                                  x: event.clientX - bounds.left,
                                  y: event.clientY - bounds.top,
                                });
                              }}
                            />
                          )}
                        </g>
                      ) : null;
                    })}
                  </g>
                  {total ? (
                    <motion.text
                      animate={{ opacity: 1, y: -8 }}
                      fill="var(--muted-foreground)"
                      fontSize="11"
                      fontWeight="600"
                      initial={{ opacity: 0, y: 2 }}
                      textAnchor="middle"
                      transition={{ delay: itemIndex * 0.09 + 0.25, duration: 0.35 }}
                      x={barWidth / 2}
                    >
                      {total}
                    </motion.text>
                  ) : null}
                  <text
                    fill="var(--muted-foreground)"
                    fontSize="11"
                    textAnchor="middle"
                    x={barWidth / 2}
                    y={chart.innerHeight + 20}
                  >
                    {formatQuestionLabel(item.label)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <AnimatePresence>
        {tooltip ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="pointer-events-none absolute z-10 w-max rounded-xl border border-border/70 bg-popover px-3 py-2 text-xs text-popover-foreground shadow-xl"
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            style={{ left: Math.min(tooltip.x + 12, width - 175), top: tooltip.y + 12 }}
            transition={{ duration: 0.16 }}
          >
            <p className="max-w-48 truncate font-medium">{tooltip.label}</p>
            <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tooltip.color }} />
              {tooltip.rating}: {tooltip.count} ({tooltip.percentage.toFixed(0)}%)
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 px-2 text-xs font-medium text-muted-foreground">
        {legend.map((rating) => (
          <div key={rating.value} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: rating.color }} />
            {rating.label}
          </div>
        ))}
      </div>
    </div>
  );
}
