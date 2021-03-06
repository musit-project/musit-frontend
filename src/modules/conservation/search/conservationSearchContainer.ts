// @flow

import { Observable } from 'rxjs';
import { inject } from 'react-rxjs';
import { conservationSearch } from '../../../models/conservation/conservationSearch';
import createSearchStore from '../../../search/searchStore';
import { ChangePage } from '../../../search/searchStore';
import appSession$ from '../../../stores/appSession';
import { simpleGet } from '../../../shared/RxAjax';
import ConservationSearchComponent from './conservationSearchComponent';
import { SearchResult } from '../../../types/search';
import { ConservationSearchProps } from '../../../models/conservation/conservationSearch';
import { History } from 'history';
import Config from '../../../config';
import { loadPredefinedConservationTypes } from '../../../stores/predefinedConservationLoader';
import predefined$ from '../../../stores/predefinedConservation';
import { ConservationType } from '../../../types/conservation';
import { TODO, Maybe } from '../../../types/common';

const searchEndpoint: (
  p: ConservationSearchProps
) => Observable<SearchResult> = conservationSearch(simpleGet);

const { store$, actions } = createSearchStore('conservation', searchEndpoint, props => ({
  queryParam: props.queryParam,
  from: props.from,
  limit: props.limit,
  museumId: props.museumId,
  collectionIds: props.collectionIds,
  token: props.token
}));

const stores = () =>
  Observable.combineLatest(appSession$, store$, predefined$, (a, s, p) => ({
    appSession: a,
    searchStore: s,
    predefined: p
  }));

const props = (storeProps: TODO, upstream: { history: History }) => {
  return {
    onSearch: () => {
      actions.setLoading$.next();
      actions.search$.next({
        from: 0,
        limit: storeProps.searchStore.limit,
        queryParam: storeProps.searchStore.queryParam,
        museumId: storeProps.appSession.museumId,
        collectionIds: storeProps.appSession.collectionId,
        token: storeProps.appSession.accessToken
      });
      actions.setQueryParam$.next(storeProps.searchStore.queryParam);
    },
    onChangePage: (page: ChangePage) => {
      actions.setLoadingSelectPage$.next();
      actions.selectPage$.next({ page, appSession: storeProps.appSession });
      actions.setQueryParam$.next(storeProps.searchStore.queryParam);
    },
    onChangeQueryParam: (name: string, value: string) => {
      actions.setStore$.next(storeProps.searchStore);
      actions.changeQuery$.next({ name, value });
    },
    goToConservation: (id: number, subEventId: number) => {
      id
        ? upstream.history.push(
            Config.magasin.urls.client.conservation.viewConservationForExpandedSubEvent(
              storeProps.appSession,
              id,
              subEventId
            )
          )
        : upstream.history.push(
            Config.magasin.urls.client.conservation.viewConservation(
              storeProps.appSession,
              subEventId
            )
          );
    },
    getConservationTypeText: (id: number): Maybe<string> => {
      const type: Maybe<ConservationType> =
        storeProps.predefined.conservationTypes &&
        storeProps.predefined.conservationTypes.find((at: TODO) => at.id === id);
      return type
        ? storeProps.appSession.language.isEn
          ? type.enName
          : type.noName
        : null;
    },
    searchStore: storeProps.searchStore,
    history: (url: Maybe<string>) => url && upstream.history.push(url),
    appSession: storeProps.appSession
  };
};

export default loadPredefinedConservationTypes(
  inject(stores, props)(ConservationSearchComponent)
);
