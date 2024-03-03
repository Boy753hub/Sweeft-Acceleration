import React, { FC, MouseEvent, useEffect, useState } from 'react';
import styles from '../styles/Modal.module.css';
import x from '../assets/X.png';
import { Photo, PhotoStatistics } from '../interface/photo.interface';
import { FaHeart } from 'react-icons/fa';
import { getPhotoStatisticts } from '../API/mainPageApi';

interface ModalProps {
  value: Photo;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: FC<ModalProps> = ({ value, setOpen }) => {
  const [imageStats, setImageStats] = useState<PhotoStatistics[] | undefined>(undefined);
  const params = {client_id: `${import.meta.env.VITE_REACT_APP_API_KEY}`,}

  const closeModal = () => {
    setOpen((last) => !last);
  };

  useEffect(() => {
    const fetchPhotoStatistics = async () => {
      try {
        const photoStatistics = await getPhotoStatisticts(value.id, params);
    
        // Assuming the structure of the response matches the provided example
        setImageStats(photoStatistics);
        console.log(photoStatistics);
      } catch (error) {
        console.error('Error fetching photo statistics:', error);
      }
    };
    

    fetchPhotoStatistics();
  }, [value.id]);

  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalBackground} onClick={closeModal}>
      <div className={styles.modalContent} onClick={stopPropagation}>
        <img src={x} alt="x" className={styles.x} onClick={closeModal} />
        <div className={styles.imageWrapper}>
          <img
            src={value.urls.regular}
            alt={value.description}
            className={styles.image}
          />
        </div>
        <div className={styles.desc}>
          <p>
            Likes: {value.likes} <FaHeart style={{ color: 'red', marginLeft: '5px' }} />
          </p>
          <p>
            Views: {imageStats?.views.total}
          </p>
          <p>
            Downloads: {imageStats?.downloads.total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;