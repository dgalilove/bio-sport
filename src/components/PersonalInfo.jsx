import { useState } from "react";
import { useNavigate } from "react-router-dom";


const INSTAGRAM_SEARCH_ENDPOINT = "https://dgalilove.app.n8n.cloud/webhook-test/player-info";

const LOGO_BACKGROUND_ENDPOINT = "https://dgalilove.app.n8n.cloud/webhook-test/logo-background";


export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    sportType: "",
  });

  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [searchingTeam, setSearchingTeam] = useState(false);
  const [teamResults, setTeamResults] = useState([]);
  const [savedTeamResults, setSavedTeamResults] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamSearch = async () => {
    if (!teamSearchQuery.trim()) {
      alert("Please enter a team or organization name to search.");
      return;
    }

    if (!formData.sportType.trim()) {
      alert("Please select a sport type before searching for teams.");
      return;
    }

    // Clear previous selection and results when starting a new search
    setSelectedTeam(null);
    setTeamResults([]);
    setSavedTeamResults([]);

    setSearchingTeam(true);
    try {
      const response = await fetch(INSTAGRAM_SEARCH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: teamSearchQuery,
          sportType: formData.sportType,
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        console.error("❌ Failed to parse as JSON, trying text:", e);
        const textResponse = await response.text();
        console.log("✅ Raw text response:", textResponse);
        try {
          result = JSON.parse(textResponse);
        } catch (parseError) {
          console.error("❌ Failed to parse text as JSON:", parseError);
          result = null;
        }
      }
      

      let results = [];
      
      if (Array.isArray(result)) {
        results = result;
        console.log("✅ Found direct array, length:", results.length);
      } 
      else if (result && typeof result === 'object') {
        const possiblePaths = ['data', 'body', 'results', 'items', 'teams', 'output', 'response'];
        for (const path of possiblePaths) {
          if (result[path] && Array.isArray(result[path])) {
            results = result[path];
            console.log(`✅ Found in result.${path}, length:`, results.length);
            break;
          }
        }
        
        if (results.length === 0 && (result.username || result.full_name || result.logo_url)) {
          results = [result];
          console.log("✅ Found single team object, converted to array");
        }
        
        if (results.length === 0) {
          for (const key in result) {
            if (Array.isArray(result[key]) && result[key].length > 0) {
              const firstItem = result[key][0];
              if (firstItem && (firstItem.username || firstItem.full_name || firstItem.logo_url)) {
                results = result[key];
                console.log(`✅ Found in result.${key}, length:`, results.length);
                break;
              }
            }
          }
        }
      }
      
      if (results.length > 0) {
        console.log("✅ All results:", results);
        console.log("✅ First result sample:", results[0]);
      }
      
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        if (result.logoUrl || result.primaryColor || result.secondaryColor) {
          console.error("❌ Received branding info instead of team search results!");
          console.error("❌ The n8n endpoint should return an array of teams when 'query' parameter is provided.");
          console.error("❌ Current response contains:", Object.keys(result));
          alert("⚠️ The search endpoint returned branding information instead of team results. Please configure your n8n workflow to return Instagram team search results when 'query' and 'sportType' are provided.");
          setTeamResults([]);
          return;
        }
      }
      
      if (results.length > 0) {
        setTeamResults(results);
        console.log(`✅ Displaying ${results.length} team results`);
      } else {
        setTeamResults([]);
        console.error("❌ Could not parse team results. Full response structure:", result);
        console.error("❌ Expected: An array of team objects with properties like: username, full_name, logo_url");
        console.error("❌ Actual response keys:", result && typeof result === 'object' ? Object.keys(result) : 'N/A');
        alert("No teams found in the response. Please check the console for details. Make sure your n8n workflow returns an array of team objects.");
      }
    } catch (err) {
      console.error("❌ Error searching Instagram:", err);
      alert("Failed to search Instagram. Check the console for details.");
      setTeamResults([]);
    } finally {
      setSearchingTeam(false);
    }
  };

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

  // Select a team from search results
  const selectTeam = (team) => {
    // Save current results before clearing them
    setSavedTeamResults([...teamResults]);
    setSelectedTeam(team);
    setTeamResults([]);
  };

  // Remove selected team and show search results again
  const removeSelection = () => {
    setSelectedTeam(null);
    // Restore the previous search results
    if (savedTeamResults.length > 0) {
      setTeamResults([...savedTeamResults]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sportType.trim()) {
      alert("Please select a sport type.");
      return;
    }

    if (!selectedTeam) {
      alert("Please search and select your team/organization from Instagram.");
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Step 1: Processing logo as background...");
      const teamLogoUrl = selectedTeam.logo_url || selectedTeam.logo_Url || null;
      
      if (teamLogoUrl) {
        const logoResponse = await fetch(LOGO_BACKGROUND_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logo: teamLogoUrl,
            sportType: formData.sportType,
            clubName: selectedTeam.full_name || selectedTeam.username || teamSearchQuery,
          }),
        });

        if (!logoResponse.ok) {
          throw new Error(`Logo processing failed: ${logoResponse.statusText}`);
        }

        const logoResult = await logoResponse.json();
        console.log("✅ Logo background processing response:", logoResult);
        if (logoResult.status === "processing" || logoResult.processing) {

          console.log("⏳ Waiting for logo background processing to complete...");
        }
      }

      // Step 2: Get branding/color information
      console.log("🔄 Step 2: Fetching branding information...");
      const response = await fetch("https://dgalilove.app.n8n.cloud/webhook-test/player-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sportType: formData.sportType,
          clubName: selectedTeam.full_name || selectedTeam.username || teamSearchQuery,
        }),
      });

      const result = await response.json();
      console.log("✅ Full response from n8n:", result);

      // Handle any structure (flat, nested, or wrapped)
      const data = result.data || result.body || result || {};

      // Handle logo
      let logoUrl = data.logoUrl || data.body?.logoUrl || null;

      // Ensure it's a proper Base64 string or data URL
      if (logoUrl && typeof logoUrl === "string") {
        if (!logoUrl.startsWith("http") && !logoUrl.startsWith("data:")) {
          logoUrl = `data:image/png;base64,${logoUrl}`;
        }
      } else {
        logoUrl = null;
      }

      // Handle colors safely
      const primaryColor =
        data.primaryColor || data.body?.primaryColor || "#1e1b4b";
      const secondaryColor =
        data.secondaryColor || data.body?.secondaryColor || "#ffffff";
      const thirdColor =
        data.thirdColor || data.body?.thirdColor || "#cccccc";
      const fourthColor =
        data.fourthColor || data.body?.fourthColor || "#000000";

      // Navigate to main
      navigate("/main", {
        state: {
          sportType: formData.sportType,
          logoUrl,
          primaryColor,
          secondaryColor,
          thirdColor,
          fourthColor,
          selectedTeam
        },
      });
    } catch (err) {
      console.error("❌ Error sending to n8n:", err);
      alert("Failed to send data to n8n. Check the console for details.");
      navigate("/main", {
        state: {
          sportType: formData.sportType,
          logoUrl: null,
          primaryColor: "#1e1b4b",
          secondaryColor: "#ffffff",
          thirdColor: "#ffffff",
          fourthColor: "#ffffff",
          selectedTeam
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
    <section className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-white/10"
        >
        <h2 className="text-3xl font-bold text-center tracking-wide">
          Find Your Team
        </h2>

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

        {/* Team/Organization Search via Instagram */}
        <div className="grid gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
          <label className="text-sm opacity-80 font-semibold">
            Find Your Team/Organization on Instagram
          </label>
          <p className="text-xs opacity-60">
            Note: Please select a sport type above before searching for teams.
          </p>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              type="text"
              placeholder="Search team or organization name..."
              value={teamSearchQuery}
              onChange={(e) => setTeamSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTeamSearch()}
              className="p-3 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={handleTeamSearch}
              disabled={searchingTeam || !teamSearchQuery.trim() || !formData.sportType.trim()}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchingTeam ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Selected Team Display */}
          {selectedTeam && (
            <div className="p-3 bg-green-500/20 border border-green-400/50 rounded-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  {(selectedTeam.logo_url || selectedTeam.logo_Url) && (
                    <img
                      src={formatLogoUrl(selectedTeam.logo_url || selectedTeam.logo_Url)}
                      alt={selectedTeam.full_name || selectedTeam.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-400"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-green-300 flex items-center gap-2">
                      ✓ Selected: {selectedTeam.full_name || selectedTeam.username}
                      {selectedTeam.is_verified && (
                        <span className="text-blue-400" title="Verified">✓</span>
                      )}
                    </p>
                    {selectedTeam.username && (
                      <p className="text-xs opacity-70 mt-1">@{selectedTeam.username}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeSelection}
                  className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white text-sm font-semibold rounded-md transition flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {teamResults.length > 0 && !selectedTeam && (
            <div className="mt-4">
              <p className="text-sm opacity-80 mb-3 font-semibold text-center">
                Found {teamResults.length} {teamResults.length === 1 ? 'team' : 'teams'} - Select your team:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                {teamResults.map((team, idx) => {
                  const teamName = team.full_name || team.username || 'Unknown Team';
                  // Handle both logo_url and logo_Url (case insensitive)
                  const rawLogo = team.logo_url || team.logo_Url || null;
                  const teamLogo = formatLogoUrl(rawLogo);
                  const teamUsername = team.username || null;
                  
                  return (
                    <button
                      key={`${team.username || idx}-${idx}`}
                      type="button"
                      onClick={() => {
                        console.log("✅ Team selected:", team);
                        selectTeam(team);
                      }}
                      className="p-3 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-yellow-400 rounded-lg text-left transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-lg hover:scale-[1.03] active:scale-[0.97]"
                    >
                      {/* Team Logo */}
                      <div className="flex-shrink-0 relative">
                        {teamLogo ? (
                          <img
                            src={teamLogo}
                            alt={teamName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-md"
                            onError={(e) => {
                              console.warn("⚠️ Failed to load logo for:", teamName, "URL:", teamLogo.substring(0, 50));
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-2 border-white/30 flex items-center justify-center shadow-md"
                          style={{ display: teamLogo ? 'none' : 'flex' }}
                        >
                          <span className="text-2xl">🏆</span>
                        </div>
                        {team.is_verified && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>

                      {/* Team Info */}
                      <div className="flex-1 min-w-0 w-full text-center grid gap-1">
                        <p className="font-semibold text-sm text-white truncate px-1">
                          {teamName}
                        </p>
                        {teamUsername && (
                          <p className="text-xs opacity-70 truncate px-1">@{teamUsername}</p>
                        )}
                        {team.score !== undefined && (
                          <p className="text-xs opacity-60 mt-0.5">
                            Score: {team.score}
                          </p>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      <div className="text-xs opacity-60 mt-1">
                        Click to select
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing logo background..." : "Continue"}
        </button>
        </form>
      </div>
    </section>
  );
}
