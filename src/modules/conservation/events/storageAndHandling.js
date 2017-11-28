import React from 'react';
import { I18n } from 'react-i18nify';
import Select from 'react-select';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';
import type { Field } from 'forms/form';
import ObjectSelection from '../components/objectSelection';
import type { StorageAndHandlingType } from '../../../types/conservation';
import FontAwesome from 'react-fontawesome';
import CollapsibleEvent from '../components/CollapsibleEvent';
import PersonRoleDate from '../../../components/person/PersonRoleDate';
import ViewPersonRoleDate from '../../../components/person/ViewPersonRoleDate';
import find from 'lodash/find';

type types = { id: number, noLabel: string, enLabel?: string };

export type StorageAndHandlingProps = {
  name: string,
  affectedThingsWithDetailsMainEvent?: ?Array<ObjectInfo>,
  storageAndHandling: StorageAndHandlingType,
  index?: number,
  appSession?: AppSession,
  onChangePersonActorRole: Function,
  viewMode?: boolean,
  onChange?: Function,
  onDelete?: Function,
  expanded?: boolean,
  toggleExpanded: Function
};
export default function StorageAndHandling(props: StorageAndHandlingProps) {
  const suffix = ':';

  const storageAndHandlingComponents = (
    <div className="container">
      {!props.viewMode &&
      !props.storageAndHandling.id && (
        <div className="row form-group">
          <div div className="col-md-10">
            <button
              className="btn btn-default"
              onClick={e => {
                e.preventDefault();
                props.onDelete();
              }}
            >
              <FontAwesome name={'times'} />
            </button>
            <hr />
          </div>
        </div>
      )}{' '}
      {props.viewMode ? (
        <ViewPersonRoleDate
          personData={props.storageAndHandling.actorsAndRoles || []}
          getDisplayNameForRole={(r: string) => {
            const role = find(props.roleList, rl => rl.roleId === r);
            return role && role.noRole;
          }}
        />
      ) : (
        <PersonRoleDate
          appSession={props.appSession}
          personData={props.storageAndHandling.actorsAndRoles}
          fieldName={'actorsAndRoles'}
          updateForm={props.onChangePersonActorRole}
          getDisplayNameForRole={(r: string | number) => {
            const role = find(props.roleList, rl => rl.roleId === r);
            return role.noRole;
          }}
          roles={props.roleList ? props.roleList.map(e => e.roleId) : []}
          showDateForRole={(roleName: string) => [1].some(e => e === roleName)}
        />
      )}{' '}
      <div className="row form-group">
        <label className="control-label col-md-2" htmlFor={`note_${props.index}`}>
          {I18n.t('musit.conservation.events.storageAndHandling.relativeHumidity') +
            suffix}
        </label>
        <div className="col-md-3">
          <input
            className="form-control"
            id={`note_${props.index}`}
            value={props.storageAndHandling.relativeHumidity}
            onChange={t => props.onChange('relativeHumidity')(t.target.value)}
            rows="5"
            disabled={props.viewMode}
          />
        </div>
      </div>
      <div className="row form-group">
        <label className="control-label col-md-2" htmlFor={`note_${props.index}`}>
          {I18n.t('musit.conservation.events.storageAndHandling.temperature') + suffix}
        </label>
        <div className="col-md-3">
          <input
            className="form-control"
            id={`note_${props.index}`}
            value={props.storageAndHandling.temperature}
            onChange={t => props.onChange('temperature')(t.target.value)}
            rows="5"
            disabled={props.viewMode}
          />
        </div>
      </div>
      <div className="row form-group">
        <label className="control-label col-md-2" htmlFor={`note_${props.index}`}>
          {I18n.t('musit.conservation.events.storageAndHandling.lightAndUvLevel') +
            suffix}
        </label>
        <div className="col-md-3">
          <input
            className="form-control"
            id={`note_${props.index}`}
            value={props.storageAndHandling.lightAndUvLevel}
            onChange={t => props.onChange('lightAndUvLevel')(t.target.value)}
            rows="5"
            disabled={props.viewMode}
          />
        </div>
      </div>
      <div className="row form-group">
        <label className="control-label col-md-2" htmlFor={`note_${props.index}`}>
          {I18n.t('musit.conservation.events.storageAndHandling.note') + suffix}
        </label>
        <div className="col-md-9">
          <textarea
            className="form-control"
            id={`note_${props.index}`}
            value={props.storageAndHandling.note}
            onChange={t => props.onChange('note')(t.target.value)}
            rows="5"
            disabled={props.viewMode}
          />
        </div>
      </div>
      <ObjectSelection
        affectedThingsWithDetailsMainEvent={props.affectedThingsWithDetailsMainEvent}
        affectedThingsSubEvent={props.storageAndHandling.affectedThings}
        affectedThingsSubEventOnChange={t =>
          props.onChange('affectedThings')(t.map(s => s) || [])}
        viewMode={props.viewMode}
      />
    </div>
  );
  return (
    <CollapsibleEvent
      eventName={I18n.t(
        'musit.conservation.events.storageAndHandling.storageAndHandling'
      )}
      eventComponent={storageAndHandlingComponents}
      expanded={props.expanded}
      toggleExpanded={props.toggleExpanded}
    />
  );
}