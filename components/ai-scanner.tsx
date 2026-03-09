"use client"

const AIScanner = () => {

  return (

    <div className="relative rounded-lg overflow-hidden border">

      <div className="h-64 flex items-center justify-center bg-black text-white">

        <span className="text-sm opacity-80">
          AI analyzing frames...
        </span>

      </div>

      <div className="absolute inset-0 pointer-events-none">

        <div className="w-full h-1 bg-blue-500 animate-scan" />

      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0px) }
          100% { transform: translateY(250px) }
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>

    </div>

  )

}

export default AIScanner