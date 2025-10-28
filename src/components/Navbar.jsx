export default function Navbar() {
  const navItems = ["BioSport", "Home", "About", "Contact"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
      <div
        className="
          mx-[30px]
          my-[10px]
          grid
          text-white
          h-[80px]
        "
        style={{
          gridTemplateColumns: `repeat(${navItems.length}, 1fr)`,
        }}
      >
        {navItems.map((item, idx) => (
          <div
            key={idx}
            className="
              grid place-items-center
              h-full w-full
              cursor-pointer
              select-none
              transition
              hover:text-yellow-300
              text-3xl font-bold
            "
          >
            {idx === 0 ? (
              <h1 className="tracking-tight">{item}</h1>
            ) : (
              <a href="#" className="block w-full text-center">
                {item}
              </a>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
