'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { TooltipProps } from 'recharts'

import type { ChartConfig } from '~/components/core/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useChart,
} from '~/components/core/chart'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { formatTimestamp } from '~/utils/dates'

interface DataPoint {
  timestamp: number
  ethereum: number
  celestia: number
  avail: number
}

interface TooltipPayload {
  value: number
  name: string
  fill: string
}

interface Props {
  data: DataPoint[] | undefined
  chartConfig: ChartConfig
}
export function DaPercentageThroughputChart({ data, chartConfig }: Props) {
  const chartData = data?.map((item) => {
    const total = item.ethereum + item.celestia + item.avail
    const ethereumPercent = (item.ethereum / total) * 100
    const celestiaPercent = (item.celestia / total) * 100
    const availPercent = Math.min(
      (item.avail / total) * 100,
      100 - ethereumPercent - celestiaPercent,
    )
    return {
      timestamp: item.timestamp,
      ethereum: ethereumPercent,
      celestia: celestiaPercent,
      avail: availPercent,
    }
  })

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <ChartTooltip content={<CustomTooltip />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="ethereum"
          stackId="a"
          fill="var(--color-ethereum)"
          isAnimationActive={false}
        />
        <Bar
          dataKey="celestia"
          stackId="a"
          fill="var(--color-celestia)"
          isAnimationActive={false}
        />
        <Bar
          dataKey="avail"
          stackId="a"
          fill="var(--color-avail)"
          isAnimationActive={false}
        />
        <CartesianGrid vertical={false} horizontal={true} />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: number) => formatTimestamp(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          unit="%"
          mirror
          tick={{
            dy: -10,
          }}
        />
      </BarChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { config } = useChart()
  if (!active || !payload) return null
  return (
    <div className={tooltipContentVariants()}>
      <div className="text-secondary">{label}</div>
      <div className="grid gap-1.5">
        {(payload as TooltipPayload[]).map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-secondary">
                {config[entry.name]?.label}
              </span>
            </div>
            <span className="font-mono font-medium tabular-nums text-primary">
              {entry.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
