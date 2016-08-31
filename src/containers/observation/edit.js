import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'
import { suggestPerson, clearSuggest } from '../../reducers/suggest'
import { loadObservation, getActorNameFromId } from '../../reducers/observation'
import { addControl } from '../../reducers/control'
import Layout from '../../layout'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    suggest: state.suggest
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadObservation: (id) => {
    dispatch(loadObservation(id))
  },
  // Higher order function (or partial function if you like to call it that)
  onSaveObservation: (id, data) => {
    return (observations) => {
      dispatch(addControl(id, data, observations, {
        onSuccess: () => true /* hashHistory.goBack() */,
        onFailure: () => {
          /* console.log(error) */
          /* alert('This went terribly wrong!') */
        }
      }))
    }
  },
  onDoneBySuggestionsUpdateRequested: ({ value, reason }) => {
    if (reason && (reason === 'type') && value && value.length >= 2) {
      dispatch(suggestPerson('doneByField', value))
    } else {
      dispatch(clearSuggest('doneByField'))
    }
  },
  loadPersonNameFromId: (id) => {
    dispatch(getActorNameFromId(id))
  }
})


@connect(mapStateToProps, mapDispatchToProps)
export default class EditObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired
  }

  getObservationsFromLocationState() {
    return Object.keys(this.props.location.state).filter((o) => o.endsWith('OK')).map((o) => {
      switch (o) {
        case 'pestOK':
          return { type: 'pest', data: ObservationPage.defaultPestData }
        case 'temperatureOK':
          return { type: 'temperature', data: {} }
        case 'moldOK':
          return { type: 'mold', data: {} }
        case 'inertAirOK':
          return { type: 'inertAir', data: {} }
        case 'gasOK':
          return { type: 'gas', data: {} }
        case 'lightConditionsOK':
          return { type: 'lux', data: {} }
        case 'cleaningOK':
          return { type: 'cleaning', data: {} }
        case 'relativeHumidityOK':
          return { type: 'rh', data: {} }
        case 'alcoholOK':
          return { type: 'alcohol', data: {} }
        default:
          throw Error(`Invalid control ${o}`)
      }
    })
  }

  render() {
    return (
      <Layout
        title={this.props.translate('musit.observation.page.titles.edit')}
        translate={this.props.translate}
        breadcrumb={<span>Museum / Papirdunken / Esken inni der</span>}
        toolbar={<span />}
        leftMenu={
          <div
            style={{
              minHeight: 400
            }}
          />
        }
        content={
          <ObservationPage
            id={this.props.params.id}
            observations={this.getObservationsFromLocationState()}
            doneDate={this.props.location.state.doneDate}
            doneBy={this.props.location.state.doneBy}
            onSaveObservation={this.props.onSaveObservation(this.props.location.state)}
            suggest={this.props.suggest}
            translate={this.props.translate}
            mode="EDIT"
          />
        }
      />
    )
  }
}
