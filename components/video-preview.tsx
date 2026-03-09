const VideoPreview = ({ url }: { url: string }) => {

  return (

    <div className="rounded-xl overflow-hidden border shadow-sm">

      <video
        src={url}
        controls
        className="w-full"
      />

    </div>

  )

}

export default VideoPreview