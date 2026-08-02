import { QdrantClient } from '@qdrant/js-client-rest';

// Initialize the client using environment variables from your .env file
export const qdrant = new QdrantClient({
  url: import.meta.env.VITE_QDRANT_URL || process.env.QDRANT_URL,
  apiKey: import.meta.env.VITE_QDRANT_API_KEY || process.env.QDRANT_API_KEY,
});
