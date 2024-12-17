import PropTypes from 'prop-types';
import '../styles/components/searchHistory.css';

function SearchHistory({ history = [], onCardSelect }) {
  console.log('SearchHistory rendered with:', JSON.stringify(history, null, 2));

  return (
    <div className="search-history">
      <h3>Dernières recherches</h3>
      {(!Array.isArray(history) || history.length === 0) ? (
        <div className="empty-history">
          Aucune recherche récente
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => {
            console.log('Rendering history item:', JSON.stringify(item, null, 2));
            return (
              <div 
                key={`${item.card.id}-${index}`} 
                className="history-item"
                onClick={() => onCardSelect(item.card)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onCardSelect(item.card);
                  }
                }}
              >
                <img 
                  src={item.card.images.small} 
                  alt={item.card.name} 
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    e.target.style.display = 'none';
                  }}
                />
                <span className="card-name">{item.card.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

SearchHistory.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        images: PropTypes.shape({
          small: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    })
  ),
  onCardSelect: PropTypes.func.isRequired
};

export default SearchHistory;
