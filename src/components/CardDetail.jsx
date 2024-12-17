import PropTypes from 'prop-types';

function CardDetail({ card, onBack }) {
  if (!card) return null;

  const prices = card.cardmarket?.prices || {};

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
          <div className="prices">
            <div className="price-item">
              <span>Prix moyen:</span>
              <span className="price">{prices.averageSellPrice.toFixed(2)}€</span>
            </div>
            {prices.lowPrice && (
              <div className="price-item">
                <span>Prix le plus bas:</span>
                <span className="price">{prices.lowPrice.toFixed(2)}€</span>
              </div>
            )}
            {prices.trendPrice && (
              <div className="price-item">
                <span>Prix tendance:</span>
                <span className="price">{prices.trendPrice.toFixed(2)}€</span>
              </div>
            )}
          </div>
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
      }),
    }),
  }),
  onBack: PropTypes.func.isRequired,
};

export default CardDetail;
