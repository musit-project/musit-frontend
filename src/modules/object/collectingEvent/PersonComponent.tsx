import * as React from 'react';
import {
  PersonNameSuggest,
  PersonNameSuggestion
} from '../../../components/suggest/PersonNameSuggest';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { personDet } from '../../../models/object/classHist';
import { PersonNameComponent } from '../person/PersonNameComponent';
import {
  OutputPersonName,
  InputPersonName,
  PersonNameForCollectingEvent
} from '../../../models/object/person';

import { EditState, NonEditState, PersonSelectedMode } from '../types';
import EditAndSaveButtons from '../components/EditAndSaveButtons';
import { PersonState } from '../person/PersonComponent';

const personNameAsString = (n: PersonNameSuggestion) => {
  const personName = (
    <span>
      <b>Person name: </b> {n.name}
    </span>
  );
  const person =
    n.name != n.defaultName ? (
      <span style={{ marginLeft: '5px' }}>
        <b> Person: </b> {n.displayPersonName}
      </span>
    ) : (
      ''
    );
  return (
    <span className="suggestion-content" style={{ fontSize: '12px' }}>
      {personName}
      {person}
    </span>
  );
};

export interface PersonState {
  personName?: PersonNameForCollectingEvent;
  personNames?: PersonNameForCollectingEvent[];
  editingPersonName?: InputPersonName;
  editState?: EditState | NonEditState;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  showMoreInfo?: boolean;
  newPersonAddedOrDeleted: boolean;
  personSelectedMode?: PersonSelectedMode;
  editingPerson?: PersonNameForCollectingEvent;
}

export type PersonProps = {
  personNames?: OutputPersonName[];
  formInvalid: boolean;
  disabled: boolean;
  value?: string;
  appSession: AppSession;
  history: History;
  onClickSave: () => void;
  onClickEdit: () => void;
  onChangePerson: (suggestion: personDet) => void;
  onChangeSecondPerson: (suggestion: PersonNameSuggestion) => void;
  onAddPerson: () => void;
  onDeletePerson: (i: number) => void;
  editingPersonName?: InputPersonName;
  editingPerson?: PersonNameForCollectingEvent;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  showMoreInfo?: boolean;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onCreateAndAddPersonName: Function;
  onCreateAndAddNewPerson: Function;
  onClickMoreOptions: Function;
  nameEmpty: boolean;
  readOnly?: boolean;
  personSelectedMode?: PersonSelectedMode;
  selectedPerson?: PersonNameForCollectingEvent;
  newPersonAddedOrDeleted: boolean;
};

export const ViewPersonComponent = (props: {
  personNames: PersonNameForCollectingEvent[] | undefined;
}) => {
  return (
    <div className="container-fluid">
      <table className="table table-condensed">
        <thead>
          <th>Uuid</th>
          <th>Name</th>
        </thead>
        <tbody>
          {props.personNames &&
            props.personNames.map((p: OutputPersonName, i: number) => (
              <tr key={`pn-${i}`}>
                <td>{p.actorNameUuid}</td>
                <td>{p.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const PersonComponent = (props: PersonProps) => {
  return (
    <div className="container-fluid">
      <form>
        <div className="row">
          <label
            className="control-label col-md-2"
            htmlFor="PersonNameSuggestCollectingEvent"
          >
            Person name
          </label>
          <div className="col-md-8">
            <PersonNameSuggest
              id="PersonNameSuggestCollectingEvent"
              disabled={props.disabled}
              value={props.selectedPerson ? props.selectedPerson.name : props.value}
              renderFunc={personNameAsString}
              placeHolder="Person Name"
              appSession={props.appSession}
              onChange={props.onChangePerson}
              history={props.history}
              hideCreateNewPerson={true}
            />
          </div>
        </div>
        <div className="row">
          <label className="control-label col-md-2" htmlFor="btnNewPersonname">
            Fant du ikke personnavnet/ personen?
          </label>
          <div className="col-md-2">
            <button
              id="btnNewPersonname"
              disabled={props.disabled}
              type="button"
              className="btn btn-default btn-sm"
              onClick={e => {
                props.onClickMoreOptions(props.appSession);
              }}
            >
              {props.showMoreInfo ? 'Skjul detaljer' : 'Flere valg/detaljer'}
            </button>
          </div>
        </div>
        <br />
        <div className="row">
          {props.showMoreInfo && (
            <PersonNameComponent
              editingPersonName={props.editingPersonName}
              disableOnChangeFullName={props.disableOnChangeFullName}
              disableOnChangeOtherName={props.disableOnChangeOtherName}
              appSession={props.appSession}
              history={props.history}
              onCreateAndAddPersonName={props.onCreateAndAddPersonName}
              onCreateAndAddNewPerson={props.onCreateAndAddNewPerson}
              onChangeFullName={props.onChangeFullName}
              onChangeSecondPerson={props.onChangeSecondPerson}
              personSelectedMode={props.personSelectedMode}
              selectedPerson={props.selectedPerson}
              editingPerson={props.editingPerson}
            />
          )}
        </div>
        <hr />
        <div className="row">
          <div className="col-md-1 col-md-offset-10">
            <button
              className="btn btn-default"
              disabled={props.disabled}
              type="button"
              onClick={() => {
                props.onAddPerson();
              }}
            >
              {' '}
              Legg til person
            </button>
          </div>
        </div>
        <br />
        <div className="row grid">
          <table className="table">
            <thead>
              <tr>
                <th className="col-md-4">Person Name</th>
                <th className="col-md-2">Person Name UUID</th>
                <th className="col-md-4">Person </th>
                <th className="col-md-1">Person UUID</th>
                <th className="col-md-1" />
              </tr>
            </thead>
            <tbody>
              {props.personNames &&
                props.personNames.map((d: PersonNameForCollectingEvent, i: number) => (
                  <tr key={`det-row-${i}`}>
                    <td className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        disabled={true}
                        value={d.name}
                      />
                    </td>
                    <td className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        disabled={true}
                        value={d.actorNameUuid}
                      />
                    </td>
                    <td className="col-md-4">
                      <input
                        type="text"
                        className=" form-control"
                        disabled={true}
                        value={d.defaultName}
                      />
                    </td>
                    <td className="col-md-1">
                      <input
                        type="text"
                        className="form-control"
                        disabled={true}
                        value={d.actorUuid}
                      />
                    </td>
                    <td className="col-md-1">
                      {props.disabled ? (
                        'Delete'
                      ) : (
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            props.onDeletePerson(i);
                          }}
                        >
                          Delete
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <EditAndSaveButtons
            onClickCancel={() => {}}
            onClickEdit={props.onClickEdit}
            onClickSave={props.onClickSave}
            onClickDraft={() => {}}
            editButtonState={{ visible: true, disabled: props.readOnly ? false : true }}
            saveButtonState={{
              visible: true,
              disabled: props.formInvalid || !props.newPersonAddedOrDeleted
            }}
            cancelButtonState={{ visible: true, disabled: false }}
            draftButtonState={{ visible: false, disabled: false }}
            saveButtonText={'Lagre'}
            draftButtonText={'Utkast'}
            editButtonText={'Endre'}
            cancelButtonText={'Avbryt'}
            nameEmpty={props.nameEmpty || props.disabled}
          />
        </div>
      </form>
    </div>
  );
};

export default PersonComponent;
