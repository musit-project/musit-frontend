// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import moment from 'moment';
import { DATE_FORMAT_DISPLAY } from '../../../shared/util';
import type { Restriction } from '../../../types/analysis';
import type { AppSession } from '../../../types/appSession';

import CancelRestriction from './CancelRestriction';

type ViewRestrictionComponentProps = {
  appSession: AppSession,
  restriction: Restriction,
  updateRestriction: (restriction: Restriction) => void,
  cancelRestriction: () => void,
  showCancelDialog?: ?boolean,
  toggleCancelDialog: () => void
};

export default function ViewRestrictionComponent(props: ViewRestrictionComponentProps) {
  return props.showCancelDialog
    ? <CancelRestriction
        appSession={props.appSession}
        restriction={props.restriction}
        updateRestriction={props.updateRestriction}
        clickCancel={() => {
          props.cancelRestriction();
          props.toggleCancelDialog();
        }}
      />
    : <ViewRestriction
        restriction={props.restriction}
        clickCancel={props.toggleCancelDialog}
      />;
}

type ViewRestrictionProps = {
  restriction: Restriction,
  clickCancel: () => void
};

export function ViewRestriction(props: ViewRestrictionProps) {
  return (
    <div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictedBy">
          {I18n.t('musit.analysis.restrictions.restrictionsFor')}
        </label>
        <div className="col-md-10">
          <p className="form-control-static">{props.restriction.requesterName || ''}</p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictionCause">
          {I18n.t('musit.analysis.restrictions.reasonForRestriction')}
        </label>
        <div className="col-md-10">
          <p className="form-control-static">{props.restriction.reason || ''}</p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictionCaseNumbers">
          {I18n.t('musit.analysis.restrictions.caseNumber')}
        </label>
        <div className="col-md-5">
          <p className="form-control-static">
            {(Array.isArray(props.restriction.caseNumbers) &&
              props.restriction.caseNumbers.join(', ')) ||
              ''}
          </p>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="restrictionExpirationEndDate">
          {I18n.t('musit.analysis.restrictions.endDate')}
        </label>
        <div className="col-md-5">
          <p className="form-control-static">
            {props.restriction.expirationDate
              ? moment(props.restriction.expirationDate).format(DATE_FORMAT_DISPLAY)
              : ''}
          </p>
          <button
            onClick={(e: any) => {
              e.preventDefault();
              props.clickCancel();
            }}
          >
            Click me please
          </button>
        </div>
      </div>
    </div>
  );
}
