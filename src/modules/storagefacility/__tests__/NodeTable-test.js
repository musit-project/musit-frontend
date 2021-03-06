import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import NodeGrid from '../NodeTable';
import { expect as e } from 'chai';
import { appSession } from '../../../testutils/sampleDataForTest';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('NodeTable', () => {
  const tableData = [
    { name: 'NHM', type: 'Root' },
    { name: 'KHM', type: 'Root' },
    { name: 'Bygg 1', type: 'Building' },
    { name: 'Bygg 2', type: 'Building' },
    { name: 'Rom 1', type: 'Room' }
  ];

  const onClick = sinon.spy();
  const pickNode = sinon.spy();
  const onMove = sinon.spy();
  const goToEvents = sinon.spy();
  const dummyArg = { preventDefault: () => null };
  const wrapper = shallow(
    <NodeGrid
      appSession={appSession}
      tableData={tableData}
      goToEvents={goToEvents}
      pickNode={pickNode}
      onMove={onMove}
      onClick={onClick}
      onLagreClick={k => k}
      loaded={true}
      updateState={k => k}
      isNodeAdded={k => k}
    />
  );

  it('should render properly ', () => {
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('check content', () => {
    wrapper.find('tr').forEach((node, index) => {
      if (index) {
        const name = tableData[index - 1].name;
        e(
          node
            .find('td')
            .first()
            .last()
            .text()
        ).to.contain(name);
      }
    });
  });

  it('check count', () => {
    e(wrapper.find('tr')).to.have.length(tableData.length + 1);
  });

  it('check clickNameClick', () => {
    wrapper
      .find('.onClickName')
      .first()
      .simulate('click', dummyArg);
    e(onClick.calledOnce).to.equal(true);
  });

  it('check click onMove', () => {
    wrapper
      .find('.onMoveClick')
      .first()
      .simulate('click', dummyArg);
    e(onMove.calledOnce).to.equal(true);
  });

  it('check click goToEventClick', () => {
    wrapper
      .find('.goToEventClick')
      .first()
      .simulate('click', dummyArg);
    e(goToEvents.calledOnce).to.equal(true);
  });

  it('check click onPickClick', () => {
    wrapper
      .find('.onPickClick')
      .first()
      .simulate('click', dummyArg);
    e(pickNode.calledOnce).to.equal(true);
  });
});
