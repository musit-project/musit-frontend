import React from 'react';
import { I18n } from 'react-i18nify';
import type { StorageAndHandlingProps } from '../../../types/conservation';
import SubEventComponentNote from '../components/subEventComponentNote';

export default function StorageAndHandling(props: StorageAndHandlingProps) {
  const suffix = ':';

  const extraAttributes = (
    <div>
      <div className="row form-group">
        <div className="col-md-5">
          <label htmlFor={`relativeHumidity_${props.index}`}>
            {I18n.t('musit.conservation.events.storageAndHandling.relativeHumidity') +
              suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`relativeHumidity_${props.index}`}>
              {props.storageAndHandling.relativeHumidity}
            </p>
          ) : (
            <input
              className="form-control"
              id={`relativeHumidity_${props.index}`}
              value={props.storageAndHandling.relativeHumidity}
              onChange={t => props.onChange('relativeHumidity')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-5">
          <label className="control-label" htmlFor={`temperature_${props.index}`}>
            {I18n.t('musit.conservation.events.storageAndHandling.temperature') + suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`temperature_${props.index}`}>
              {props.storageAndHandling.temperature}
            </p>
          ) : (
            <input
              className="form-control"
              id={`temperature_${props.index}`}
              value={props.storageAndHandling.temperature}
              onChange={t => props.onChange('temperature')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-5">
          <label className="control-label" htmlFor={`lightAndUvLevel_${props.index}`}>
            {I18n.t('musit.conservation.events.storageAndHandling.lightAndUvLevel') +
              suffix}
          </label>
          {props.viewMode ? (
            <p className="form-control-static" id={`lightAndUvLevel_${props.index}`}>
              {props.storageAndHandling.lightAndUvLevel}
            </p>
          ) : (
            <input
              className="form-control"
              id={`lightAndUvLevel_${props.index}`}
              value={props.storageAndHandling.lightAndUvLevel}
              onChange={t => props.onChange('lightAndUvLevel')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
  return (
    <SubEventComponentNote
      {...props}
      subEvent={props.storageAndHandling}
      eventName={I18n.t(
        'musit.conservation.events.storageAndHandling.storageAndHandling'
      )}
      noteLabel={I18n.t('musit.conservation.events.storageAndHandling.note')}
      extraAttributes={extraAttributes}
    />
  );
}
