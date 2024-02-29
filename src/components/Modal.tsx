import React, { FC, MouseEvent } from 'react';
import styles from '../styles/Modal.module.css';
import x from '../assets/X.png';
import { Photo } from '../interface/photo.interface';

interface ModalProps {
  value: Photo;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: FC<ModalProps> = ({ value, setOpen }) => {
  const closeModal = () => {
    setOpen((last) => !last);
  };

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
      </div>
    </div>
  );
};

export default Modal;
