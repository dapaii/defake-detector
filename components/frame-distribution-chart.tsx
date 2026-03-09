"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

interface Props {
  frames: number[]
}

const FrameDistributionChart = ({ frames }: Props) => {

  const fake = frames.filter(v => v > 0.5).length
  const real = frames.length - fake

  const data = [
    { type: "Fake", value: fake },
    { type: "Real", value: real }
  ]

  return (

    <div className="h-40">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data}>

          <XAxis dataKey="type" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="value" fill="#ef4444" />

        </BarChart>

      </ResponsiveContainer>

    </div>

  )

}

export default FrameDistributionChart