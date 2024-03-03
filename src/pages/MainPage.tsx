import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Photo } from '../interface/photo.interface';
import styles from '../styles/MainPage.module.css';
import Modal from '../components/Modal';
import useSearchPhotos from '../Hooks/useSearchPhotos';
import usePopularPhotos from '../Hooks/usePopularPhotos';

const MainPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedPageNumber, setSearchPageNumber] = useState<number>(1);
  const [popularPageNumber, setPopularPageNumber] = useState<number>(1);

  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);


  const { loading, photos: images, hasMore } = useSearchPhotos(searchTerm, searchedPageNumber);
  const { loading: popularLoading, photos: popularImages, hasMore: popularHasMore } = usePopularPhotos(searchTerm, popularPageNumber);

  const searchedObserver = useRef<IntersectionObserver | null>(null);
  const popularObserver = useRef<IntersectionObserver | null>(null);

  const lastSearchedPhotoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
  
      if (searchedObserver.current) searchedObserver.current.disconnect();
  
      searchedObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSearchPageNumber((prevPageNumber) => {
            return prevPageNumber + 1;
          });
        }
      });
  
      if (node) searchedObserver.current.observe(node);
  
      return () => {
        if (searchedObserver.current) {
          searchedObserver.current.disconnect();
        }
      };
    },
    [loading, hasMore]
  );
  
  const lastPopularPhotoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (popularLoading) return;
  
      if (popularObserver.current) popularObserver.current.disconnect();
  
      popularObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && popularHasMore) {
          setPopularPageNumber((prevPageNumber) => {
            return prevPageNumber + 1;
          });
        }
      });
  
      if (node) popularObserver.current.observe(node);
  
      return () => {
        if (popularObserver.current) {
          popularObserver.current.disconnect();
        }
      };
    },
    [popularLoading, popularHasMore]
  );
  

  useEffect(() => {
    setPhotos(images);
  }, [images]);

  const fetchPhotos = useCallback(async (term: string) => {
    try {
      let fetchedPhotos: Photo[];
      if (term.trim() === '') {
        fetchedPhotos = [...popularImages];
      } else {
        fetchedPhotos = [...images];
      }
      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error('Error fetching photos', error);
    }
  }, [images, popularImages]);
  

  useEffect(() => {
    fetchPhotos(searchTerm);
  }, [searchTerm, fetchPhotos]);

  const onPhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setOpen(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchPageNumber(1);
    setPopularPageNumber(1);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        setSearchTerm(newSearchTerm);

        if (newSearchTerm.trim() === '') {
          setPhotos([]);
        }
      }, 1000)
    );
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      if (searchedObserver.current) {
        searchedObserver.current.disconnect();
      }

      if (popularObserver.current) {
        popularObserver.current.disconnect();
      }
    };
  }, [searchTimeout]);

  return (
    <div className={styles.main}>
      <div className={styles.input}>
        <input type="text" placeholder="ძებნა" onChange={handleSearchChange} />
      </div>
      <div className={styles.photosCollection}>
        {photos.length > 0 ? (
          photos.map((photo: Photo, index: number) => (
            photos.length === index + 1 ? (
              <div ref={hasMore ? lastSearchedPhotoElementRef : lastPopularPhotoElementRef} key={photo.id} className={styles.photo} onClick={() => onPhotoClick(photo)}>
                <img src={photo.urls.small} alt={photo.description} />
              </div>
            ) :
              <div key={photo.id} className={styles.photo} onClick={() => onPhotoClick(photo)}>
                <img src={photo.urls.small} alt={photo.description} />
              </div>
          ))
        ) : (
          <p>{loading ? 'Loading...' : 'No results found.'}</p>
        )}
      </div>
      {open && selectedPhoto && <Modal value={selectedPhoto} setOpen={setOpen} />}
    </div>
  );
};

export default MainPage;
