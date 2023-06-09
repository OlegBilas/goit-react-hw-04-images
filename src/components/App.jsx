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

  const handleClickLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  //запит по новому ключовому слову
  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    //пустий запит
    if (query.trim() === '') {
      return;
    }

    setStatus(STATUS.PENDING);

    fetchImages(query, page)
      .then(responce => {
        if (responce.length === 0 && page === 1) {
          return Promise.reject();
        }

        if (responce.length === 0 && page > 1) {
          // кінець колекції
          toast.warn(
            `It's the end of the collection on your request by key "${query}"!`
          );
          return setStatus(STATUS.RESOLVED);
        }

        if (page > 1) {
          // це був запит по тому ж самому ключовому слову
          setImages(prevState => [...prevState, ...responce]);
        } else {
          // запит по новому ключовому слову
          setImages(responce);
        }

        setStatus(STATUS.RESOLVED);
      })
      .catch(() => {
        setStatus(STATUS.REJECTED);
        toast.error("We didn't find any images on your request!");
      });
  }, [query, page]);

  return (
    <>
      <Searchbar className="Searchbar" onSummit={setQuery} />
      {status === STATUS.PENDING && <Loader />}
      {images.length !== 0 && status === STATUS.RESOLVED && (
        <ImageGallery Images={images} />
      )}
      {status === STATUS.RESOLVED && <Button onClick={handleClickLoadMore} />}
      {status === STATUS.REJECTED && <ToastContainer />}
    </>
  );
}
