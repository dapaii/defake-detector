"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

import VideoPreview from "./video-preview"
import AIScanner from "./ai-scanner"

type Region = {
  name: string
  value: number
}

const UploadVideo = () => {

  const [file, setFile] = useState<File | null>(null)
  const [videoURL, setVideoURL] = useState<string | null>(null)

  const [label, setLabel] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number>(0)

  const [frames, setFrames] = useState<string[]>([])
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null)

  const [heatmap, setHeatmap] = useState<string | null>(null)
  const [regions, setRegions] = useState<Region[]>([])

  const [showHeatmap, setShowHeatmap] = useState(false)

  const [loading, setLoading] = useState(false)
  const [heatmapLoading, setHeatmapLoading] = useState(false)

  const handleFile = (file: File) => {

    if (videoURL) URL.revokeObjectURL(videoURL)

    const url = URL.createObjectURL(file)

    setFile(file)
    setVideoURL(url)

    setLabel(null)
    setConfidence(0)
    setFrames([])
    setSelectedFrame(null)
    setHeatmap(null)
    setRegions([])

  }

  const resetVideo = () => {

    if (videoURL) URL.revokeObjectURL(videoURL)

    setFile(null)
    setVideoURL(null)
    setLabel(null)
    setConfidence(0)
    setFrames([])
    setSelectedFrame(null)
    setHeatmap(null)
    setRegions([])

  }

  const handleUpload = async () => {

    if (!file) return

    setLoading(true)

    const form = new FormData()
    form.append("video", file)

    try {

      const res = await axios.post(
        "https://dappai-deepfake-detector.hf.space/predict",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      setLabel(res.data.label)
      setConfidence(res.data.confidence)
      setFrames(res.data.frames || [])

    } catch (err) {

      console.error(err)

    }

    setLoading(false)

  }

  const fetchHeatmap = async (frameIndex: number) => {

    setHeatmapLoading(true)

    try {

      const res = await axios.post(
        "https://dappai-deepfake-detector.hf.space/heatmap",
        { frame_index: frameIndex }
      )

      setHeatmap(res.data.heatmap)
      setRegions(res.data.regions || [])

    } catch (err) {

      console.error(err)

    }

    setHeatmapLoading(false)

  }

  const toggleHeatmap = async () => {

    if (!showHeatmap && selectedFrame !== null) {

      if (!heatmap) {
        await fetchHeatmap(selectedFrame)
      }

    }

    setShowHeatmap(!showHeatmap)

  }

  useEffect(() => {

    return () => {
      if (videoURL) URL.revokeObjectURL(videoURL)
    }

  }, [videoURL])


  return (

    <div className="space-y-10">

      {/* TOP GRID */}

      <div className="grid lg:grid-cols-2 gap-8">

        {/* VIDEO PANEL */}

        <Card className="shadow-lg rounded-2xl border">

          <CardHeader>
            <CardTitle>Video Analysis</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {!videoURL && (

              <label className="cursor-pointer block">

                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                  }}
                  className="hidden"
                />

                <div className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-neutral-50 transition">

                  <p className="text-lg font-medium">
                    Upload Video
                  </p>

                  <p className="text-sm text-neutral-500 mt-1">
                    MP4 recommended
                  </p>

                </div>

              </label>

            )}

            {videoURL && (

              <div className="space-y-4">

                <div className="rounded-xl overflow-hidden border shadow-sm">
                  <VideoPreview url={videoURL} />
                </div>

                <button
                  onClick={resetVideo}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Replace Video
                </button>

              </div>

            )}

            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full h-12 text-lg rounded-xl"
            >
              {loading ? "Analyzing..." : "Detect Deepfake"}
            </Button>

            {loading && <AIScanner />}

          </CardContent>

        </Card>


        {/* RESULT PANEL */}

        <Card className="shadow-lg rounded-2xl border">

          <CardHeader>
            <CardTitle>AI Detection Result</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {label && (

              <>
                <div className="flex items-center justify-between">

                  <Badge
                    className="text-sm px-3 py-1"
                    variant={label === "Fake" ? "destructive" : "secondary"}
                  >
                    {label === "Fake"
                      ? "Deepfake Detected"
                      : "Authentic Video"}
                  </Badge>

                  <span className="text-sm text-neutral-500">
                    {confidence.toFixed(2)}%
                  </span>

                </div>

                <Progress value={confidence} className="h-3" />

              </>

            )}

            {selectedFrame !== null && (

              <div className="space-y-4">

                <div className="flex justify-between items-center">

                  <h3 className="font-medium">
                    Frame Viewer (Frame {selectedFrame + 1})
                  </h3>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleHeatmap}
                  >
                    {showHeatmap ? "Show Original" : "Show Heatmap"}
                  </Button>

                </div>


                <div className="grid grid-cols-[320px_1fr] gap-6">

                  <div className="relative">

                    <Image
                      src={`data:image/jpeg;base64,${frames[selectedFrame]}`}
                      width={320}
                      height={320}
                      alt="frame"
                      unoptimized
                      className="rounded-xl"
                    />

                    {showHeatmap && heatmap && (

                      <Image
                        src={`data:image/jpeg;base64,${heatmap}`}
                        width={320}
                        height={320}
                        alt="heatmap"
                        unoptimized
                        className="absolute top-0 left-0 opacity-60 rounded-xl"
                      />

                    )}

                  </div>


                  {showHeatmap && regions.length > 0 && (

                    <div className="space-y-4">

                      <h4 className="font-medium text-sm">
                        AI Attention Regions
                      </h4>

                      {regions.map((r, i) => (

                        <div key={i} className="space-y-1">

                          <div className="flex justify-between text-sm">

                            <span>{r.name}</span>

                            <span>
                              {(r.value * 100).toFixed(1)}%
                            </span>

                          </div>

                          <Progress value={r.value * 100} />

                        </div>

                      ))}

                    </div>

                  )}

                </div>

                {heatmapLoading && (
                  <p className="text-sm text-neutral-500">
                    Generating heatmap...
                  </p>
                )}

              </div>

            )}

          </CardContent>

        </Card>

      </div>


      {/* FRAME SCROLL */}

      {frames.length > 0 && (

        <Card className="shadow-lg rounded-2xl border">

          <CardHeader>
            <CardTitle>Frame Analysis</CardTitle>
          </CardHeader>

          <CardContent>

            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">

              {frames.map((frame, i) => {

                const isActive = selectedFrame === i

                return (

                  <div
                    key={i}
                    onClick={() => {

                      setSelectedFrame(i)
                      setHeatmap(null)
                      setShowHeatmap(false)
                      setRegions([])

                    }}
                    className={`
                      relative shrink-0 cursor-pointer transition
                      ${isActive ? "scale-105" : "hover:scale-105"}
                    `}
                  >

                    <Image
                      src={`data:image/jpeg;base64,${frame}`}
                      alt={`frame-${i}`}
                      width={110}
                      height={110}
                      unoptimized
                      className={`
                        rounded-lg border
                        ${isActive ? "border-blue-500 ring-2 ring-blue-200" : ""}
                      `}
                    />

                    <span className="absolute top-1 left-1 text-xs bg-black/70 text-white px-1 rounded">
                      {i + 1}
                    </span>

                  </div>

                )

              })}

            </div>

          </CardContent>

        </Card>

      )}

    </div>

  )

}

export default UploadVideo