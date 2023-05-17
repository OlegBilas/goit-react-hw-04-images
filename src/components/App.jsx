import { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import fetchImages from '../api/api';
import Searchbar from './Searchbar';
import Loader from './Loader';
import ImageGallery from './ImageGallery';
import Button from './Button';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(STATUS.IDLE);

  const handleSubmit = queryFromForm => {
    setQuery(queryFromForm);
  };

  const handleClickLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  //запит по новому ключовому слову
  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    let imagesForState;
    setStatus(STATUS.PENDING);
    fetchImages(query, page)
      .then(responce => {
        if (responce.length === 0) {
          return Promise.reject();
        }

        if (page > 1) {
          // запит по тому ж самому ключовому слову
          imagesForState = [...images, ...responce];
        } else {
          imagesForState = responce;
        }

        setImages(imagesForState);
        setStatus(STATUS.RESOLVED);
      })
      .catch(() => {
        setStatus(STATUS.REJECTED);
        toast.warn("We didn't find any images on your request!");
      });
  }, [query, page]);

  return (
    <>
      <Searchbar className="Searchbar" onSummit={handleSubmit} />
      {status === STATUS.PENDING && <Loader />}
      {status === STATUS.RESOLVED && <ImageGallery Images={images} />}
      {images.length !== 0 && status === STATUS.RESOLVED && (
        <Button onClick={handleClickLoadMore} />
      )}
      {status === STATUS.REJECTED && <ToastContainer />}
    </>
  );
}
