// @flow
import PersonRoleDate from '../PersonRoleDate';
import { shallow } from 'enzyme';
import React from 'react';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('PersonRoleDate', () => {
  it('should match snapshot', () => {
    const wrapperBefore = shallow(
      <PersonRoleDate
        personData={[]}
        roles={['doneBy', 'responsible', 'madman']}
        updateForm={x => x}
        fieldName="Persons"
        appSession={{
          museumId: 99,
          collectionId: 'ererefdfd',
          accessToken: 'd444dddd',
          actor: { fn: 'Stein Olsen' },
          language: {
            isEn: false,
            isNo: true
          }
        }}
        showDateForRole={r => r === 'doneBy'}
        getDisplayNameForRole={(r: string) => {
          if (r === 'doneBy') {
            return 'Utført av';
          } else if (r === 'responsible') {
            return 'Ansvarlig';
          } else {
            return 'Ukjent';
          }
        }}
      />
    );

    const wrapperAfter = shallow(
      <PersonRoleDate
        personData={[
          { fn: 'Stein Olsen', role: 'doneBy', date: '12.01.2001' },
          { fn: 'Thor Heyerdahl', role: 'responsible', date: '12.01.2001' },
          { fn: 'Christian Radich', role: 'responsible', date: '12.01.2001' }
        ]}
        appSession={{
          museumId: 99,
          collectionId: 'ererefdfd',
          accessToken: 'd444dddd',
          actor: { fn: 'Stein Olsen' },
          language: {
            isEn: false,
            isNo: true
          }
        }}
        roles={['doneBy', 'responsible', 'madman']}
        updateForm={x => x}
        fieldName="Persons"
        showDateForRole={r => r === 'doneBy'}
        getDisplayNameForRole={r => {
          if (r === 'doneBy') {
            return 'Utført av';
          } else if (r === 'responsible') {
            return 'Ansvarlig';
          } else {
            return 'Ukjent';
          }
        }}
      />
    );
    //Empty input gives one empty line in PersonRoleTable, thus difference is 2
    expect(wrapperAfter.find('Row').length - wrapperBefore.find('Row').length).toBe(2);
  });
});
