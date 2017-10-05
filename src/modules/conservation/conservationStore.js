// @flow
import { simpleGet, simplePost, simplePut } from '../../shared/RxAjax';
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import type { Reducer } from 'react-rxjs/dist/RxStore';
import MusitConservation from '../../models/conservation';
import MusitActor from '../../models/actor';
import MusitObject from '../../models/object';
import flatten from 'lodash/flatten';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from '../../types/ajax';
import type { AppSession } from '../../types/appSession';
import type {
  ConservationStoreState,
  ConservationCollection,
  ObjectInfo,
  ConservationSave
} from '../../types/conservation';
import type { Actor } from '../../types/actor';
import Sample from '../../models/sample';
import type { SampleType } from 'types/sample';
import { KEEP_ALIVE } from '../../stores/constants';

export const initialState: ConservationStoreState = {
  conservationTypes: [],
  loading: false,
  conservation: null
};

type Flag = { ['loadingConservation']: boolean };

const setLoading$: Subject<Flag> = createAction('setLoading$');

const flagLoading = s => () => setLoading$.next(s);

export const getConservation$: Subject<*> = createAction('getConservation$');
const getConservationAction$: Observable<*> = getConservation$
  .do(flagLoading({ loadingConservation: true }))
  .switchMap(props =>
    MusitConservation.getConservationById(simpleGet)(props).flatMap(
      getConservationDetails(simpleGet, simplePost, props)
    )
  )
  .do(flagLoading({ loadingConservation: false }));

export type SaveProps = {
  id: ?number,
  appSession: AppSession,
  data: ConservationSave,
  callback: Callback<*>
};
export const saveConservation$: Subject<SaveProps> = createAction('saveConservation$');
const saveConservationAction = (post, put) => props => {
  return Observable.of(props)
    .do(flagLoading({ loadingConservation: true }))
    .flatMap(saveConservation(post, put))
    .do(flagLoading({ loadingConservation: false }));
};

export const updateConservation$: Subject<*> = createAction('updateConservation$');
const updateConservationAction$: Observable<*> = updateConservation$
  .do(flagLoading({ loadingConservation: true }))
  .switchMap(MusitConservation.editConservationEvent(simplePut))
  .do(flagLoading({ loadingConservation: false }));

export const clearStore$: Subject<*> = createAction('clearStore$');

type Actions = {
  saveConservation$: Subject<*>,
  setLoading$: Subject<Flag>,
  getConservationAction$: Observable<*>,
  updateConservationAction$: Observable<*>,
  clearStore$: Subject<*>
};

export const reducer$ = (
  actions: Actions,
  ajaxGet: AjaxGet<*>,
  ajaxPost: AjaxPost<*>,
  ajaxPut: AjaxPut<*>
): Observable<Reducer<ConservationStoreState>> => {
  return Observable.merge(
    actions.saveConservation$
      .switchMap(saveConservationAction(ajaxPost, ajaxPut))
      .map(saveResult => state => ({ ...state, saveResult })),
    actions.setLoading$.map(loading => state => ({ ...state, ...loading })),
    actions.clearStore$.map(() => () => initialState),
    Observable.merge(
      actions.getConservationAction$,
      actions.updateConservationAction$
    ).map(conservation => state => ({
      ...state,
      conservation
    }))
  );
};

export const store$ = (
  actions$: Actions = {
    saveConservation$,
    setLoading$,
    getConservationAction$,
    updateConservationAction$,
    clearStore$
  },
  ajaxGet?: AjaxGet<*> = simpleGet,
  ajaxPost?: AjaxPost<*> = simplePost,
  ajaxPut?: AjaxPost<*> = simplePut
) =>
  createStore(
    'conservationStore',
    reducer$(actions$, ajaxGet, ajaxPost, ajaxPut),
    initialState,
    KEEP_ALIVE
  );

const storeSingleton = store$();
export default storeSingleton;

type SampleTypes = {
  [string]: Array<SampleType>
};

export function getConservationDetails(
  ajaxGet: AjaxGet<*>,
  ajaxPost: AjaxPost<*>,
  props: {
    id: number,
    museumId: number,
    collectionId: string,
    token: string,
    callback?: Callback<*>,
    sampleTypes: SampleTypes
  }
): (conservation: ConservationCollection) => Observable<*> {
  return (conservation: ConservationCollection) =>
    MusitActor.getActors(ajaxPost)({
      actorIds: [
        conservation.registeredBy || '',
        conservation.updatedBy || '',
        conservation.doneBy || '',
        conservation.responsible || '',
        conservation.administrator || '',
        conservation.completedBy || ''
      ].filter(p => p),
      token: props.token
    })
      .map(actors => {
        if (actors) {
          const actorNames = getActorNames(actors, conservation);
          if (conservation.restriction) {
            return {
              ...conservation,
              ...actorNames
            };
          }
          return {
            ...conservation,
            ...actorNames
          };
        }
        return conservation;
      })
      .flatMap(conservation => {
        const affectedThings = conservation.affectedThings;
        if (affectedThings && affectedThings.length > 0) {
          // $FlowFixMe | We are passing an array to forkJoin which is not supported by flow-typed definition for rxjs.
          return Observable.forkJoin(
            affectedThings.map(getEventObjectDetails(props, ajaxGet))
          ).map(zipObjectInfoWithEvents(conservation));
        }
        return Observable.of(conservation);
      });
}

type AjaxParams = {
  museumId: number,
  collectionId: string,
  token: string,
  sampleTypes: SampleTypes
};

function getEventObjectDetails(
  props: AjaxParams,
  ajaxGet: AjaxGet<*>
): (t: any) => Observable<ObjectInfo> {
  return uuid => {
    const params = {
      id: uuid,
      museumId: props.museumId,
      collectionId: props.collectionId,
      token: props.token
    };
    return MusitObject.getObjectDetails(ajaxGet)(params).flatMap(objRes => {
      if (objRes.error) {
        return Sample.loadSample(ajaxGet)(params).flatMap(sample => {
          return MusitObject.getObjectDetails(ajaxGet)({
            ...params,
            id: sample.originatedObjectUuid
          }).map(sampleObjectRes => {
            const flattened = flatten(Object.values(props.sampleTypes));
            const sampleType = flattened.find(
              st => st.sampleTypeId === sample.sampleTypeId
            );
            return {
              sampleData: { ...sample, sampleType: sampleType },
              objectData: sampleObjectRes.response,
              ...sampleObjectRes.response
            };
          });
        });
      }
      return Observable.of({ objectData: objRes.response, ...objRes.response });
    });
  };
}

export function zipObjectInfoWithEvents(conservation: ConservationCollection) {
  return (arrayOfObjectDetails: Array<ObjectInfo>): ConservationCollection => {
    const actualValues = arrayOfObjectDetails.filter(a => a);
    if (actualValues.length === 0) {
      return conservation;
    }
    const events = conservation.events
      ? conservation.events.map(e => {
          const od = arrayOfObjectDetails.find(objD => {
            return (
              (objD.sampleData && objD.sampleData.objectId === e) ||
              (objD.objectData && objD.objectData.uuid === e)
            );
          });
          return od ? { ...od, ...e } : e;
        })
      : [];
    return { ...conservation, events: events, affectedThings: arrayOfObjectDetails };
  };
}

export function getActorNames(
  actors: Array<Actor>,
  conservation: ConservationCollection
) {
  return MusitActor.getMultipleActorNames(actors, [
    {
      id: conservation.updatedBy || '',
      fieldName: 'updatedByName'
    },
    {
      id: conservation.registeredBy || '',
      fieldName: 'registeredByName'
    },
    {
      id: conservation.doneBy || '',
      fieldName: 'doneByName'
    },
    {
      id: conservation.responsible || '',
      fieldName: 'responsibleName'
    },
    {
      id: conservation.administrator || '',
      fieldName: 'administratorName'
    },
    {
      id: conservation.completedBy || '',
      fieldName: 'completedByName'
    }
  ]);
}

const saveConservation = (ajaxPost, ajaxPut) => ({
  id,
  result,
  appSession,
  data,
  events,
  callback
}) => {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  const collectionId = appSession.collectionId;
  return getConservationUpsert(
    id,
    ajaxPut,
    museumId,
    data,
    token,
    ajaxPost
  ).map((conservation?: ConservationCollection) => {
    if (!conservation) {
      return Observable.empty();
    }
    Observable.of(conservation);
  });
};

function getConservationUpsert(id, ajaxPut, museumId, data, token, ajaxPost) {
  return id
    ? MusitConservation.editConservationEvent(ajaxPut)({
        id,
        museumId,
        data,
        token
      })
    : MusitConservation.saveConservationEvent(ajaxPost)({
        museumId,
        data,
        token
      });
}
