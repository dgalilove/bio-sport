export default function Hero() {
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6">
      <h2 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
        Welcome to <span className="text-yellow-300">BioSport</span>
      </h2>
      <p className="max-w-xl text-lg opacity-90 leading-relaxed">
        Track your performance, train smarter, and push beyond your limits.
        BioSport brings data and design together for the ultimate athletic experience.
      </p>
      <button className="mt-8 px-6 py-3 bg-yellow-400 text-indigo-800 font-semibold rounded-xl hover:bg-yellow-300 transition">
        Get Started
      </button>
    </section>
  )
}
