import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    height: "",
    weight: "",
    age: "",
    clubName: "",
    sportType: "",
    jerseyNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://dgalilove.app.n8n.cloud/webhook/player-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sportType: formData.sportType,
          clubName: formData.clubName,
        }),
      });

      const result = await response.json();
      console.log("✅ Full response from n8n:", result);

      // 🧠 Handle any structure (flat, nested, or wrapped)
      const data =
        result.data || result.body || result || {};

      // 🖼️ Handle logo
      let logoUrl = data.logoUrl || "";
      if (logoUrl && !logoUrl.startsWith("http") && !logoUrl.startsWith("data:")) {
        logoUrl = `data:image/jpeg;base64,${logoUrl}`;
      }

      // 🎨 Handle colors
      const primaryColor =
        data.primaryColor || data?.body?.primaryColor || "#1e1b4b";
      const secondaryColor =
        data.secondaryColor || data?.body?.secondaryColor || "#ffffff";


      // ✅ Navigate to main
      navigate("/main", {
        state: {
          ...formData,
          logoUrl,
          primaryColor,
          secondaryColor,
        },
      });
    } catch (err) {
      console.error("❌ Error sending to n8n:", err);
      alert("Failed to send data to n8n. Check the console for details.");
      navigate("/main", {
        state: {
          ...formData,
          logoUrl: null,
          primaryColor: "#1e1b4b",
          secondaryColor: "#ffffff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const sportsList = [
    "Football",
    "Basketball",
    "Tennis",
    "Soccer",
    "Volleyball",
    "Baseball",
    "Hockey",
    "Rugby",
    "Swimming",
    "Boxing",
    "Running",
    "Golf",
    "Cycling",
    "Cricket",
    "Martial Arts",
    "Gymnastics",
    "Skating",
    "Surfing",
    "Esports",
  ];

  return (
    <section className="grid place-items-center min-h-[calc(100vh-100px)] bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-6">
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/10 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold text-center tracking-wide">
          Athlete Information
        </h2>

        {[
          { label: "First Name", name: "firstName" },
          { label: "Last Name", name: "lastName" },
          { label: "Height (cm)", name: "height" },
          { label: "Weight (kg)", name: "weight" },
          { label: "Age", name: "age" },
          { label: "Club Name", name: "clubName" },
        ].map((field) => (
          <div key={field.name} className="grid gap-2">
            <label className="text-sm opacity-80">{field.label}</label>
            <input
              type="text"
              name={field.name}
              placeholder={field.label}
              value={formData[field.name]}
              onChange={handleChange}
              className="p-3 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:border-yellow-400"
              required
            />
          </div>
        ))}

        <div className="grid gap-2">
          <label className="text-sm opacity-80">Sport Type</label>
          <input
            type="text"
            name="sportType"
            placeholder="e.g. Football"
            value={formData.sportType}
            onChange={handleChange}
            list="sports-options"
            className="p-3 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:border-yellow-400"
            required
          />
          <datalist id="sports-options">
            {sportsList.map((sport) => (
              <option key={sport} value={sport} />
            ))}
          </datalist>
        </div>

        <div className="grid gap-2">
          <label className="text-sm opacity-80">Jersey Number</label>
          <input
            type="text"
            name="jerseyNumber"
            placeholder="Enter number"
            value={formData.jerseyNumber}
            onChange={handleChange}
            className="p-3 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:border-yellow-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Continue"}
        </button>
      </form>
    </section>
  );
}
