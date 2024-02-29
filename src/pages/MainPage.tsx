import { useState, useEffect } from 'react';
import { getPopularPhotos } from '../API/mainPageApi'; 
import { Photo } from '../interface/photo.interface';

const MainPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const params = { page: 1, per_page: 10, client_id: `${process.env.REACT_APP_API_KEY}` };
        const fetchedPhotos: Photo[] = await getPopularPhotos(params);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching photos", error);
      }
    };

    fetchPhotos();
  }, []); 

  return (
    <div>
      <h1>MainPage</h1>
      <div>
        {photos.map(photo => (
          <div key={photo.id}>
            <img src={photo.urls.small} alt={photo.description} />
            <p>{photo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
