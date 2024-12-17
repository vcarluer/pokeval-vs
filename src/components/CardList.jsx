import PropTypes from 'prop-types';

function CardList({ cards, onSelectCard, similarities }) {
  if (!cards || cards.length === 0) return null;

  // Find the index of the highest similarity score
  const maxSimilarityIndex = similarities.length > 0 
    ? similarities.reduce((maxIndex, current, index, arr) => 
        current.similarityScore > arr[maxIndex].similarityScore ? index : maxIndex, 0)
    : -1;

  const groupDifferences = (differences) => {
    const groups = {
      Critical: [],
      Major: [],
      Minor: []
    };
    
    differences.forEach(diff => {
      if (typeof diff === 'string') {
        groups.Minor.push({ description: diff, impact: 'Minor', penaltyApplied: 0 });
      } else {
        groups[diff.impact] = groups[diff.impact] || [];
        groups[diff.impact].push(diff);
      }
    });
    
    return groups;
  };

  return (
    <div className="cards-grid">
      {cards.map((card, index) => {
        const isHighestSimilarity = index === maxSimilarityIndex;
        const similarity = similarities[index];
        const hasCriticalDifferences = similarity?.differences?.some(
          diff => diff.impact === 'Critical'
        );
        
        return (
          <div 
            key={card.id} 
            className={`card-item ${isHighestSimilarity ? 'most-similar' : ''} ${
              hasCriticalDifferences ? 'has-critical' : ''
            }`}
            onClick={() => onSelectCard(card)}
          >
            <img src={card.images.small} alt={card.name} />
            <div className="card-info">
              <h3>{card.name}</h3>
              <p className="set-name">{card.set.name}</p>
              <p className="rarity">{card.rarity || 'Non spécifié'}</p>
              {card.hp && <p className="hp">HP: {card.hp}</p>}
              {similarity && (
                <div className="similarity-info">
                  <p className={`similarity ${hasCriticalDifferences ? 'critical-warning' : ''}`}>
                    Similarité: {similarity.similarityScore.toFixed(1)}%
                    {isHighestSimilarity && ' ⭐'}
                  </p>
                  <p className="confidence">
                    Confiance: {similarity.confidence.toFixed(1)}%
                  </p>
                  {similarity.method === 'ai' && similarity.differences && similarity.differences.length > 0 && (
                    <div className="differences-tooltip">
                      {hasCriticalDifferences ? '⚠️' : 'ℹ️'}
                      <div className="tooltip-content">
                        <strong>Différences détectées:</strong>
                        {Object.entries(groupDifferences(similarity.differences)).map(([impact, diffs]) => (
                          diffs.length > 0 && (
                            <div key={impact} className={`difference-group ${impact.toLowerCase()}`}>
                              <h4>{impact}</h4>
                              <ul>
                                {diffs.map((diff, i) => (
                                  <li key={i} className={`difference-item ${impact.toLowerCase()}`}>
                                    {diff.description}
                                    {diff.penaltyApplied && (
                                      <span className="penalty">
                                        {diff.penaltyApplied}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        ))}
                        {similarity.totalPenalties && (
                          <div className="total-penalties">
                            <strong>Total des pénalités:</strong>
                            <span className="penalty total">
                              {similarity.totalPenalties}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

CardList.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      images: PropTypes.shape({
        small: PropTypes.string.isRequired,
      }).isRequired,
      set: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      rarity: PropTypes.string,
      hp: PropTypes.string,
    })
  ).isRequired,
  onSelectCard: PropTypes.func.isRequired,
  similarities: PropTypes.arrayOf(
    PropTypes.shape({
      similarityScore: PropTypes.number.isRequired,
      differences: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            description: PropTypes.string.isRequired,
            impact: PropTypes.string.isRequired,
            penaltyApplied: PropTypes.number
          })
        ])
      ),
      confidence: PropTypes.number.isRequired,
      method: PropTypes.oneOf(['ai', 'error']).isRequired,
      totalPenalties: PropTypes.number
    })
  ),
};

CardList.defaultProps = {
  similarities: [],
};

export default CardList;
