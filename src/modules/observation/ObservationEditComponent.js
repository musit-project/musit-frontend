import React, { PropTypes } from 'react';
import ObservationPage from './ObservationComponent';
import Layout from '../../layout';
import Breadcrumb from '../../layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import Actor from '../../models/actor';
import { hashHistory } from 'react-router';
import { emitError, emitSuccess } from '../../util/errors/emitter';

export default class EditObservationPage extends React.Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    rootNode: React.PropTypes.object
  }

  componentWillMount() {
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id, this.props.user.museumId);
    }
  }

  getObservationsFromLocationState() {
    return Object.keys(this.props.location.state)
      .filter((o) => o.endsWith('OK') && this.props.location.state[o] === false)
      .map((o) => {
        switch (o) {
        case 'pestOK':
          return { type: 'pest', data: ObservationPage.createDefaultPestData() };
        case 'temperatureOK':
          return { type: 'temperature', data: {} };
        case 'moldOK':
          return { type: 'mold', data: {} };
        case 'hypoxicAirOK':
          return { type: 'hypoxicAir', data: {} };
        case 'gasOK':
          return { type: 'gas', data: {} };
        case 'lightConditionOK':
          return { type: 'lightCondition', data: {} };
        case 'cleaningOK':
          return { type: 'cleaning', data: {} };
        case 'relativeHumidityOK':
          return { type: 'relativeHumidity', data: {} };
        case 'alcoholOK':
          return { type: 'alcohol', data: {} };
        default:
          throw Error(`Invalid control ${o}`);
        }
      }
      );
  }

  getDoneByFromLocationState() {
    return new Actor(this.props.location.state.doneBy);
  }

  render() {
    return (
      <Layout
        title={'Magasin'}
        breadcrumb={<Breadcrumb node={this.props.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.observation.page.titles.edit')}</h4>
            <ObservationPage
              id={this.props.params.id}
              user={this.props.user}
              observations={this.getObservationsFromLocationState()}
              doneDate={this.props.location.state.doneDate}
              doneBy={this.getDoneByFromLocationState()}
              onSaveObservation={(id, museumId, observationState) => {
                this.props.onSaveObservation(id, this.props.location.state, observationState, museumId, {
                  onSuccess: () => {
                    hashHistory.goBack();
                    emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') });
                  },
                  onFailure: (e) => {
                    emitError({ ...e, type: 'network' });
                  }
                });
              }}
              mode="EDIT"
            />
          </div>
        }
      />
    );
  }
}