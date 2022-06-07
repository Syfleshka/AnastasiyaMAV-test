/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';

import './Modal.scss';

function Modal({
  isActiveModal,
  handleCloseModal,
  title,
  children,
}) {
  const handleStopPropagation = (evt) => evt.stopPropagation();

  return (
    <div
      onClick={handleCloseModal}
      className={isActiveModal ? 'modal modal_opened' : 'modal'}
    >
      <div
        onClick={handleStopPropagation}
        className={isActiveModal ? 'modal__content modal__content_opened' : 'modal__content'}
      >
        <h4 className="modal__title">
          {title}
        </h4>

        {children}

        <button
          type="button"
          aria-label="Закрыть"
          onClick={handleCloseModal}
          className="modal__btn-close"
        />
      </div>
    </div>
  );
}

export default Modal;
