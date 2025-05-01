import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    navigate(`/results/${address}`);
  };

  return (
    <div className="container">
      <h1>Solana Wallet Holdings</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Solana wallet address" 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          Get Holdings
        </button>
      </form>
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Fetching wallet data...</div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
