import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { simpleGet } from '../../shared/RxAjax';
import Report from '../../models/report';


const initialState = {
  data: {
  }
};

export const clear$ = createAction('clear$');

export const loadKDReport$  = createAction('loadKDReport$').switchMap( cmd => Report.getKDReport (simpleGet) (cmd.token, cmd.museumId));


export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadKDReport$.map((data) => (state) => ({...state, data: { kdreport: data }}))
  );

export default createStore('reportStore', reducer$({clear$, loadKDReport$}), Observable.of(initialState));