import { useLocation } from "react-router-dom";
import fallbackLogo from "../assets/fallback-logo.png";

// Helper function to format logo URL (handle base64)
const formatLogoUrl = (logoUrl) => {
  if (!logoUrl) return null;
  
  // If it's already a data URL or http URL, return as is
  if (logoUrl.startsWith('data:') || logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }
  
  // If it looks like base64 (starts with /, doesn't contain http), convert it
  if (logoUrl.startsWith('/') || (!logoUrl.includes('http') && logoUrl.length > 100)) {
    // Check if it's a JPEG (starts with /9j/) or PNG (starts with iVBORw)
    if (logoUrl.startsWith('/9j/') || logoUrl.startsWith('iVBORw')) {
      return `data:image/jpeg;base64,${logoUrl}`;
    }
    // Default to JPEG for base64
    return `data:image/jpeg;base64,${logoUrl}`;
  }
  
  return logoUrl;
};

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
    sportType,
    logoUrl,
    primaryColor,
    secondaryColor,
    thirdColor,
    fourthColor,
    selectedTeam
  } = state;

  // Determine which logo to display - prioritize selectedTeam logo, then n8n logo, then fallback
  const displayLogo = selectedTeam 
    ? formatLogoUrl(selectedTeam.logo_url || selectedTeam.logo_Url) || fallbackLogo
    : (logoUrl ? formatLogoUrl(logoUrl) : fallbackLogo);
  
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

      {/* Main Content - Grid Layout */}
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-stretch min-h-[60vh]" style={{ color: textColor }}>
        
        {/* Left side – Logo (stretches to fill entire left side) */}
        <div className="w-full h-full flex items-center justify-center">
          {(selectedTeam?.logo_url || selectedTeam?.logo_Url) && (
            <img
              src={formatLogoUrl(selectedTeam.logo_url || selectedTeam.logo_Url)}
              alt={selectedTeam.full_name || selectedTeam.username}
              className="w-full h-full max-w-full max-h-full rounded-full object-cover flex-shrink-0"
              style={{
                borderColor: textColor,
              }}
            />
          )}
        </div>

        {/* Right side – Player Information (space reserved for future info) */}
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
                        <p className="text-xl font-bold">{selectedTeam.full_name || selectedTeam.username}</p>
                        {selectedTeam.is_verified && (
                          <span className="text-blue-400 text-lg" title="Verified Account">✓</span>
                        )}
                      </div>
                      {selectedTeam.username && (
                        <p className="text-sm opacity-70 mt-1">@{selectedTeam.username}</p>
                      )}
                      {selectedTeam.score !== undefined && (
                        <p className="text-xs opacity-60 mt-2">Match Score: {selectedTeam.score}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reserved space for future player information */}
            <div className="mt-8 p-6 bg-white/5 rounded-lg border border-dashed border-white/20">
              <p className="text-center text-sm opacity-60 italic">Player information will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
