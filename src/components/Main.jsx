import { useLocation } from "react-router-dom";
import fallbackLogo from "../assets/fallback-logo.png";

// Helper function to format logo URL (handle base64 or URLs)
const formatLogoUrl = (logoUrl) => {
  if (!logoUrl) return null;

  // Already valid URL or data URI
  if (
    logoUrl.startsWith("data:") ||
    logoUrl.startsWith("http://") ||
    logoUrl.startsWith("https://")
  ) {
    return logoUrl;
  }

  // Base64 check (JPEG or PNG)
  if (logoUrl.startsWith("/") || (!logoUrl.includes("http") && logoUrl.length > 100)) {
    if (logoUrl.startsWith("/9j/") || logoUrl.startsWith("iVBORw")) {
      return `data:image/jpeg;base64,${logoUrl}`;
    }
    return `data:image/jpeg;base64,${logoUrl}`;
  }

  return logoUrl;
};

export default function Main() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="grid place-items-center min-h-screen text-white bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <h2 className="text-2xl">No team data found.</h2>
      </div>
    );
  }

  const {
    sportType,
    logoUrl,
    primaryColor,
    secondaryColor,
    thirdColor,
    fourthColor,
    selectedTeam,
    backgroundImage, // ⬅️ Added support for image_base64 background
  } = state;

  // Determine which logo to display
  const displayLogo = selectedTeam
    ? formatLogoUrl(selectedTeam.logo_url || selectedTeam.logo_Url) || fallbackLogo
    : logoUrl
    ? formatLogoUrl(logoUrl)
    : fallbackLogo;

  const textColor = secondaryColor || "#ffffff";

  // Smooth gradient background (fallback if no image)
  const gradientBackground = `linear-gradient(135deg, 
    ${primaryColor || "#1e1b4b"} 0%, 
    ${thirdColor || "#312e81"} 50%, 
    ${fourthColor || "#4c1d95"} 100%)`;

  // Base background with optional image from n8n
  const compositeBackground = backgroundImage
    ? `url(${backgroundImage}), ${gradientBackground}`
    : gradientBackground;

  return (
    <section
      className="relative min-h-screen px-10 py-16 transition-all duration-700 grid place-items-center overflow-hidden"
      style={{
        background: compositeBackground,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: textColor,
        backgroundBlendMode: backgroundImage ? "overlay" : "normal",
      }}
    >
      {/* Dynamic glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${secondaryColor || "#ffffff"}40, transparent 70%)`,
          mixBlendMode: "overlay",
          animation: "pulse 6s ease-in-out infinite alternate",
        }}
      ></div>

      {/* Main Content */}
      <div
        className="relative z-10 max-w-7xl w-full grid md:grid-cols-2 gap-12 items-stretch min-h-[60vh]"
        style={{ color: textColor }}
      >
        {/* Left Side – Logo */}
        <div className="w-full h-full flex items-center justify-center">
          {displayLogo && (
            <img
              src={displayLogo}
              alt={selectedTeam?.full_name || selectedTeam?.username || "Team Logo"}
              className="w-full h-full max-w-full max-h-full rounded-full object-cover flex-shrink-0"
              style={{
                borderColor: textColor,
                borderWidth: "4px",
                boxShadow: "0 0 25px rgba(255,255,255,0.15)",
              }}
            />
          )}
        </div>

        {/* Right Side – Team Info */}
        <div className="w-full h-full flex items-start">
          <div
            className="w-full grid gap-4 p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-500 shadow-lg"
            style={{
              borderColor: textColor,
            }}
          >
            <h2 className="text-3xl font-bold mb-2">Team Information</h2>

            {/* Sport Type */}
            {sportType && (
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-lg font-semibold opacity-80">Sport:</span>
                <span className="text-lg">{sportType}</span>
              </div>
            )}

            {/* Selected Team Info */}
            {selectedTeam && (
              <div className="grid gap-4 mt-2">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm opacity-80 mb-3 font-semibold">Instagram Team</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xl font-bold">
                          {selectedTeam.full_name || selectedTeam.username}
                        </p>
                        {selectedTeam.is_verified && (
                          <span className="text-blue-400 text-lg" title="Verified Account">
                            ✓
                          </span>
                        )}
                      </div>
                      {selectedTeam.username && (
                        <p className="text-sm opacity-70 mt-1">@{selectedTeam.username}</p>
                      )}
                      {selectedTeam.score !== undefined && (
                        <p className="text-xs opacity-60 mt-2">
                          Match Score: {selectedTeam.score}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reserved Player Info */}
            <div className="mt-8 p-6 bg-white/5 rounded-lg border border-dashed border-white/20">
              <p className="text-center text-sm opacity-60 italic">
                Player information will appear here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.25; }
          100% { opacity: 0.45; }
        }
      `}</style>
    </section>
  );
}
