// @flow

import PropTypes from 'prop-types';
import inject from 'react-rxjs/dist/RxInject';
import flowRight from 'lodash/flowRight';
import AnalysisEventsViewComponent from './AnalysisEventsViewComponent';
import mount from '../../../shared/mount';
import Config from '../../../config';
import type { AppSession } from 'types/appSession';
import analysisEventsStore$, {
  getAnalysisEvents$,
  filterEvents$
} from './analysisEventsStore';
import { loadPredefinedTypes } from '../../../stores/predefined';

const data = {
  analysisEventsStore$,
  appSession$: { type: PropTypes.object.isRequired }
};
const commands = { getAnalysisEvents$, filterEvents$ };
const props = props => ({
  ...props,
  goToAnalysis: (appSession: AppSession, analysisId: number) =>
    props.history.push(
      Config.magasin.urls.client.analysis.viewAnalysis(appSession, analysisId)
    )
});

const LoadedAnalysisEventsViewComponent = mount(
  ({ getAnalysisEvents, appSession, predefined }) => {
    getAnalysisEvents({
      museumId: appSession.museumId,
      token: appSession.accessToken,
      analysisTypes: predefined.analysisTypes
    });
  }
)(AnalysisEventsViewComponent);

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  LoadedAnalysisEventsViewComponent
);