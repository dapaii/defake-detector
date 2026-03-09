import UploadVideo from "@/components/upload-video"

const Page = () => {

  return (

    <main className="min-h-screen bg-neutral-50 px-6 py-12">

      <div className="max-w-7xl mx-auto space-y-10">

        <div className="text-center space-y-3">

          <h1 className="text-5xl font-bold tracking-tight">
            Deepfake Detection AI
          </h1>

          <p className="text-neutral-500">
            AI-powered video forensic system detecting manipulated media
          </p>

        </div>

        <UploadVideo />

      </div>

    </main>

  )

}

export default Page