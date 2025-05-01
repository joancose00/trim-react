import axios from 'axios';

// In development, React requires environment variables to be accessed at build time
// Since env vars might not be loading properly, we'll use a direct value for now
// IMPORTANT: In production, this should be properly set up using environment variables

// Fallback to hardcoded API key if environment variable is not available
const SOLSCAN_API_KEY = process.env.REACT_APP_SOLSCAN_API_KEY;

export interface TokenMetadata {
  name: string;
  symbol: string;
  image: string;
  description?: string;
}

export interface TokenHolding {
  metadata: TokenMetadata;
  holding: number;
  percentage: number;
  supply: number;
  decimals: number;
}

export const getHoldings = async (address: string): Promise<TokenHolding[]> => {
  try {
    let allTokens: any[] = [];

    // Configure headers as per Solscan API requirements
    const headers = {
      'accept': 'application/json',
      'token': SOLSCAN_API_KEY // Using 'token' header as per the original Python code
    };

    // Fetch token accounts for the wallet address
    for (let page = 1; page <= 10; page++) {
      try {
        const url = `https://pro-api.solscan.io/v2.0/account/token-accounts?address=${address}&type=token&page=${page}&page_size=40&hide_zero=true`;
        
        const response = await axios.get(url, { headers });

        const tokenData = response.data.data || [];
        allTokens.push(...tokenData);

        if (tokenData.length < 40) {
          break;
        }
      } catch (error) {
        // Continue with next page even if this one fails
      }
    }

    console.log(`Found ${allTokens.length} tokens for address ${address}`);

    // Process each token to get metadata and calculate percentages
    const output: TokenHolding[] = [];
    
    for (const token of allTokens) {
      try {
        const ca = token.token_address;
        const holding = token.amount;

        const metaUrl = `https://pro-api.solscan.io/v2.0/token/meta?address=${ca}`;
        const metaResponse = await axios.get(metaUrl, { headers });

        const data = metaResponse.data;
        const supply = data.data.supply;
        const percentage = parseInt(holding) / parseInt(supply);
        const metadata = data.data.metadata;

        // Log metadata for debugging
        if (metadata && metadata.image) {
          console.log(`Token ${ca} image URL:`, metadata.image);
        }

        output.push({
          metadata,
          holding: parseInt(holding),
          percentage,
          supply: parseInt(supply),
          decimals: parseInt(token.token_decimals)
        });
      } catch (error) {
        // Continue with next token even if this one fails
      }
    }

    console.log(`Successfully processed ${output.length} out of ${allTokens.length} tokens`);

    // Sort holdings by percentage in descending order
    return output.sort((a, b) => b.percentage - a.percentage);
  } catch (error) {
    console.error(`Failed to fetch account data for ${address}:`, error);
    return [];
  }
};
