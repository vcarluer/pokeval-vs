import PropTypes from 'prop-types';
import { useState } from 'react';

function CardDetail({ card, onBack }) {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!card) return null;

  const prices = card.cardmarket?.prices || {};
  
  const getTrendIndicator = (trendPrice, averagePrice) => {
    if (!trendPrice || !averagePrice) return null;
    const difference = trendPrice - averagePrice;
    if (difference > 0) {
      return { icon: '↗', color: 'trend-up', percentage: ((difference / averagePrice) * 100).toFixed(1) };
    } else if (difference < 0) {
      return { icon: '↘', color: 'trend-down', percentage: ((Math.abs(difference) / averagePrice) * 100).toFixed(1) };
    }
    return { icon: '→', color: 'trend-stable', percentage: '0.0' };
  };

  const trendIndicator = getTrendIndicator(prices.trendPrice, prices.averageSellPrice);

  return (
    <div className="card-detail">
      <div className="button-group">
        <button className="back-button" onClick={onBack}>
          Retour à la liste
        </button>
        <button className="reset-button" onClick={() => window.location.reload()}>
          Nouvelle analyse
        </button>
      </div>
      
      <div className="card-header">
        <img src={card.images.large} alt={card.name} />
        <div className="card-info">
          <h2>{card.name}</h2>
          <p className="set-name">{card.set.name}</p>
          <p className="rarity">{card.rarity || 'Non spécifié'}</p>
          {card.hp && <p className="hp">HP: {card.hp}</p>}
        </div>
      </div>

      <div className="price-details">
        <h3>Prix du marché</h3>
        {prices.averageSellPrice ? (
          <>
            <div className="main-prices">
              <div className="price-item main">
                <span>Prix moyen:</span>
                <span className="price">{prices.averageSellPrice.toFixed(2)}€</span>
              </div>
              {prices.trendPrice && (
                <div className={`price-item main trend ${trendIndicator?.color}`}>
                  <div className="trend-info">
                    <span>Tendance:</span>
                    {trendIndicator && (
                      <span className="trend-percentage">
                        {trendIndicator.icon} {trendIndicator.percentage}%
                      </span>
                    )}
                  </div>
                  <span className="price">{prices.trendPrice.toFixed(2)}€</span>
                </div>
              )}
            </div>
            
            <div className="price-details-toggle">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className={`toggle-button ${showDetails ? 'active' : ''}`}
              >
                {showDetails ? 'Masquer les détails' : 'Voir plus de détails'} {showDetails ? '▼' : '▶'}
              </button>
              
              {showDetails && (
                <div className="additional-prices">
                  {prices.lowPrice && (
                    <div className="price-item">
                      <span>Prix le plus bas:</span>
                      <span className="price">{prices.lowPrice.toFixed(2)}€</span>
                    </div>
                  )}
                  {prices.avg1 && (
                    <div className="price-item">
                      <span>Moyenne sur 1 jour:</span>
                      <span className="price">{prices.avg1.toFixed(2)}€</span>
                    </div>
                  )}
                  {prices.avg7 && (
                    <div className="price-item">
                      <span>Moyenne sur 7 jours:</span>
                      <span className="price">{prices.avg7.toFixed(2)}€</span>
                    </div>
                  )}
                  {prices.avg30 && (
                    <div className="price-item">
                      <span>Moyenne sur 30 jours:</span>
                      <span className="price">{prices.avg30.toFixed(2)}€</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="no-price">Prix non disponible</p>
        )}
      </div>
    </div>
  );
}

CardDetail.propTypes = {
  card: PropTypes.shape({
    name: PropTypes.string.isRequired,
    images: PropTypes.shape({
      large: PropTypes.string.isRequired,
    }).isRequired,
    set: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    rarity: PropTypes.string,
    hp: PropTypes.string,
    cardmarket: PropTypes.shape({
      prices: PropTypes.shape({
        averageSellPrice: PropTypes.number,
        lowPrice: PropTypes.number,
        trendPrice: PropTypes.number,
        avg1: PropTypes.number,
        avg7: PropTypes.number,
        avg30: PropTypes.number,
      }),
    }),
  }),
  onBack: PropTypes.func.isRequired,
};

export default CardDetail;
