import React, { useState, useEffect } from "react";
import "./Dictionary.css"; // Import your CSS file for styling

const Dictionary = () => {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false); // Loading state

  // Load favorite words and theme from session/local storage when the component mounts
  useEffect(() => {
    const savedFavorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  // Fetch word definition from API
  const fetchWordDefinition = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error("Word not found or API error.");
      }
      const data = await response.json();
      setDefinition(data[0]);
      setError("");
    } catch (err) {
      setError(err.message);
      setDefinition(null);
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!word.trim()) {
      setError("Please enter a word to search.");
      setDefinition(null);
    } else {
      setError(""); // Clear any previous error
      fetchWordDefinition();
    }
  };

  // Save the current word to favorites
  const saveToFavorites = () => {
    if (definition) {
      const isFavorite = favorites.some((fav) => fav.word === definition.word);
      if (!isFavorite) {
        const updatedFavorites = [...favorites, definition];
        setFavorites(updatedFavorites);
        sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      } else {
        console.log(`${definition.word} is already in favorites.`);
      }
    }
  };

  // Remove a word from favorites
  const removeFromFavorites = (wordToRemove) => {
    const updatedFavorites = favorites.filter((fav) => fav.word !== wordToRemove);
    setFavorites(updatedFavorites);
    sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Handle clicking on a favorite word
  const handleFavoriteClick = (favoriteWord) => {
    setDefinition(favoriteWord);
    setError("");
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save the theme to localStorage
  };

  return (
    <div className={`word-wave-container ${theme}`} data-testid="theme-container">
      <div className="dictionary-container">
        {/* Theme toggle button */}
        <button className="theme-toggle-button" onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </button>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="search-form">
          <label htmlFor="word-search">Search Word</label>
          <input
            id="word-search"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word"
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        {/* Error message display */}
        {error && <p className="error-message">{error}</p>}

        {/* Loading indicator */}
        {loading && <p>Loading...</p>}

        {/* Save to Favorites Button */}
        {definition && (
          <button className="start-button" onClick={saveToFavorites} aria-label="Save to favorites">
            <i className="fas fa-star"></i>
          </button>
        )}

        {/* Favorites display */}
        {favorites.length > 0 && (
          <div className="favorites-container">
            <h3>Your Favorite Words:</h3>
            <ul className="favorites-list" role="list" data-testid="favorites-list">
              {favorites.map((fav, index) => (
                <li key={fav.word} className="favorite-item" role="listitem">
                  <span onClick={() => handleFavoriteClick(fav)}>{fav.word}</span>
                  <button
                    onClick={() => removeFromFavorites(fav.word)}
                    className="remove-favorite-button"
                    aria-label={`Remove ${fav.word} from favorites`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Definition display */}
        {definition && (
          <div className="definition-container">
            <h2 className="word-title">{definition.word}</h2>
            {definition.phonetics &&
              definition.phonetics.map((phonetic, index) =>
                phonetic.audio ? (
                  <audio key={index} controls data-testid="audio-element">
                    <source src={phonetic.audio} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                ) : null
              )}

            {definition.meanings.map((meaning, index) => (
              <div key={index} className="meaning-section">
                <p className="part-of-speech">Part of Speech: {meaning.partOfSpeech}</p>
                {meaning.definitions.map((def, i) => (
                  <div key={i} className="definition-item">
                    <p className="definition">Definition: {def.definition}</p>
                    {def.example && <p className="example">Example: {def.example}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;
