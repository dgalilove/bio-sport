    import { useLocation } from "react-router-dom";
    import { Zap } from "lucide-react";
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
    } = state;

    const displayLogo = logoUrl || fallbackLogo;

    // 🎨 Dynamic color logic
    const bgColor = primaryColor || "#1e1b4b"; // background
    const textColor = secondaryColor || "#ffffff"; // text / accent

    

    return (
        <section
        className="min-h-screen px-10 py-16 grid place-items-center transition-all duration-500"
        style={{
            backgroundColor: bgColor,
            color: textColor,
        }}
        >
        <div className="max-w-xl w-full text-center space-y-10">
            {/* Jersey Badge */}
            <div className="flex justify-center">
            <div
                className="px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2"
                style={{
                background: textColor,
                color: bgColor,
                boxShadow: `0 0 25px ${textColor}99`,
                }}
            >
                <Zap className="w-6 h-6" />
                <span className="text-lg font-semibold">
                Jersey #{jerseyNumber || "?"}
                </span>
            </div>
            </div>

            {/* Club Logo */}
            <div className="flex justify-center">
            <img
                src={displayLogo}
                alt={`${clubName || "Club"} logo`}
                className="w-40 h-40 object-contain "
                style={{
                borderColor: textColor,
                backgroundColor: `${textColor}15`,
                }}
                onError={(e) => {
                e.target.src = fallbackLogo;
                }}
            />
            </div>

            {/* Player Info Card */}
            <div
            className="p-8 rounded-2xl border space-y-4 transition-all duration-500"
            style={{
                backgroundColor: `${textColor}10`,
                borderColor: textColor,
            }}
            >
            <h3 className="text-2xl font-bold">
                {firstName} {lastName}
            </h3>
            <p>🏆 <strong>Club:</strong> {clubName}</p>
            <p>⚽ <strong>Sport:</strong> {sportType}</p>
            <p>📏 <strong>Height:</strong> {height} cm</p>
            <p>⚖️ <strong>Weight:</strong> {weight} kg</p>
            <p>🎂 <strong>Age:</strong> {age}</p>
            </div>
        </div>
        </section>
    );
    }
