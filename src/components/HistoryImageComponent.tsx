import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../styles/MainPage.module.css'
import { Photo } from '../interface/photo.interface';
import Modal from './Modal';
import useSearchPhotos from '../Hooks/useSearchPhotos';

const HistoryImageComponent = ({ value }: { value: string }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [searchedPageNumber, setSearchPageNumber] = useState<number>(1);
    const { loading, photos: fetchedPhotos, hasMore } = useSearchPhotos(value, searchedPageNumber);
  
    const searchedObserver = useRef<IntersectionObserver | null>(null);
  
    const lastSearchedPhotoElementRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (loading) return;
  
        if (searchedObserver.current) searchedObserver.current.disconnect();
  
        searchedObserver.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setSearchPageNumber((prevPageNumber) => prevPageNumber + 1);
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
  
    useEffect(() => {
      setPhotos([]);
      setSearchPageNumber(1);
    }, [value]);
  
    useEffect(() => {
      setPhotos((prevPhotos) => [...prevPhotos, ...fetchedPhotos]);
    }, [fetchedPhotos]);
  
    useEffect(() => {
      if (value.trim() !== '') {
        setPhotos(fetchedPhotos);
      }
    }, [value, fetchedPhotos]);
  
    const onPhotoClick = (photo: Photo) => {
      setSelectedPhoto(photo);
      setOpen(true);
    };
  
    return (
      <div>
        {value ? (
          <div className={styles.main}>
            <div className={styles.photosCollection}>
              {photos.length > 0 ? (
                photos.map((photo: Photo, index: number) => (
                  photos.length === index + 1 ? (
                    <div ref={lastSearchedPhotoElementRef} key={photo.id} className={styles.photo} onClick={() => onPhotoClick(photo)}>
                      <img src={photo.urls.small} alt={photo.description} />
                    </div>
                  ) : (
                    <div key={photo.id} className={styles.photo} onClick={() => onPhotoClick(photo)}>
                      <img src={photo.urls.small} alt={photo.description} />
                    </div>
                  )
                ))
              ) : (
                <p>{loading ? 'Loading...' : 'No results found.'}</p>
              )}
            </div>
            {open && selectedPhoto && <Modal value={selectedPhoto} setOpen={setOpen} />}
          </div>
        ) : (
          <div>
            select a history item
          </div>
        )}
      </div>
    );
  };
  
  export default HistoryImageComponent;