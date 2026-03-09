"use client"

interface Props {
  frames: number[]
}

const TimelineDetection = ({ frames }: Props) => {

  return (

    <div className="space-y-2">

      <h3 className="text-sm font-medium">
        Fake Detection Timeline
      </h3>

      <div className="flex gap-1">

        {frames.map((v, i) => {

          const fake = v > 0.5

          return (

            <div
              key={i}
              className={`h-6 flex-1 rounded-sm ${
                fake
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
              title={`Frame ${i + 1}`}
            />

          )

        })}

      </div>

      <div className="flex justify-between text-xs text-muted-foreground">

        <span>Start</span>
        <span>End</span>

      </div>

    </div>

  )

}

export default TimelineDetection