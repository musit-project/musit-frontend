import { store$, initialState } from '../objectStore';
import MusitTestScheduler from '../../../testutils/MusitTestScheduler';

describe('objectStore', () => {
  it('testing reducer', () => {
    const testScheduler = new MusitTestScheduler();

    const objectData = {
      id: 51,
      uuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
      museumId: 99,
      museumNo: 'MusN11',
      term: 'Solsikke',
      objectType: 'collection'
    };

    const events = [
      {
        registeredBy: 'Stein Olsen',
        registeredDate: '2017-04-05T10:08:39+00:00',
        doneBy: '50cef0e2-e171-4bab-984f-a8c2af10081a',
        doneDate: '2017-04-05T10:08:39+00:00',
        id: 51,
        objectType: 'collection',
        from: {
          path: ',1,',
          pathNames: [
            {
              nodeId: 1,
              name: 'Utviklingsmuseet'
            }
          ],
          breadcrumb: [
            {
              id: 1,
              name: 'Utviklingsmuseet',
              url: '/magasin/1'
            }
          ]
        },
        to: {
          path: ',1,3,4,6,',
          pathNames: [
            {
              nodeId: 1,
              name: 'Utviklingsmuseet'
            },
            {
              nodeId: 3,
              name: 'Utviklingsmuseet Org'
            },
            {
              nodeId: 4,
              name: 'Forskningens hus'
            },
            {
              nodeId: 6,
              name: 'Naturværelset'
            }
          ],
          breadcrumb: [
            {
              id: 1,
              name: 'Utviklingsmuseet',
              url: '/magasin/1'
            },
            {
              id: 3,
              name: 'Utviklingsmuseet Org',
              url: '/magasin/3'
            },
            {
              id: 4,
              name: 'Forskningens hus',
              url: '/magasin/4'
            },
            {
              id: 6,
              name: 'Naturværelset',
              url: '/magasin/6'
            }
          ]
        },
        type: 'MoveObject',
        eventDate: '05.04.2017'
      }
    ];

    const samples = [
      {
        objectId: 'cda61333-e4c8-43aa-852e-6a9da9e00de5',
        parentObjectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        parentObjectType: 'collection',
        isExtracted: false,
        museumId: 99,
        status: 2,
        responsible: '50cef0e2-e171-4bab-984f-a8c2af10081a',
        doneDate: '2017-03-19T00:00:00.000Z',
        sampleType: 'Vev',
        sampleSubType: 'Bein',
        size: 123,
        sizeUnit: 'mm',
        container: 'Kapsel',
        storageMedium: 'Aceton',
        note: 'dss',
        registeredBy: '50cef0e2-e171-4bab-984f-a8c2af10081a',
        registeredDate: 1491386867960
      }
    ];

    // mock streams
    // prettier-ignore
    const streams = {
      clearStoreM:                "-------x-",
      loadObjectM:                "--x------",
      loadSampleEventsM:          "----x----",
      loadMoveAndAnalysisEventsM: "------x--",
      setLoadingM:                "-o-s-a---",
      expected:                   "iabcdefi-"
    };

    const expectedStateMap = {
      i: initialState,
      a: { ...initialState, loadingObjectData: true },
      b: { ...initialState, objectData },
      c: {
        ...initialState,
        objectData,
        loadingSamples: true
      },
      d: {
        ...initialState,
        samples,
        objectData
      },
      e: { ...initialState, samples, objectData, loadingEvents: true },
      f: { ...initialState, samples, events, objectData }
    };

    // mock up$ and down$ events

    const setLoading$ = testScheduler.createHotObservable(streams.setLoadingM, {
      o: { loadingObjectData: true },
      s: { loadingSamples: true },
      a: { loadingEvents: true }
    });
    const clearStore$ = testScheduler.createHotObservable(streams.clearStoreM);
    const loadObject$ = testScheduler.createHotObservable(streams.loadObjectM, {
      x: objectData
    });
    const loadSampleEvents$ = testScheduler.createHotObservable(
      streams.loadSampleEventsM,
      {
        x: samples
      }
    );
    const loadMoveAndAnalysisEvents$ = testScheduler.createHotObservable(
      streams.loadMoveAndAnalysisEventsM,
      { x: events }
    );

    const state$ = store$({
      setLoading$,
      clearStore$,
      loadObject$,
      loadSampleEvents$,
      loadMoveAndAnalysisEvents$
    });

    // assertion
    testScheduler.expectObservable(state$).toBe(streams.expected, expectedStateMap);

    // run tests
    testScheduler.flush();
  });
});
