// ... (your other imports)

import { useCallback, useEffect } from 'react';
import useLocalStorage from './useLocalStorage'; 
import axios, { Canceler } from 'axios';
import { useState } from 'react';
import { Photo } from '../interface/photo.interface';

export default function useSearchPhotos(query: string, pageNumber: number) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);

  const updateSearchHistory = useCallback((prevHistory: string[]) => {
    const newHistory = [...new Set([query, ...prevHistory])] as string[];
    return newHistory.slice(0, 5);
  }, [query]);
  
  useEffect(() => {
    if (pageNumber === 1) {
      setPhotos([]);
    }
  }, [query, pageNumber]);

  useEffect(() => {
    if (query) {
      const updatedHistory = updateSearchHistory(searchHistory);
      setSearchHistory(updatedHistory);
    }
  }, [query, searchHistory, updateSearchHistory, setSearchHistory]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let cancel: Canceler;

    axios({
      method: 'GET',
      url: 'http://api.unsplash.com/search/photos',
      params: { page: pageNumber, per_page: 20, query: query, client_id: `${import.meta.env.VITE_REACT_APP_API_KEY}` },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setPhotos((prevPhotos) => {
          const newPhotos = res.data.results;
          const filteredPhotos = newPhotos.filter((newPhoto: Photo) => !prevPhotos.some((prevPhoto) => prevPhoto.id === newPhoto.id));
          const allPhotos = [...prevPhotos, ...filteredPhotos];
          return allPhotos;
        });
        setHasMore(res.data.results.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError('Error fetching photos');
        setLoading(false);
      });

    return () => {
      if (cancel) cancel();
    };
  }, [query, pageNumber]);

  return { loading, error, photos, hasMore, searchHistory };
}
