import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

export type OverviewChartPoint = {
  name: string
  total: number
}

type OverviewProps = {
  data: OverviewChartPoint[]
}

export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{
            fill: 'var(--muted-foreground)',
            fontSize: 12,
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{
            fill: 'var(--muted-foreground)',
            fontSize: 12,
          }}
          tickFormatter={(value) => `${value}`}
        />

        <Tooltip
          cursor={{ fill: 'var(--muted)', opacity: 0.14 }}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--popover)',
            color: 'var(--popover-foreground)',
            fontSize: 12,
          }}
          // 👇 força cor do título (label do eixo X)
          labelStyle={{
            color: 'var(--popover-foreground)',
          }}
          // 👇 força cor do "Total no mês"
          itemStyle={{
            color: 'var(--popover-foreground)',
          }}
          formatter={(value) => [`${value} candidaturas`, 'Total no mês']}
          labelFormatter={(label) => `Mês: ${label}`}
        />

        <Bar
          dataKey="total"
          radius={[4, 4, 0, 0]}
          className="fill-[var(--chart-1)] opacity-80 hover:opacity-100 transition-opacity duration-150"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}