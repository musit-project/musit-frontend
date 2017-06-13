// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import Config from '../../config';
import inject from 'react-rxjs/dist/RxInject';
import flowRight from 'lodash/flowRight';
import { makeUrlAware } from '../../stores/appSession';
import type { AppSession } from 'types/appSession';
import type { History } from 'types/Routes';

type Props = {
  appSession: AppSession,
  history: History
};

const administrations = [
  {
    title: 'musit.administration.analysisTypes.analysisTypes',
    url: Config.magasin.urls.client.administration.goToAnalysisTypes,
    description: 'musit.administration.analysisTypes.description'
  },
  {
    title: 'musit.administration.analysisPlaces.analysisPlaces',
    url: Config.magasin.urls.client.administration.goToAnalysisPlaces,
    description: 'musit.administration.analysisPlaces.description'
  },
  {
    title: 'musit.administration.sampleTypes.sampleTypes',
    url: Config.magasin.urls.client.administration.goToSampleTypes,
    description: 'musit.administration.sampleTypes.description'
  }
];

export const Administration = (props: Props) => {
  return (
    <div className="container">
      <div className="page-header">
        <h1>{I18n.t('musit.administration.administration')}</h1>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>{I18n.t('musit.administration.titleHeader')}</th>
            <th>{I18n.t('musit.administration.descriptionHeader')}</th>
          </tr>
        </thead>
        <tbody>
          {administrations.map((a, index) => {
            const url = a.url(props.appSession);
            return (
              <tr key={index}>
                <td>
                  <a
                    href={url}
                    onClick={e => {
                      e.preventDefault();
                      props.history.push(url);
                    }}
                  >
                    {I18n.t(a.title)}
                  </a>
                </td>
                <td>
                  {I18n.t(a.description)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const data = {
  appSession$: { type: PropTypes.object.isRequired }
};

export default flowRight([inject(data), makeUrlAware])(Administration);
