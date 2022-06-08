import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import './Header.scss';

import { path } from '../../utils/constants/constants';
import { localize } from '../../utils/constants/locales/localize';

import logo from '../../assets/images/logo.png';

function Header({
  userLang,
  loggedIn,
  logOut,
  handleGetUserInfo,
  handleEditUserLang,
  handleLangNotLogged,

  isLogo,
}) {
  const location = useLocation();
  const locale = localize(userLang);

  const handleLang = async (lang) => {
    if (loggedIn) {
      const token = localStorage.getItem('token');

      await handleEditUserLang(token, lang);
      await handleGetUserInfo(token);
    } else {
      localStorage.setItem('lang', lang);

      await handleLangNotLogged(lang);
      localize(lang);
    }
  };

  return (
    <header className="header">
      {!loggedIn && (
      <NavLink
        to={path.main}
        className={`header__logo ${isLogo ? 'header__logo_true' : 'header__logo_false'}`}
      >
        <img
          src={logo}
          alt="logo"
        />
      </NavLink>
      )}
      <div className="header__menu_signin">
        <nav className="header__nav-sign">
          <ul className="header__location-items">
            {loggedIn ? (
              <>
                <li className="header__location-item">
                  <NavLink
                    to={path.profile}
                    className={`header__btn-navlink
                    ${
                      location.pathname === path.profile
                        ? 'header__btn-navlink_active'
                        : ''
                    }
                  `}
                  >
                    {locale.header.profile}
                  </NavLink>
                </li>

                <li className="header__location-item">
                  <NavLink
                    to={path.signin}
                    className="header__btn-sign"
                    onClick={() => logOut()}
                  >
                    {locale.header.logout}
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="header__location-item">
                  <NavLink to={path.signup} className="header__btn-sign">
                    {locale.header.signup}
                  </NavLink>
                </li>

                <li className="header__location-item">
                  <NavLink to={path.signin} className="header__btn-sign">
                    {locale.header.signin}
                  </NavLink>
                </li>
              </>
            )}

            <li className="header__location-item header__location-item_lang">
              <button
                type="button"
                onClick={() => handleLang('RU')}
                className="header__btn-lang"
              >
                {userLang === 'RU' ? 'RU' : 'ru'}
              </button>
              <button
                type="button"
                onClick={() => handleLang('EN')}
                className="header__btn-lang"
              >
                {userLang === 'EN' ? 'EN' : 'en'}
              </button>
              <button
                type="button"
                onClick={() => handleLang('DE')}
                className="header__btn-lang"
              >
                {userLang === 'DE' ? 'DE' : 'de'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default inject(({ UserStore }) => {
  const {
    userAdmin,
    userLang,
    loggedIn,
    logOut,
    handleGetUserInfo,
    handleEditUserLang,
    handleLangNotLogged,
  } = UserStore;

  return {
    userAdmin,
    userLang,
    loggedIn,
    logOut,
    handleGetUserInfo,
    handleEditUserLang,
    handleLangNotLogged,
  };
})(observer(Header));
