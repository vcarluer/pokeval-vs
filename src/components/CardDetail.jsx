import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Segoe UI', sans-serif",
            size: 12
          },
          color: '#333'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}€`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `${value}€`,
          font: {
            family: "'Segoe UI', sans-serif",
            size: 11
          },
          color: '#666'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Segoe UI', sans-serif",
            size: 11
          },
          color: '#666'
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Price trend chart data
  const trendChartData = {
    labels: ['1 jour', '7 jours', '30 jours'],
    datasets: [
      {
        label: 'Prix moyen',
        data: [prices.avg1, prices.avg7, prices.avg30],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
        fill: true
      },
    ],
  };

  const trendChartOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: 'Évolution des prix',
        font: {
          family: "'Segoe UI', sans-serif",
          size: 16,
          weight: 'bold'
        },
        color: '#333',
        padding: 20
      }
    }
  };

  // Price comparison chart data
  const comparisonChartData = {
    labels: ['Prix le plus bas', 'Prix moyen', 'Tendance'],
    datasets: [
      {
        label: 'Prix',
        data: [prices.lowPrice, prices.averageSellPrice, prices.trendPrice],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const comparisonChartOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Comparaison des prix',
        font: {
          family: "'Segoe UI', sans-serif",
          size: 16,
          weight: 'bold'
        },
        color: '#333',
        padding: 20
      }
    }
  };

  const hasTrendData = prices.avg1 || prices.avg7 || prices.avg30;
  const hasComparisonData = prices.lowPrice && prices.averageSellPrice && prices.trendPrice;

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

            <div className="price-charts">
              {hasTrendData && (
                <div className="chart-container">
                  <Line options={trendChartOptions} data={trendChartData} />
                </div>
              )}
              
              {hasComparisonData && (
                <div className="chart-container">
                  <Bar options={comparisonChartOptions} data={comparisonChartData} />
                </div>
              )}

              {!hasTrendData && !hasComparisonData && (
                <p className="no-charts">Données insuffisantes pour afficher les graphiques</p>
              )}
            </div>
            
            {card.cardmarket?.url && (
              <a 
                href={card.cardmarket.url}
                target="_blank"
                rel="noopener noreferrer"
                className="market-link"
              >
                Voir sur Cardmarket ↗
              </a>
            )}
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
      url: PropTypes.string,
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
