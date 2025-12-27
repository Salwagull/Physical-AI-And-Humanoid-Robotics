import { API_BASE_URL } from '../config';

/**
 * Send a question to the RAG backend and get an answer
 * @param {string} query - The question to ask
 * @param {number} topK - Number of chunks to retrieve (default: 5)
 * @returns {Promise<Object>} Response with answer, sources, and chunks
 */
export async function askQuestion(query, topK = 5) {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, top_k: topK }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}
