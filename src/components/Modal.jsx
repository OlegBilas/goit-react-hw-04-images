import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const rootModal = document.getElementById('root-modal');

export default function Modal({ LargeImage, onClick }) {
  const hadleOverlayClick = event => {
    if (event.currentTarget === event.target) {
      onClick();
    }
  };

  useEffect(() => {
    const hadlePressEsc = event => {
      if (event.code === 'Escape') {
        onClick();
      }
    };

    window.addEventListener('keydown', hadlePressEsc);

    return () => {
      window.removeEventListener('keydown', hadlePressEsc);
    };
  }, [onClick]);

  return createPortal(
    <div className="Overlay" onClick={hadleOverlayClick}>
      <div className="Modal">
        <img src={LargeImage} alt="" />
      </div>
    </div>,
    rootModal
  );
}

Modal.propTypes = {
  LargeImage: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
