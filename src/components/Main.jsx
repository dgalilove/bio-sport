import { useLocation } from "react-router-dom";
import fallbackLogo from "../assets/fallback-logo.png";

export default function Main() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="grid place-items-center min-h-screen text-white bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <h2 className="text-2xl">No athlete data found.</h2>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    height,
    weight,
    age,
    clubName,
    sportType,
    jerseyNumber,
    logoUrl,
    primaryColor,
    secondaryColor,
    thirdColor,
    fourthColor
  } = state;

  const displayLogo = logoUrl || fallbackLogo;
//   const bgColor = primaryColor || "#1e1b4b";
  const textColor = secondaryColor || "#ffffff";

  // 🎨 Build a smooth gradient background dynamically
const gradientBackground = `linear-gradient(135deg, 
  ${primaryColor} 0%, 
  ${thirdColor} 50%, 
  ${fourthColor} 100%)`;


  return (
    <section
  className="min-h-screen px-10 py-16 transition-all duration-700 grid place-items-center"
  style={{
    background: gradientBackground,
    color: textColor,
    backgroundBlendMode: "multiply",
  }}
>
  <div
  className="absolute inset-0 pointer-events-none opacity-30"
  style={{
    background: `radial-gradient(circle at 20% 20%, ${secondaryColor}40, transparent 70%)`,
    mixBlendMode: "overlay",
    animation: "pulse 6s ease-in-out infinite alternate",
  }}
></div>

      {/* Outer grid: two columns */}
      <div
        className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center"
        style={{ color: textColor }}
      >
        {/* Left side – Logo */}
        <div className="grid place-items-center">
          {displayLogo ? (
  <img
    src={
      displayLogo.startsWith("data:")
        ? displayLogo.trim()
        : displayLogo
    }
    alt={`${clubName || "Club"} logo`}
    className="w-60 h-60 object-contain rounded-xl shadow-lg transition-opacity duration-500"
    style={{
      borderColor: textColor,
      opacity: 1,
    }}
    onError={(e) => {
      console.warn("⚠️ Failed to load club logo, reverting to fallback.");
      e.target.onerror = null;
      e.target.src = fallbackLogo;
    }}
  />
) : (
  <img
    src={fallbackLogo}
    alt="Fallback logo"
    className="w-60 h-60 object-contain rounded-xl opacity-90"
  />
)}

        </div>

        {/* Right side – Info */}
        <div className="grid gap-8 text-center md:text-left justify-items-center">

          {/* Player Info Card */}
          <div
            className="grid gap-2 p-8 transition-all duration-500 justify-items-start"
            style={{
              borderColor: textColor,
            }}
          >
            <h3 className="text-3xl font-bold">
              {firstName} {lastName}
            </h3>
            <p>Club: {clubName}</p>
            <p>Sport: {sportType}</p>
            <p>Height: {height} cm</p>
            <p>Weight:{weight} kg</p>
            <p>Age: {age}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
