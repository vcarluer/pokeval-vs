import { useState, useEffect } from 'react';
import { analyzeImage, compareImages } from './services/openaiService';
import { searchCards } from './services/pokemonTcgService';
import ImageUploader from './components/ImageUploader';
import CardList from './components/CardList';
import CardDetail from './components/CardDetail';
import SearchHistory from './components/SearchHistory';

// Import styles in order of specificity
import './styles/base.css';
import './styles/components/header.css';
import './styles/components/imageUploader.css';
import './styles/components/cardList.css';
import './styles/components/cardDetail.css';
import './styles/components/differences.css';
import './styles/components/searchHistory.css';
import './styles/responsive.css';

function App() {
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      console.log('Loading search history from localStorage:', saved);
      const parsed = saved ? JSON.parse(saved) : [];
      console.log('Parsed search history:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  });

  const [searchResults, setSearchResults] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [similarities, setSimilarities] = useState([]);

  useEffect(() => {
    try {
      console.log('Saving search history:', searchHistory);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [searchHistory]);

  const handleImageAnalyze = async (base64Image, file) => {
    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSelectedCard(null);
    setSimilarities([]);
    
    setUploadedImage(base64Image);

    try {
      const analysisResult = await analyzeImage(base64Image);
      const cards = await searchCards(analysisResult);
      
      if (cards.length === 0) {
        setError("Aucune carte trouvée");
      } else {
        setSearchResults(cards);
        
        // Update search history with the first card (most likely match)
        const newHistoryItem = {
          card: cards[0],
          image: base64Image,
          timestamp: Date.now()
        };

        console.log('Adding new history item:', newHistoryItem);

        setSearchHistory(prevHistory => {
          const filteredHistory = prevHistory.filter(item => item.card.id !== cards[0].id);
          const newHistory = [newHistoryItem, ...filteredHistory].slice(0, 5);
          console.log('Updated history:', newHistory);
          return newHistory;
        });
        
        // Compare images in background
        const similarityResults = await Promise.all(
          cards.map(async (card) => {
            try {
              const result = await compareImages(base64Image, card.images.small);
              return {
                ...result,
                method: 'ai'
              };
            } catch (err) {
              console.error('Error comparing with card:', card.id, err);
              return {
                similarityScore: 0,
                differences: ['Erreur de comparaison'],
                confidence: 0,
                method: 'error'
              };
            }
          })
        );
        
        setSimilarities(similarityResults);
      }
    } catch (err) {
      setError("Erreur lors de l'analyse de l'image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setSearchResults([]);
    setUploadedImage(null);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  return (
    <div className="app">
      <header>
        <h1>Pokeval</h1>
        <div className="subtitle">
          <p>Estimez la valeur de vos cartes Pokémon</p>
        </div>
      </header>
      
      <main>
        {!searchResults.length && !selectedCard && !loading && (
          <>
            <ImageUploader onImageAnalyze={handleImageAnalyze} />
            <SearchHistory 
              history={searchHistory} 
              onCardSelect={handleCardSelect}
            />
          </>
        )}
        
        {loading && !searchResults.length && (
          <div className="loading">Analyse en cours...</div>
        )}
        
        {error && (
          <div className="error">{error}</div>
        )}
        
        {uploadedImage && !selectedCard && (
          <div className="uploaded-image">
            <img src={uploadedImage} alt="Carte uploadée" />
          </div>
        )}
        
        {!selectedCard && searchResults.length > 0 && (
          <div className="search-results">
            <h2>Sélectionnez votre carte</h2>
            <CardList 
              cards={searchResults} 
              onSelectCard={handleCardSelect} 
              similarities={similarities}
            />
          </div>
        )}
        
        {selectedCard && (
          <CardDetail card={selectedCard} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}

export default App;
