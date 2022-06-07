/* eslint-disable react/prop-types */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { path } from '../../utils/constants/constants';
import { localize } from '../../utils/constants/locales/localize';

import './Form.scss';

function Form({
  children,
  buttonText,
  onSubmit,
  disabled,
  loading,
  error,

  userLang,
}) {
  const location = useLocation();
  const locale = localize(userLang);

  return (
    <form
      action="#"
      className="form"
    >

      {children}

      <div className="form__btn-wrap">
        {error
          ? (
            <span
              className="form__btn-submit-err"
            >
              {error}
            </span>
          ) : (<></>)}

        <button
          type="submit"
          aria-label={buttonText}
          onClick={onSubmit}
          className={
            disabled || loading
              ? 'form__btn-submit_disabled'
              : 'form__btn-submit'
          }
          disabled={disabled || loading}
        >
          {buttonText}
        </button>

        {
          location.pathname !== path.signin
          && location.pathname !== path.signup
          && (
            <Link
              to={path.contacts}
              className="form__link"
            >
              {locale.form.main}
            </Link>
          )
        }

        {
          location.pathname === path.signin
          && (
            <Link
              to={path.signup}
              className="form__link"
            >
              {locale.form.signup}
            </Link>
          )
        }

        {
          location.pathname === path.signup
          && (
            <Link
              to={path.signin}
              className="form__link"
            >
              {locale.form.signin}
            </Link>
          )
        }
      </div>
    </form>
  );
}

export default inject(({ UserStore }) => {
  const {
    userLang,
  } = UserStore;

  return {
    userLang,
  };
})(observer(Form));

/*
  signin: '/signin',
  signup: '/signup',
*/
