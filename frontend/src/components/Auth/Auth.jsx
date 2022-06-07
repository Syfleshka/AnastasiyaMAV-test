import React from 'react';

import './Auth.scss';

function Auth({
  title,
  children,
}) {
  return (
    <section className="auth">
      <div className="auth__container">
        <h2 className="auth__title">{title}</h2>

        {children}

      </div>
    </section>
  );
}

export default Auth;
