export interface Photo {
    id: string;
    width: number;
    height: number;
    description: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    likes: number;
    views?: number;
    downloads?: number;
}

export interface SearchedPhotos extends Photo {
    total: number;
    total_pages: number;
    results: Photo[];
}

export interface PhotoSearchResult {
    loading: boolean;
    error: boolean;
    Photos: string[];
    hasMore: boolean;
  }