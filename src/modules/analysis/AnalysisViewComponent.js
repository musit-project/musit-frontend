// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import MetaInformation from '../../components/metainfo';
import moment from 'moment';
import ObjectTable from './components/ExpandableObjectResultTable';
import toArray from 'lodash/toArray';
import {
  getAnalysisTypeTerm,
  getLabPlaceText,
  getStatusText,
  getAnalysisPurpose
} from './shared/getters';
import Result from './components/Result';
import { DATE_FORMAT_DISPLAY } from '../../shared/util';

import type { Predefined } from './shared/predefinedType';
import type { Person } from '../../components/person/PersonRoleDate';
import type { AppSession } from '../../types/appSession';
import type { FormData } from './shared/formType';
import type { Store } from './shared/storeType';

type Props = {
  form: FormData,
  store: Store,
  appSession: AppSession,
  predefined: Predefined,
  clickEdit: Function,
  clickCancel: Function,
  extraDescriptionAttributes: any,
  extraResultAttributes: any
};

export default ({
  form,
  store,
  predefined,
  appSession,
  clickEdit,
  extraResultAttributes,
  extraDescriptionAttributes
}: Props) => (
  <div className="container">
    <div className="page-header">
      <h1>
        {I18n.t('musit.analysis.viewAnalysis')}
      </h1>
    </div>
    <form className="form-horizontal">
      <MetaInformation
        updatedBy={form.updatedByName.value}
        updatedDate={form.updatedDate.value}
        registeredBy={form.registeredByName.value}
        registeredDate={form.registeredDate.value}
        onClickEdit={clickEdit}
      />
      <hr />
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="type">
          {I18n.t('musit.analysis.analysisType')}
        </label>
        <div className="col-md-10">
          <p className="form-control-static" id="type">
            {getAnalysisTypeTerm(
              form.analysisTypeId.value,
              predefined.analysisTypes,
              appSession.language
            )}
          </p>
        </div>
      </div>
      {extraDescriptionAttributes &&
        extraDescriptionAttributes.map((attr, i) => (
          <div className="form-group" key={i}>
            <label className="control-label col-md-2" htmlFor="type">
              {attr.attributeKey}
            </label>
            <div className="col-md-3">
              <p className="form-control-static">
                {(store.analysis &&
                  store.analysis.extraAttributes &&
                  store.analysis.extraAttributes[attr.attributeKey]) || []}
              </p>
            </div>
          </div>
        ))}
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="reason">
          {I18n.t('musit.analysis.reason')}{' '}
        </label>
        <div className="col-md-10">
          <p className="form-control-static" id="reason">
            {getAnalysisPurpose(
              form.reason.value,
              predefined.purposes,
              appSession.language
            )}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="status">
          {I18n.t('musit.analysis.status')}
        </label>
        <div className="col-md-5">
          <p className="form-control-static" id="status">
            {getStatusText(form.status.value)}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="status">
          {I18n.t('musit.analysis.place')}
        </label>
        <div className="col-md-5">
          <p className="form-control-static" id="status">
            {getLabPlaceText(predefined.analysisLabList, form.orgId.value)}
          </p>
        </div>
      </div>

      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="caseNumber">
          {I18n.t('musit.analysis.caseNumber')}
        </label>
        <div className="col-md-10">
          <p className="form-control-static" id="caseNumber">
            {form.caseNumbers.value &&
              Array.isArray(form.caseNumbers.value) &&
              form.caseNumbers.value.join(', ')}
          </p>
        </div>
      </div>
      <hr />
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="note">
          {I18n.t('musit.analysis.note')}
        </label>
        <div className="col-md-10">
          <p className="form-control-static" id="note">
            {form.note.value}
          </p>
        </div>
      </div>
      <hr />
      <h4>{I18n.t('musit.analysis.personTillAnalysis')}</h4>
      <div>
        <div className="row">
          <div className="col-md-4"><strong>{I18n.t('musit.texts.name')}</strong></div>
          <div className="col-md-2"><strong>{I18n.t('musit.texts.role')}</strong></div>
          <div className="col-md-2"><strong>{I18n.t('musit.texts.date')}</strong></div>
        </div>
        {form.persons.value &&
          form.persons.value.map((p: Person, i: number) => (
            <div className="row" key={i}>
              <div className="col-md-4">{p.name}</div>
              <div className="col-md-2">
                {I18n.t(`musit.analysis.roles.${p.role || 'UNKNOWN'}`) || p.role}
              </div>
              <div className="col-md-2">
                {p.date ? moment(p.date).format(DATE_FORMAT_DISPLAY) : null}
              </div>
            </div>
          ))}
      </div>
      <hr />
      <div className="well">
        <div className="form-group">
          <label className="col-md-12" htmlFor="objects">
            {I18n.t('musit.analysis.objectOrSample')}
          </label>
        </div>
        <div className="form-group">
          <div className="col-md-12 col-md-offset-0">
            <ObjectTable
              extraAttributes={extraResultAttributes}
              data={
                form.type.value === 'AnalysisCollection'
                  ? toArray(form.events.value)
                  : [
                      {
                        term: form.term.value,
                        museumNo: form.museumNo.value,
                        subNo: form.subNo.value
                      }
                    ]
              }
            />
          </div>
        </div>
        <hr />
        <Result
          extraAttributes={extraResultAttributes}
          updateExtraResultAttribute={() => {}}
          externalSource={toArray(form.externalSource.value).join(',')}
          updateExternalSource={() => {}}
          comments={form.comments.value}
          updateComments={() => {}}
        />
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor="restrictions">
            {I18n.t('musit.analysis.restrictions.restrictions')}
          </label>
          <div className="col-md-10">
            <p className="form-control-static" id="restrictions">
              {form.restrictions.value
                ? I18n.t('musit.texts.yes')
                : I18n.t('musit.texts.no')}
            </p>
          </div>
        </div>
        {form.restrictions.rawValue &&
          <div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="requester">
                {I18n.t('musit.analysis.restrictions.restrictionsFor')}
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="requester">
                  {form.restrictions_requesterName.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="reason">
                {I18n.t('musit.analysis.restrictions.reasonForRestriction')}
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="reason">
                  {form.restrictions_reason.value || ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="caseNumbers">
                {I18n.t('musit.analysis.restrictions.caseNumber')}
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="caseNumbers">
                  {form.restrictions_caseNumbers.value &&
                    Array.isArray(form.restrictions_caseNumbers.value)
                    ? form.restrictions_caseNumbers.value.join(', ')
                    : ''}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="expirationDate">
                {I18n.t('musit.analysis.restrictions.endDate')}
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="expirationDate">
                  {form.restrictions_expirationDate.value &&
                    moment(form.restrictions_expirationDate.value).format(
                      DATE_FORMAT_DISPLAY
                    )}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-2" htmlFor="cancelledReason">
                {I18n.t('musit.analysis.reasonForCancellation')}
              </label>
              <div className="col-md-10">
                <p className="form-control-static" id="cancelledReason">
                  {form.restrictions_cancelledReason.value || ''}
                </p>
              </div>
            </div>
          </div>}
      </div>
    </form>
  </div>
);
