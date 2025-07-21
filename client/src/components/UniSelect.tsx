import React, { useEffect, useState } from "react";

interface Country {
  id: string;       // Q-code (Q30, Q145...)
  name: string;     // Country name (e.g., Nigeria)
}

interface University {
  name: string;
  web_pages: string[];
}

const UniSelect: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

  // Fetch countries from Wikidata
  useEffect(() => {
    async function fetchCountries() {
      try {
        const query = `
          SELECT ?country ?countryLabel WHERE {
            ?country wdt:P31 wd:Q6256.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
          }
          ORDER BY ?countryLabel
        `;
        const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
          headers: { Accept: 'application/sparql-results+json' },
        });
        const data = await res.json();
        const results: Country[] = data.results.bindings
          .filter((item: any) => item.countryLabel?.value)
          .map((item: any) => ({
            id: item.country.value.split('/').pop(),
            name: item.countryLabel.value,
          }));
        setCountries(results);
      } catch (err) {
        console.error("Failed to fetch countries", err);
        setError("Could not load countries.");
      }
    }

    fetchCountries();
  }, []);

  // Fetch universities from Hipo API
  useEffect(() => {
    if (!selectedCountryName) return;

    const fetchUniversities = async () => {
      setLoading(true);
      console.log("selectedCountryName", selectedCountryName)
      try {
        const res = await fetch(`
            http://universities.hipolabs.com/search?country=${selectedCountryName}`
        //   https://universities.hipolabs.com/search?country=${selectedCountryName}`
        );
        // const eygwey = res
        // console.log("response", eygwey[0])
        const data: University[] = await res.json();
        setUniversities(data);
      } catch (err) {
        console.error("Failed to fetch universities", err);
        setError("Could not load universities.");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [selectedCountryName]);

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Select a Country & University</h2>

      {/* Country Select */}
      <div>
        <label className="block mb-1">Country:</label>
        <select
          value={selectedCountryName}
          onChange={(e) => {
            setSelectedCountryName(e.target.value);
            setSelectedUniversity(""); // Reset university when country changes
            setUniversities([]); // Clear old universities
          }}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Select Country --</option>
          {countries.map((country) => (
            <option key={country.id} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* University Select */}
      {selectedCountryName && (
        <div>
          <label className="block mb-1">
            Universities in {selectedCountryName}:
          </label>
          {loading ? (
            <p>Loading universities...</p>
          ) : (
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select University --</option>
              {universities.map((uni) => (
                <option key={uni.name} value={uni.name}>
                  {uni.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
              
{/* Selected University */}
      {selectedUniversity && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <strong>Selected University:</strong> {selectedUniversity}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-600 mt-2">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default UniSelect;