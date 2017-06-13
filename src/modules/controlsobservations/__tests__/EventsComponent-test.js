import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { EventsComponent } from '../EventsComponent';

describe('EventsComponent', () => {
  const history = {
    push: () => {}
  };

  it('Check it renders when not loaded', () => {
    const myDiv = shallow(
      <EventsComponent
        store={{
          data: [],
          loading: true
        }}
        loader={<span>loader</span>}
        showObservations={true}
        showControls={true}
        match={{
          params: {
            id: '1'
          }
        }}
        appSession={{}}
        clearEvents={() => true}
        loadEvents={() => true}
        loadRootNode={() => true}
        history={history}
      />
    );
    expect(shallowToJson(myDiv)).toMatchSnapshot();
  });

  it('Check it renders.', () => {
    const myDiv = shallow(
      <EventsComponent
        store={{
          data: []
        }}
        showObservations={true}
        showControls={true}
        match={{
          params: {
            id: '1'
          }
        }}
        appSession={{}}
        clearEvents={() => true}
        loadEvents={() => true}
        loadRootNode={() => true}
        history={history}
      />
    );
    expect(shallowToJson(myDiv)).toMatchSnapshot();
  });
});
