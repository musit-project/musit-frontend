// @flow
import * as React from 'react';
import { I18n } from 'react-i18nify';
import { SampleData } from '../../types/samples';
import { AppSession } from '../../types/appSession';
import { History } from 'history';
import { FormDetails } from './types/form';
import { ObjectData } from '../../types/object';
import MetaInformation from '../../components/metainfo';
import ReadOnlySampleType from './components/ReadOnlySampleType';
import ViewPersonRoleDate from '../../components/person/ViewPersonRoleDate';
import ObjectAndSampleDetails from './components/ObjectAndSampleDetails';
import { mixed, Maybe, TODO } from '../../types/common';

type Props = {
  form: FormDetails;
  appSession: AppSession;
  objectData: ObjectData & SampleData;
  sampleStore: { sample: SampleData };
  objectStore: { objectData: ObjectData };
};

type ClickEventReturn = (e: { preventDefault: Function }) => void;

export type SampleProps = {
  statusText: Maybe<string>;
  sampleSubType: Maybe<string>;
  sampleType: Maybe<string>;
  persons: Array<any>;
  clickEditSample: (
    appSession: AppSession,
    sampleId: string,
    object: ObjectData
  ) => ClickEventReturn;
  clickCreateAnalysis: (
    appSession: AppSession,
    sample: SampleData,
    form: FormDetails,
    object: mixed
  ) => ClickEventReturn;
  clickCreateSample: (
    appSession: AppSession,
    sample: SampleData,
    form: FormDetails,
    object: mixed
  ) => ClickEventReturn;
  goBack: () => void;
  history: History;
};

export default function SampleViewComponent(props: Props & SampleProps) {
  const sample = props.sampleStore ? props.sampleStore.sample : null;
  const objectData = props.objectStore ? props.objectStore.objectData : null;
  if (!sample || !objectData) {
    return <div className="loading" />;
  }
  const derivedFrom: any = sample.parentObject.sampleOrObjectData || {};
  return (
    <div className="container">
      <form className="form-horizontal">
        <div className="page-header">
          {props.appSession.rolesForModules.collectionManagementWrite && (
            <button
              className="btn btn-default pull-right"
              onClick={props.clickEditSample as TODO}
            >
              {I18n.t('musit.sample.updateSample')}
            </button>
          )}
          <h1>{I18n.t('musit.sample.sample')}</h1>
        </div>
        {props.appSession.rolesForModules.collectionManagementWrite && (
          <div className="pull-right">
            <button
              className="btn btn-default"
              onClick={props.clickCreateAnalysis as TODO}
            >
              {I18n.t('musit.analysis.createAnalysis')}
            </button>
            <button className="btn btn-default" onClick={props.clickCreateSample as TODO}>
              {` ${I18n.t('musit.analysis.createSample')}`}
            </button>
          </div>
        )}
        <div>
          <MetaInformation
            updatedBy={sample.updatedStamp ? sample.updatedStamp.name : null}
            updatedDate={sample.updatedStamp ? sample.updatedStamp.date : null}
            registeredBy={sample.registeredStamp.name}
            registeredDate={sample.registeredStamp.date}
          />
          <hr />
        </div>
        <h4>
          {derivedFrom.sampleNum
            ? I18n.t('musit.sample.derivedFromObjectAndSample')
            : I18n.t('musit.sample.derivedFromObject')}
        </h4>
        <ObjectAndSampleDetails
          appSession={props.appSession}
          history={props.history}
          objectData={{ ...objectData, derivedFrom }}
        />
        <hr />
        <h4>{I18n.t('musit.sample.personsAssociatedWithSampleTaking')}</h4>
        <ViewPersonRoleDate
          personData={props.persons}
          getDisplayNameForRole={(roleName: string) =>
            I18n.t(`musit.sample.roles.${roleName}`)
          }
        />
        <hr />
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.sampleNumber')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">{sample.sampleNum}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.sampleId')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">{sample.sampleId}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.externalId')}
          </label>
          <div className="col-md-3">
            <p className="form-control-static">
              {sample.externalId && sample.externalId.value}
            </p>
          </div>
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.externalIdSource')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.externalId && sample.externalId.source}
            </p>
          </div>
        </div>
        <ReadOnlySampleType
          sampleType={props.sampleType}
          subTypeValue={props.sampleSubType}
        />
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.description')}
          </label>
          <div className="col-md-8">
            <p className="form-control-static">{sample.description}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.status')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">{props.statusText}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.volumeOrWeight')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {sample.size && sample.size.value + ' ' + sample.size.unit}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.storageContainer')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">{sample.container}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.storageMedium')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">{sample.storageMedium}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.treatment')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">{sample.treatment}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.hasResidualMaterial')}
          </label>
          <div className="col-md-2">
            <p className="form-control-static">
              {(sample.leftoverSample === 3 && 'Ja') ||
                (sample.leftoverSample === 2 && 'Nei') ||
                ''}
            </p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2">
            {I18n.t('musit.sample.comments')}
          </label>
          <div className="col-md-8">
            <p className="form-control-static">{sample.note}</p>
          </div>
        </div>
        <hr />
        <button className="btn-link" style={{ marginLeft: 20 }} onClick={props.goBack}>
          {I18n.t('musit.texts.cancel')}
        </button>
      </form>
    </div>
  );
}
