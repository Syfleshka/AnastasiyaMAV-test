/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Layout } from 'antd';

import { inject, observer } from 'mobx-react';

import './RouteMenu.scss';

import Header from '../../Header/Header';
import Login from '../../Auth/Login/Login';
import Register from '../../Auth/Register/Register';
import Profile from '../../Auth/Profile/Profile';
import MenuSider from '../../MenuSider/MenuSider';
import Users from '../../Users/Users';
import Contacts from '../../Contacts/Contacts';
import Docs from '../../Docs/Docs';

import { path } from '../../../utils/constants/constants';
import { errorMessage } from '../../../utils/constants/messages';

function RouteMenu({
  loggedIn,
  handleGetUserInfo,
  handleLangNotLogged,

  isLogo,
  handleShowLogo,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const checkToken = () => {
    const token = localStorage.getItem('token');

    if (token) {
      handleGetUserInfo(token)
        .then(() => {
          navigate(location.pathname);
        })
        .catch((err) => {
          navigate(path.signin);
          console.log(`${errorMessage.tokenErr} ${err}.`);
        });
    } else {
      navigate(path.signin);
      console.log(errorMessage.tokenErr);
    }
  };

  useEffect(() => {
    checkToken();

    if (!loggedIn) {
      const lang = localStorage.getItem('lang');

      handleLangNotLogged(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <>
      <Header
        isLogo={isLogo}
      />
      <main>
        <Layout className="app">
          <MenuSider
            handleShowLogo={handleShowLogo}
          />
          <Layout>
            <Routes>
              <Route
                exact
                path={path.signup}
                element={<Register />}
              />

              <Route
                exact
                path={path.signin}
                element={loggedIn ? (
                  <Navigate to={path.profile} />
                ) : (
                  <Login />
                )}
              />

              <Route
                exact
                path={path.profile}
                element={loggedIn ? (
                  <Profile />
                ) : (
                  <Navigate to={path.signin} />
                )}
              />

              <Route
                exact
                path={path.users}
                element={loggedIn ? (
                  <Users />
                ) : (
                  <Navigate to={path.signin} />
                )}
              />

              <Route
                exact
                path={path.contacts}
                element={loggedIn ? (
                  <Contacts />
                ) : (
                  <Navigate to={path.signin} />
                )}
              />

              <Route
                exact
                path={path.docs}
                element={loggedIn ? (
                  <Docs />
                ) : (
                  <Navigate to={path.signin} />
                )}
              />

              <Route
                path="*"
                element={loggedIn ? (
                  <Navigate to={path.profile} />
                ) : (
                  <Navigate to={path.signin} />
                )}
              />
            </Routes>
          </Layout>
        </Layout>
      </main>
    </>

  );
}

export default inject(({ UserStore }) => {
  const {
    loggedIn,
    handleGetUserInfo,
    handleLangNotLogged,
  } = UserStore;

  return {
    loggedIn,
    handleGetUserInfo,
    handleLangNotLogged,
  };
})(observer(RouteMenu));
