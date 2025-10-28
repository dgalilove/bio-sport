import { useNavigate } from "react-router-dom";

export default function Hero() {

    const navigate = useNavigate();
    return (
        <section
            className="
        grid place-items-center 
        text-center text-white 
        min-h-[calc(100vh-100px)] 
        bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500
        px-8
      "
        >
            <div className="grid gap-6 max-w-3xl">
                {/* Headline */}
                <h1 className="text-6xl font-extrabold leading-tight drop-shadow-lg">
                    Welcome to <span className="text-yellow-300">BioSport</span>
                </h1>

                {/* Subtext */}
                <p className="text-xl opacity-90 leading-relaxed">
                    Track your performance, train smarter, and push your limits.
                    BioSport combines data and design to elevate your athletic journey.
                </p>

                {/* Call-to-action */}
                <div className="grid place-items-center mt-4">
                    <button
                        onClick={() => navigate("/info")}
                        className="
              px-8 py-4 
              bg-yellow-400 text-indigo-900 
              font-semibold rounded-xl 
              hover:bg-yellow-300
              transition
            "
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </section>
    );
}
