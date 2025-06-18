function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Battleship
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 mb-8">Coming Soon</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-full overflow-hidden">
          <div className="bg-blue-800/30 rounded-lg p-4 backdrop-blur-sm">
            <h2 className="text-white text-lg mb-4">Player Board</h2>
            <div
              className="grid grid-cols-10 gap-1 max-w-full aspect-square mx-auto"
              style={{
                maxWidth: 'min(100vw - 2rem, 300px)',
                touchAction: 'pinch-zoom',
              }}
            >
              {Array.from({ length: 100 }, (_, i) => (
                <div
                  key={i}
                  className="bg-blue-600/50 border border-blue-400/30 aspect-square rounded-sm"
                />
              ))}
            </div>
          </div>

          <div className="bg-blue-800/30 rounded-lg p-4 backdrop-blur-sm">
            <h2 className="text-white text-lg mb-4">Opponent Board</h2>
            <div
              className="grid grid-cols-10 gap-1 max-w-full aspect-square mx-auto"
              style={{
                maxWidth: 'min(100vw - 2rem, 300px)',
                touchAction: 'pinch-zoom',
              }}
            >
              {Array.from({ length: 100 }, (_, i) => (
                <div
                  key={i}
                  className="bg-blue-600/50 border border-blue-400/30 aspect-square rounded-sm"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="inline-block w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  )
}

export default App
