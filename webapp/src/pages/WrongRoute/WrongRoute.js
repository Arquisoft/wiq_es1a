import React from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const WrongRoute = () => {

  const { t } = useTranslation();

  return (
    <div id="notfound">
      <div class="notfound-bg">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="notfound">
        <div class="notfound-404">
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
