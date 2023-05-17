import React, { useState } from 'react';
import Modal from './Modal';

export default function ImageGalleryItem({
  Card: { id, webformatURL, largeImageURL },
}) {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  return (
    <li className="ImageGalleryItem">
      <img
        className="ImageGalleryItem-image"
        src={webformatURL}
        alt={`Picker with id=${id}`}
        onClick={toggleModal}
      />
      {showModal && <Modal LargeImage={largeImageURL} onClick={toggleModal} />}
    </li>
  );
}
