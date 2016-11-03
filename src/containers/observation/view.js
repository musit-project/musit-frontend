import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import ViewObservationPage from '../../components/observation/view';
import { loadObservation, getActorNameFromId } from '../../reducers/observation';
import { loadRoot } from '../../reducers/storageunit/grid';

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => I18n.t(key, markdown),
    doneBy: state.observation.data.doneBy,
    doneDate: state.observation.data.doneDate,
    registeredDate: state.observation.data.registeredDate,
    registeredBy: state.observation.data.registeredBy,
    observations: state.observation.data.observations,
    rootNode: state.storageGridUnit.root.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadObservation: (nodeId, observationId, callback) => {
      dispatch(loadObservation(nodeId, observationId, callback));
    },
    loadPersonNameFromId: (doneBy) => {
      dispatch(getActorNameFromId(doneBy));
    },
    loadStorageObj: (id) => {
      dispatch(loadRoot(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewObservationPage);
