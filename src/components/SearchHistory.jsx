import PropTypes from 'prop-types';
import '../styles/components/searchHistory.css';

function SearchHistory({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="search-history">
      <h3>Dernières recherches</h3>
      <div className="history-list">
        {history.map((item, index) => (
          <div key={index} className="history-item">
            <img src={item.card.images.small} alt={item.card.name} />
            <span className="card-name">{item.card.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

SearchHistory.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      card: PropTypes.shape({
        name: PropTypes.string.isRequired,
        images: PropTypes.shape({
          small: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SearchHistory;
