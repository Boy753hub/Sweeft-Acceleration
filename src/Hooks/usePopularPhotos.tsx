import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
import { Photo } from "../interface/photo.interface";

export default function usePopularPhotos(pageNumber: number) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);


  useEffect(() => {
    setLoading(true);
    setError(null);
    let cancel: Canceler;

    axios({
      method: "GET",
      url: "http://api.unsplash.com/photos",
      params: {
        page: pageNumber,
        per_page: 20,
        order_by: 'popular',
        client_id: `${import.meta.env.VITE_REACT_APP_API_KEY}`,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setPhotos((prevPhotos) => [...prevPhotos, ...res.data]);
        setHasMore(res.data.length > 0);
        setLoading(false);
        console.log('api called');
        console.log(res.data.results);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError("Error fetching photos");
        setLoading(false);
      });

    return () => cancel();
  }, [ pageNumber]);

  return { loading, error, photos, hasMore };
}

