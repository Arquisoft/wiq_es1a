import React from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const WrongRoute = () => {

  const { t } = useTranslation();

  return (
    <div>
      <div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div>
        <div>
          <h1>404</h1>
        </div>
        <h2>{t('pages.wrongroute.title')}</h2>
        <p>
          {t('pages.wrongroute.message')}
        </p>
        <Link to="/home">{t('pages.wrongroute.home')}</Link>
      </div>
    </div>
  );
};

export default WrongRoute;
