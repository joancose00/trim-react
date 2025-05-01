import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHoldings, TokenHolding } from '../services/api';

const ResultsPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [partialData, setPartialData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Temporary debug code
        console.log('API Key in production:', process.env.REACT_APP_SOLSCAN_API_KEY ? 'Available' : 'Not available');
        
        if (!address) {
          setError('No address provided');
          setLoading(false);
          return;
        }

        const data = await getHoldings(address);
        
        if (data.length > 0) {
          setHoldings(data);
          setLoading(false);
          // Check if we might have partial data
          if (data.length < 5) {
            setPartialData(true);
          }
        } else {
          // No tokens found
          setHoldings([]);
          setLoading(false);
          // Could be an empty wallet or API issues
          setPartialData(true);
        }
      } catch (err) {
        console.error('Error fetching holdings:', err);
        setError('Failed to fetch holdings data');
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container" style={{ display: 'block' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Fetching wallet data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <Link to="/" className="back-button">Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Holdings for {address}</h1>

      <div className="results-container">
        {holdings.length > 0 ? (
          <div className="holdings-list">
            {holdings.map((token, index) => {
              // Function to handle IPFS URLs with multiple gateways
              const getImageUrl = (url: string | undefined) => {
                if (!url) return '/logo192.png';
                
                // List of reliable IPFS gateways
                const gateways = [
                  'https://ipfs.io/ipfs/',
                  'https://gateway.ipfs.io/ipfs/',
                  'https://dweb.link/ipfs/',
                  'https://cloudflare-ipfs.com/ipfs/'
                ];

                // Handle direct IPFS URL format
                if (url.startsWith('ipfs://')) {
                  const hash = url.replace('ipfs://', '');
                  return gateways[0] + hash;
                }
                
                // Handle URLs that already contain an IPFS hash
                if (url.includes('/ipfs/')) {
                  try {
                    const hash = url.split('/ipfs/')[1];
                    if (hash) return gateways[0] + hash;
                  } catch (e) {
                    console.log('Error parsing IPFS URL:', url);
                  }
                }

                // Handle direct hash format (QmXXX...)
                if (url.match(/^Qm[1-9A-Za-z]{44,}/)) {
                  return gateways[0] + url;
                }

                // Handle other IPFS gateway URLs
                const ipfsGateways = [
                  'cf-ipfs.com',
                  'mypinata.cloud',
                  'nftstorage.link',
                  'ipfs.infura.io'
                ];

                for (const gateway of ipfsGateways) {
                  if (url.includes(gateway)) {
                    try {
                      const hash = url.split('/ipfs/')[1];
                      if (hash) return gateways[0] + hash;
                    } catch (e) {
                      continue;
                    }
                  }
                }

                return url;
              };

              return (
                <div key={index} className="holding-item">
                  <div className="token-image-container">
                    <div className="image-loading"></div>
                    <img 
                      src={getImageUrl(token.metadata?.image)}
                      alt={token.metadata?.name || 'Token'}
                      className="token-image"
                      loading="lazy"
                      onLoad={(e) => {
                        e.currentTarget.classList.add('loaded');
                        e.currentTarget.classList.remove('error');
                        e.currentTarget.parentElement?.querySelector('.image-loading')?.classList.add('hidden');
                      }}
                      onError={(e) => {
                        const currentSrc = e.currentTarget.src;
                        let hash = '';
                        
                        // Improved IPFS hash extraction
                        if (currentSrc.includes('/ipfs/')) {
                          hash = currentSrc.split('/ipfs/')[1];
                        } else if (currentSrc.match(/Qm[1-9A-Za-z]{44,}/)) {
                          const match = currentSrc.match(/Qm[1-9A-Za-z]{44,}/);
                          if (match) hash = match[0];
                        }
                        
                        // Try next gateway if available
                        if (hash) {
                          const gateways = [
                            'https://ipfs.io/ipfs/',
                            'https://gateway.ipfs.io/ipfs/',
                            'https://dweb.link/ipfs/',
                            'https://cloudflare-ipfs.com/ipfs/'
                          ];
                          
                          // More robust gateway detection
                          let currentIndex = -1;
                          
                          for (let i = 0; i < gateways.length; i++) {
                            if (currentSrc.startsWith(gateways[i])) {
                              currentIndex = i;
                              break;
                            }
                          }
                          
                          // If we found the current gateway and there are more to try
                          if (currentIndex >= 0 && currentIndex < gateways.length - 1) {
                            e.currentTarget.src = gateways[currentIndex + 1] + hash;
                            return;
                          } else if (currentIndex === -1) {
                            // If we couldn't determine the current gateway, try the first one
                            e.currentTarget.src = gateways[0] + hash;
                            return;
                          }
                        }
                        
                        // If all gateways failed or not an IPFS URL, use fallback
                        e.currentTarget.src = '/logo192.png';
                        e.currentTarget.classList.add('error');
                        e.currentTarget.parentElement?.querySelector('.image-loading')?.classList.add('hidden');
                      }}
                    />
                  </div>
                  <div className="token-info">
                    <div className="token-name">{token.metadata?.name || 'Unknown Token'}</div>
                    <div className="token-symbol">{token.metadata?.symbol || '-'}</div>
                    {token.metadata?.description && (
                      <div className="token-description">{token.metadata.description}</div>
                    )}
                    <div className="token-details">
                      <div>
                        <span className="detail-label">Amount Held:</span>
                        <span className="detail-value">
                          {(token.holding / (10 ** token.decimals)).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="detail-label">Percentage of Supply:</span>
                        <span className="detail-value">
                          {(token.percentage * 100).toFixed(4)}%
                        </span>
                      </div>
                      <div>
                        <span className="detail-label">Total Supply:</span>
                        <span className="detail-value">
                          {(token.supply / (10 ** token.decimals)).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="detail-label">Contract Address:</span>
                        <span className="detail-value contract-address">
                          {token.metadata?.address || token.token_address || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No token holdings found for this address.</p>
        )}
      </div>
      <Link to="/" className="back-button">Back to Search</Link>
    </div>
  );
};

export default ResultsPage;
