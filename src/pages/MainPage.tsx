import { useState, useEffect } from 'react';
import { getPopularPhotos } from '../API/mainPageApi'; 
import { Photo } from '../interface/photo.interface';
import styles from '../styles/MainPage.module.css';
import Modal from '../components/Modal';

const MainPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [open, setOpen] = useState<boolean>(false);


  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const params = { page: 1, per_page: 20, client_id: `${import.meta.env.VITE_REACT_APP_API_KEY}` };
        const fetchedPhotos: Photo[] = await getPopularPhotos(params);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching photos", error);
      }
    };

    fetchPhotos();
  }, []); 

  const onPhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setOpen(true);
  }

  return (
    <div className={styles.main}>
        <div className={styles.input}>
            <input type="text" placeholder='ძებნა'/>
        </div>
      <div className={styles.photosCollection}>
        {photos.map(photo => (
          <div key={photo.id} className={styles.photo} onClick={() => onPhotoClick(photo)}>
            <img src={photo.urls.small} alt={photo.description} />
          </div>
        ))}
      </div>
      {open && selectedPhoto && <Modal value={selectedPhoto} setOpen={setOpen} />}
    </div>
  );
};

export default MainPage;
