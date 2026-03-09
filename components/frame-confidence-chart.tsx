"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

interface Props {
  frames: number[]
}

const FrameConfidenceChart = ({ frames }: Props) => {

  const data = frames.map((v, i) => ({
    frame: i + 1,
    confidence: v
  }))

  return (

    <div className="h-44">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart data={data}>

          <XAxis dataKey="frame" />

          <YAxis domain={[0,1]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="confidence"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  )

}

export default FrameConfidenceChart