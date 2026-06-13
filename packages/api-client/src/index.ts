export interface Movie {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  poster_path?: string;
}

export interface SuggestMoviesResponse {
  movies: Movie[];
}

export interface CurateMovieResponse {
  curation: string;
}

export interface DecisionPayload {
  winner: string;
  options: string[];
  is_custom: boolean;
  user_id?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async suggestMovies(genres: string, safeClassics: boolean = false): Promise<Movie[]> {
    const params = new URLSearchParams({
      genres,
      safeClassics: safeClassics.toString()
    });
    const res = await fetch(`${this.baseUrl}/api/suggest-movies?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch suggestions: ${res.statusText}`);
    }
    const data = await res.json();
    return data.movies || [];
  }

  async curateMovie(title: string, synopsis: string = '', signal?: AbortSignal): Promise<string> {
    const params = new URLSearchParams({
      title,
      synopsis
    });
    const res = await fetch(`${this.baseUrl}/api/curate-movie?${params.toString()}`, { signal });
    if (!res.ok) {
      throw new Error(`Failed to curate movie: ${res.statusText}`);
    }
    const data = await res.json();
    return data.curation || '';
  }

  async saveDecision(payload: DecisionPayload): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/decide`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Failed to save decision: ${res.statusText}`);
    }
    return await res.json();
  }
}
export default ApiClient;
