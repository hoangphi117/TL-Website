"use client"

import { ChartColumn } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A linear line chart"

export interface LineChartItem {
  label: string
  value: number
}

export interface LineChartConfigItem {
  label: string
  color: string
}

export interface LineChartProps {
  chartData: LineChartItem[],
  chartConfig: Record<string, LineChartConfigItem>,
  dataKey: string,
  titelChart: string,
  subTitle: string
}

export function ChartLineLinear({chartData, chartConfig, titelChart, subTitle} : LineChartProps) {
  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle className="flex flex-row gap-1 items-center"> 
          <ChartColumn color="#f17604"/> 
          {titelChart}
        </CardTitle>
        <CardDescription className="hidden">đơn hàng trong tháng</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer 
          config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="value"
              type="linear"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-value)",
              }}
              activeDot={{
                r: 6,
              }}
            >
               <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          {subTitle}
        </div>
      </CardFooter>
    </Card>
  )
}
