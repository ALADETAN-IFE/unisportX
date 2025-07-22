interface Country {
  id: string;       // Q-code (Q30, Q145...)
  name: string;     // Country name (e.g., Nigeria)
}

interface University {
  name: string;
  web_pages: string[];
}

interface WikidataBinding {
  country: { value: string };
  countryLabel: { value: string };
}

interface WikidataResponse {
  results: {
    bindings: WikidataBinding[];
  };
}

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

// Fetch countries from Wikidata
export const fetchCountries = async (): Promise<Country[]> => {
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
    const data: WikidataResponse = await res.json();
    const results: Country[] = data.results.bindings
      .filter((item: WikidataBinding) => item.countryLabel?.value)
      .map((item: WikidataBinding) => ({
        id: item.country.value.split('/').pop() || '',
        name: item.countryLabel.value,
      }));
    return results;
  } catch (err) {
    console.error("Failed to fetch countries", err);
    throw new Error("Could not load countries.");
  }
};

// Fetch universities from Hipo API
export const fetchUniversities = async (countryName: string): Promise<University[]> => {
  if (!countryName) {
    return [];
  }

  try {
    // const res = await fetch(`http://universities.hipolabs.com/search?country=${countryName}`);
    const res = await fetch(`https://universities.hipolabs.com/search?country=${countryName}`);
    const data: University[] = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch universities", err);
    throw new Error("Could not load universities.");
  }
};

export type { Country, University }; 