import React from 'react';
import { Grid, Row } from 'react-bootstrap';
import './AboutPage.css';
import { I18n } from 'react-i18nify';
import NorwegianTranslation from './AboutPage_no.html.jsx';
import EnglishTranslation from './AboutPage_en.html.jsx';
import Logos from '../../components/logos/Logos';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch/';

export const AboutPage = props => {
  const Translated =
    props.getLocale() === 'no' ? NorwegianTranslation : EnglishTranslation;
  return (
    <div>
      <main>
        <Grid>
          <Row className="row-centered">
            <div className="aboutPanel">
              <div>
                <Translated {...props} />
                <Logos />
              </div>
            </div>
          </Row>
        </Grid>
      </main>
    </div>
  );
};

export default inject({}, {}, { getLocale: () => I18n._locale })(AboutPage);
