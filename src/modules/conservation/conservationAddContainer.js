// @flow
import ConservationAddComponent from './conservationComponent';
import inject from 'react-rxjs/dist/RxInject';
import { Observable } from 'rxjs';
import flowRight from 'lodash/flowRight';
import conservationForm from './conservationForm';
import props, { onUnMount } from './shared/formProps';
import lifeCycle from '../../shared/lifeCycle';
import appSession$ from '../../stores/appSession';
import store$, { clearStore$ } from './conservationStore';
import type { Props } from './conservationComponent';
import type { Location } from './shared/submit';
import type { History } from '../../types/Routes';
import type { ObjectData } from '../../types/object';

const { form$, updateForm$, clearForm$ } = conservationForm;

function addProps(
  storeProps: *,
  upstream: { history: History, location: Location<Array<ObjectData>> }
): Props {
  const sharedProps = props({
    ...storeProps,
    ...upstream,
    updateForm: updateForm$.next.bind(updateForm$)
  });
  return {
    ...sharedProps,
    clearStore: clearStore$.next.bind(clearStore$),
    clearForm: clearForm$.next.bind(clearForm$),
    loadingConservation: false
  };
}

function storeFactory() {
  return Observable.combineLatest(
    appSession$,
    store$,
    form$,
    (appSession, store, form) => ({
      appSession,
      store,
      form
    })
  );
}

type MountProps = {
  clearForm: Function,
  clearStore: Function
};

function onMount(props: MountProps) {
  props.clearForm();
  props.clearStore();
}

const ManagedAnalysisFormComponent = lifeCycle({ onMount, onUnMount })(
  ConservationAddComponent
);

export default flowRight([inject(storeFactory, addProps)])(ManagedAnalysisFormComponent);