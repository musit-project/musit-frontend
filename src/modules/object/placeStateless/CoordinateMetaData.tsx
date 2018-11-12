import * as React from 'react';
import { CheckBox } from '../components/CheckBox';
import { CoordinateProps } from '../placeStateless/PlaceComponent';

const CoordinateMetaData = (props: CoordinateProps) => {
  return (
    <div className="form-group">
      <div className="row">
        <div className="col-md-2">
          <label htmlFor="coordinateSource">Coordinate source </label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2">
          <select
            className="form-control"
            id="coordinateSource"
            defaultValue={
              props.coordinatePredefined.coordinateSourceTypes
                ? props.coordinatePredefined.coordinateSourceTypes[0].source
                : 'hei'
            }
            onChange={e => {
              props.onChangeCoordinateAttributes('coordinateSource')(e.target.value);
            }}
          >
            value={props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.coordinateSource
            //props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateSource
            }
            {props.coordinatePredefined.coordinateSourceTypes ? (
              props.coordinatePredefined.coordinateSourceTypes.map(
                ({ source }: { source: string }, i: number) => (
                  <option key={`optionRow_${i}`}>{source}</option>
                )
              )
            ) : (
              <option key={`optionRow_${1}`}>{'No data'}</option>
            )}
          </select>
        </div>
        <div className="col-md-2">
          <div className="checkbox" id="coordinateAddedLater">
            <CheckBox
              id={'checkBoxCoordinateAddedLater'}
              checked={
                /*  props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
                props.getCurrentCoordinate(props.coordinateHistoryIndeks).isAddedLater */
                props.editingCoordinateAttribute &&
                props.editingCoordinateAttribute.addedLater
                  ? true
                  : false
              }
              displayValue="Added later"
              onChange={() => {
                props.editingCoordinateAttribute &&
                props.editingCoordinateAttribute.addedLater
                  ? props.onChangeCheckBoxBoolean('addedLater')(false)
                  : props.onChangeCheckBoxBoolean('addedLater')(true);
              }}
            />
          </div>
        </div>
        {/* <div className="col-md-2">
          <div className="checkbox" id="caCoordinate">
            <CheckBox
              id={'checkBoxcCaCoordinate'}
              checked={
                props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
                props.getCurrentCoordinate(props.coordinateHistoryIndeks).caCoordinate
                  ? true
                  : false
              }
              displayValue="Ca Coordinate"
              onChange={() => {
                props.getCurrentCoordinate(props.coordinateHistoryIndeks) &&
                props.getCurrentCoordinate(props.coordinateHistoryIndeks).caCoordinate
                  ? props.onChangeCheckBoxBoolean('caCoordinate')(false)
                  : props.onChangeCheckBoxBoolean('caCoordinate')(true);
              }}
            />
          </div>
        </div> */}
      </div>
      <div className="row">
        <div className="col-md-2">
          <label htmlFor="precision">Precision</label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <input
            className="form-control"
            type="text"
            onChange={e => {
              props.onChangeCoordinateAttributes('precision')(e.target.value);
            }}
            value={
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.precision
              //props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinatePrecision
            }
            id="precision"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-1">
          <label htmlFor="accuracy">Accuracy</label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <input
            className="form-control"
            type="text"
            onChange={e => {
              props.onChangeCoordinateAttributes('gpsAccuracy')(e.target.value);
            }}
            value={
              props.editingCoordinateAttribute &&
              props.editingCoordinateAttribute.gpsAccuracy
              //props.getCurrentCoordinate(props.coordinateHistoryIndeks).gpsAccuracy
            }
            id="accuracy"
          />
        </div>
      </div>
    </div>
  );
};

export default CoordinateMetaData;
