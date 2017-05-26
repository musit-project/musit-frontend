// @flow
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';
import uniq from 'lodash/uniq';

export const getAnalysisTypes$ = createAction('getAnalysisTypes$').switchMap(
  MusitAnalysis.getAnalysisTypesForCollection()
);

export const getAnalysis$ = createAction('getAnalysis$').switchMap(props =>
  MusitAnalysis.getAnalysisWithDetails()(props).do(props.onComplete)
);

export const loadPredefinedTypes$ = createAction('loadPredefinedTypes$').switchMap(props=>
  MusitAnalysis.loadPredefinedTypes()(props)
);

type Actions = {
  getAnalysis$: Subject,
  getAnalysisTypes$: Subject,
  loadPredefinedTypes$: Subject
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.getAnalysis$.map(analysis => state => ({
      ...state,
      analysis
    })),
    actions.getAnalysisTypes$.map(analysisTypes => state => ({
      ...state,
      analysisTypes,
      analysisTypeCategories: uniq(analysisTypes.map(a => a.category))
    })),
    actions.loadPredefinedTypes$.map(predefTypes => state => ({
      ...state,
      predefTypes
    }))
  );

export const store$ = (actions$: Actions = { getAnalysisTypes$, getAnalysis$, loadPredefinedTypes$ }) =>
  createStore('analysisStore', reducer$(actions$), Observable.of({ analysisTypes: [] }));

export default store$();
