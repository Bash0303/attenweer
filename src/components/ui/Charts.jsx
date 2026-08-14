import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  LineChart as RLineChart,
  Line,
  PieChart as RPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts'

export function ChartTooltip({ active, payload, label, suffix = '' }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="chart-tooltip">
      {label && <p className="mb-1 text-[11px] uppercase tracking-wide opacity-80">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || p.stroke }}>
          {p.name}: <span className="font-bold">{p.value}{suffix}</span>
        </p>
      ))}
    </div>
  )
}

export function BarsChart({ data, dataKey, color = '#2a478e', height = 260, suffix = '', xKey = 'name' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ecf5" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip suffix={suffix} />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={34} />
      </RBarChart>
    </ResponsiveContainer>
  )
}

export function LinesChart({ data, series, height = 260 }) {
  const colors = ['#2a478e', '#d9a62e', '#10b981', '#6366f1']
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ecf5" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={colors[i % colors.length]}
            strokeWidth={2.5}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RLineChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({ data, height = 260, centerLabel, centerValue }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <RPieChart>
          <Tooltip content={<ChartTooltip suffix="" />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={90}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
        </RPieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-navy-900">{centerValue}</p>
            <p className="text-xs font-medium text-slate-500">{centerLabel}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function AreaTrend({ data, dataKey, color = '#2a478e', height = 260, suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ecf5" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip suffix={suffix} />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          name="Value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#grad-${dataKey})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
