import React from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';

type AdmPlace = {
  admPlaceId?: number,
  name?: string,
  type?: string,
  overordnet?: string,
  kommune?: string,
  fylke?: string,
  land?: string,
  lat?: number,
  long?: number,
  zoom?: number
};

type Coordinate = {
  coordinateSource?: string,
  coordinateType?: string,
  coordinateGeomertry?: string,
  coordinatePrecision?: number,
  caAltitude?: boolean,
  gpsAccuracy?: number,
  datum?: string,
  utmZone?: number,
  mgrsBand?: string,
  utmNorthSouth?: string,
  coordinateString?: string,
  caCoordinate?: boolean,
  coordinateAddedLater?: boolean,
  coordinateNote?: string,
  altitudeLow?: number,
  altitudeHigh?: number,
  altitudeAggregated?: string,
  altitudeUnit?: string,
  depthLow?: number,
  depthAggregated?: string,
  depthHigh?: number,
  depthUnit?: string
};

export type CoordinateRevisionType =
  | 'newCoordinate'
  | 'coordinateEdit'
  | 'coordinateRevision'
  | 'deleteCoordinate';

export type CoordinateHistoryItem = {
  coordinateId?: number,
  registeredBy?: string,
  registeredDate?: string,
  note?: string,
  coordinate: Coordinate,
  coordinateRevisionType?: CoordinateRevisionType
};
export type CoordinateHistory = Array<CoordinateHistoryItem>;

export type PlaceState = {
  admPlace: AdmPlace,
  coordinateHistory: CoordinateHistory,
  editingCoordinate: Coordinate,
  locality?: string,
  ecology?: string,
  station?: string,
  sample?: string,
  ship?: string,
  method?: string,
  methodDescription?: string,
  coordinateCollapsed?: boolean,
  altitudeCollapsed?: boolean,
  coordinateHistoryIndeks: number
};

export type PlaceProps = PlaceState & {
  onChangeTextField: (fieldName: string) => (value: string) => void,
  onChangeNumberField: (fieldName: string) => (value: number) => void
};

export type CoordinateProps = {
  coordinateHistory: CoordinateHistory,
  editingCoordinate: Coordinate,
  coordinateHistoryIndeks: number,
  onChangeCoordinateNumber: (fieldName: string) => (value: number) => void,
  onChangeCoordinateText: (fieldName: string) => (value: string) => void,
  onChangeHistoryItem: (fieldName: string) => (value: string) => void,
  getCurrentCoordinate: (ind: number) => Coordinate,
  getCurrentHistoryItem: (ind: number) => CoordinateHistoryItem,
  onClickSaveRevision: () => void,
  onClickSaveEdit: () => void,
  onToggleCollapse: () => void
};

const admPlaces: Array<AdmPlace> = [
  {
    admPlaceId: 1,
    name: 'Oslo',
    type: 'Kommune',
    overordnet: 'Oslo fylke',
    kommune: 'Oslo',
    fylke: 'Oslo fylke',
    land: 'Norge',
    lat: 59.8939224,
    long: 10.7149059,
    zoom: 12
  },
  {
    admPlaceId: 2,
    name: 'Bergen',
    type: 'Kommune',
    overordnet: 'Hordaland',
    kommune: 'Bergen',
    fylke: 'Hordaland',
    land: 'Norge',
    lat: 60.3651115,
    long: 5.2887477,
    zoom: 11
  },
  {
    admPlaceId: 3,
    name: 'Trondheim',
    type: 'Kommune',
    overordnet: 'Trøndelag',
    kommune: 'Trondheim',
    fylke: 'Trøndelag',
    land: 'Norge',
    lat: 63.418719,
    long: 10.3685518,
    zoom: 12
  },
  {
    admPlaceId: 4,
    name: 'Kristiansand',
    type: 'Kommune',
    overordnet: 'Aust-Agder',
    kommune: 'Kristiansand',
    fylke: 'Aust-Agder',
    land: 'Norge',
    lat: 58.1529583,
    long: 7.9390013,
    zoom: 12
  },
  {
    admPlaceId: 5,
    name: 'Drammen',
    type: 'Kommune',
    overordnet: 'Buskerud',
    kommune: 'Drammen',
    fylke: 'Buskerud',
    land: 'Norge',
    lat: 59.734017,
    long: 10.1489475,
    zoom: 12
  }
];
const coordinateTypes = ['MGRS', 'Lat/Long', 'UTM'];
const datumValues = ['WGS84', 'ED50', 'EUREF-89'];

const geometryTypes = ['Point', 'Reactangle', 'Polygone', 'Line'];
const coordinateSources = ['Original label', 'GPS', 'Map', 'Other'];
const altDepthUnits = ['Meters', 'Feet'];
const coordinateRevisionTypes = [
  { displayValue: 'New coordinate', value: 'newCoordinate' },
  { displayValue: 'Coordinate revision', value: 'coordinateRevision' },
  { displayValue: 'Edit coordinate', value: 'coordinateEdit' },
  { displayValue: 'Delete coordinate', value: 'deleteCoordinate' }
];

const CoordinateHistoryComponent = (props: { coordinateHistory: CoordinateHistory }) => {
  const unitConv = (a?: string, u?: string) => {
    if (a && u) {
      if (u === 'Meters') {
        return a + 'm.';
      } else if (u === 'Feet') {
        return a + 'ft.';
      }
      return '';
    }
  };

  return (
    <div>
      <h3>Coordinate history</h3>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr key="0-key">
              <th>ID</th>
              <th>Rev type</th>
              <th>Coordinate type</th>
              <th>Coordinate</th>
              <th>Altitude</th>
              <th>Depth </th>
              <th>Date</th>
              <th>Reg.by</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {props.coordinateHistory.map(
              (coordinate: CoordinateHistoryItem, i: number) => {
                return (
                  <tr key={`${i + 1}-key`}>
                    <td>{coordinate.coordinateId}</td>
                    <td>{coordinate.coordinateRevisionType}</td>
                    <td>{coordinate.coordinate.coordinateType}</td>
                    <td>{coordinate.coordinate.coordinateString}</td>
                    <td>
                      {unitConv(
                        coordinate.coordinate.altitudeAggregated,
                        coordinate.coordinate.altitudeUnit
                      )}
                    </td>
                    <td>
                      {unitConv(
                        coordinate.coordinate.depthAggregated,
                        coordinate.coordinate.depthUnit
                      )}
                    </td>

                    <td>{coordinate.registeredDate}</td>
                    <td>{coordinate.registeredBy}</td>
                    <td>
                      <a
                        href=""
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <FontAwesome name="edit" />
                      </a>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const CoordinateHistoryItemComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="coordinateRevisionNote">Note on revision </label>
          <textarea
            className="form-control"
            value={props.getCurrentHistoryItem(props.coordinateHistoryIndeks).note}
            id="coordinateRevisionNote"
            onChange={e => {
              props.onChangeHistoryItem('note')(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const UTMCoordinateComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
          <select
            className="form-control"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateType
            }
            id="coordinateType"
            onChange={e => {
              props.onChangeCoordinateText('coordinateType')(e.target.value);
            }}
          >
            {coordinateTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="datum">Datum </label>
          <select
            className="form-control"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).datum}
            id="datum"
            onChange={e => {
              props.onChangeCoordinateText('datum')(e.target.value);
            }}
          >
            {datumValues.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
          <select
            className="form-control"
            id="coordinateGeomertry"
            onChange={e => {
              props.onChangeCoordinateText('coordinateGeomertry')(e.target.value);
            }}
          >
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                .coordinateGeomertry
            }
            {geometryTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="zone">Zone </label>
          <input
            type="text"
            className="form-control"
            id="zone"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).utmZone}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="utmNorthSouth">North/South </label>
          <input
            type="text"
            className="form-control"
            id="utmNorthSouth"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).utmNorthSouth
            }
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-7">
          <label htmlFor="UTMCoordinateString">UTM-Coordinate </label>
          <input
            type="text"
            className="form-control"
            id="UTMCoordinateString"
            onChange={e => {
              props.onChangeCoordinateText('coordinateString')(e.target.value);
            }}
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateString
            }
          />
        </div>
      </div>
    </div>
  );
};

const LatLongComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
          <select
            className="form-control"
            id="coordinateType"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateType
            }
            onChange={e => {
              props.onChangeCoordinateText('coordinateType')(e.target.value);
            }}
          >
            {coordinateTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="datum">Datum </label>
          <select
            className="form-control"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).datum}
            id="datum"
            onChange={e => {
              props.onChangeCoordinateText('datum')(e.target.value);
            }}
          >
            {datumValues.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
          <select
            className="form-control"
            id="coordinateGeomertry"
            onChange={e => {
              props.onChangeCoordinateText('coordinateGeomertry')(e.target.value);
            }}
          >
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                .coordinateGeomertry
            }
            {geometryTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-7">
          <label htmlFor="latLongCoordinateString">Lat/Long-Coordinate </label>
          <input
            type="text"
            className="form-control"
            id="latLongCoordinateString"
            onChange={e => {
              props.onChangeCoordinateText('coordinateString')(e.target.value);
            }}
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateString
            }
          />
        </div>
      </div>
    </div>
  );
};

const MGRSComponent = (props: CoordinateProps) => {
  return (
    <div>
      <div className="row form-group">
        <div className="col-md-2">
          <label htmlFor="coordinateType">Coordinate type </label>
          <select
            className="form-control"
            id="coordinateType"
            value={props.editingCoordinate.coordinateType}
            onChange={e => {
              props.onChangeCoordinateText('coordinateType')(e.target.value);
            }}
          >
            {coordinateTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="datum">Datum </label>
          <select
            className="form-control"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).datum}
            id="datum"
            onChange={e => {
              props.onChangeCoordinateText('datum')(e.target.value);
            }}
          >
            {datumValues.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="coordinateGeomertry">Coordinate geometry </label>
          <select
            className="form-control"
            id="coordinateGeomertry"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                .coordinateGeomertry
            }
            onChange={e => {
              props.onChangeCoordinateText('coordinateGeomertry')(e.target.value);
            }}
          >
            {geometryTypes.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="zone">Zone </label>
          <input
            type="text"
            className="form-control"
            id="zone"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).utmZone}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="mgrsBand">Band </label>
          <input
            type="text"
            className="form-control"
            id="mgrsBand"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).mgrsBand}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-7">
          <label htmlFor="MGRSCoordinateString">MGRS-Coordinate </label>
          <input
            type="text"
            className="form-control"
            id="MGRSCoordinateString"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateString
            }
            onChange={e => {
              props.onChangeCoordinateText('coordinateString')(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AltitudeDepthData = (props: CoordinateProps) => (
  <div>
    <div className="row">
      <div className="col-md-3 form-group">
        <label htmlFor="altitude">Altitude</label>
        <input
          className="form-control"
          type="text"
          onChange={e => {
            props.onChangeCoordinateText('altitudeAggregated')(e.target.value);
          }}
          value={
            props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeAggregated
          }
          id="altitude"
        />
      </div>
      <div className="col-md-2 form-group">
        <label htmlFor="altitudeUnit">Unit </label>
        <select
          className="form-control"
          id="altitudeUnit"
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).altitudeUnit}
          onChange={e => {
            props.onChangeCoordinateText('altitudeUnit')(e.target.value);
          }}
        >
          {altDepthUnits.map((type: string, i: number) => (
            <option key={`optionRow_${i}`}>{type}</option>
          ))}
        </select>
      </div>
      <div className="col-md-3 form-group">
        <label htmlFor="depth">Depth</label>
        <input
          className="form-control"
          type="text"
          onChange={e => {
            props.onChangeCoordinateText('depthAggregated')(e.target.value);
          }}
          value={
            props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthAggregated
          }
          id="depthLow"
        />
      </div>

      <div className="col-md-2 form-group">
        <label htmlFor="depthUnit">Unit </label>
        <select
          className="form-control"
          id="depthUnit"
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).depthUnit}
          onChange={e => {
            props.onChangeCoordinateText('depthUnit')(e.target.value);
          }}
        >
          {altDepthUnits.map((type: string, i: number) => (
            <option key={`optionRow_${i}`}>{type}</option>
          ))}
        </select>
      </div>
      <div className="col-md-1 form-group">
        <div className="checkbox" id="caDepth">
          <label>
            <input
              type="checkbox"
              value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).caAltitude}
            />{' '}
            Ca depth
          </label>
        </div>
      </div>

      <div className="col-md-4">
        <label htmlFor="note">Note</label>
        <textarea
          className="form-control"
          value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateNote}
          id="note"
        />
      </div>
    </div>
  </div>
);

const CoordinateMetaData = (props: CoordinateProps) => {
  return (
    <div className="form-group">
      <div className="row">
        <div className="col-md-3">
          <label htmlFor="coordinateSource">Coordinate source </label>
          <select
            className="form-control"
            id="coordinateSource"
            onChange={e => {
              props.onChangeCoordinateText('coordinateSource')(e.target.value);
            }}
          >
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateSource
            }
            {coordinateSources.map((type: string, i: number) => (
              <option key={`optionRow_${i}`}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2 form-group">
          <div className="checkbox" id="coordinateAddedLater">
            <label>
              <input
                type="checkbox"
                value={
                  props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                    .coordinateAddedLater
                }
              />{' '}
              Added later{' '}
            </label>
          </div>
          <div className="checkbox" id="coordinateAddedLater">
            <label>
              <input
                type="checkbox"
                value={
                  props.getCurrentCoordinate(props.coordinateHistoryIndeks).caCoordinate
                }
              />{' '}
              Ca coordinate
            </label>
          </div>
        </div>
        <div className="col-md-2">
          <label htmlFor="precision">Precision</label>
          <input
            className="form-control"
            type="text"
            value={
              props.getCurrentCoordinate(props.coordinateHistoryIndeks)
                .coordinatePrecision
            }
            id="precision"
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="accuracy">GPS-accuracy</label>
          <input
            className="form-control"
            type="text"
            value={props.getCurrentCoordinate(props.coordinateHistoryIndeks).gpsAccuracy}
            id="accuracy"
          />
        </div>
      </div>
    </div>
  );
};

const CoordinateHeader = (props: CoordinateProps) => {
  switch (props.getCurrentCoordinate(props.coordinateHistoryIndeks).coordinateType) {
    case 'UTM': {
      return <UTMCoordinateComponent {...props} />;
    }
    case 'MGRS': {
      return <MGRSComponent {...props} />;
    }
    case 'Lat/Long': {
      return <LatLongComponent {...props} />;
    }
    default: {
      return <div />;
    }
  }
};

const CoordinateComponent = (
  props: CoordinateProps & { coordinateHistory: CoordinateHistory }
) => {
  return (
    <div>
      <CoordinateMetaData {...props} />
      <AltitudeDepthData {...props} />
      <CoordinateHistoryComponent coordinateHistory={props.coordinateHistory} />
      <CoordinateHistoryItemComponent {...props} />
    </div>
  );
};
const InputText = (props: { value: string, label: string, readOnly?: boolean }) => (
  <div className="col-md-4">
    <label htmlFor={props.label}>{props.label}</label>
    <input
      type="text"
      className="form-control"
      readOnly={props.readOnly}
      id={props.label}
      value={props.value}
    />
  </div>
);

const AdmPlaceComponent = (props: PlaceState & { onChange: (value: string) => void }) => (
  <div>
    <div className="well">
      <div className="row form-group">
        <div className="col-md-12">
          <label htmlFor="admPlaceName">Adm place </label>
          <select
            className="form-control"
            id="admPlaceName"
            onChange={e => {
              console.log('e', e);
              props.onChange({
                admPlace: {
                  kommune: e.target.value.split(';')[0],
                  fylke: e.target.value.split(';')[1],
                  land: e.target.value.split(';')[2],
                  lat: Number(e.target.value.split(';')[3]),
                  long: Number(e.target.value.split(';')[4]),
                  zoom: Number(e.target.value.split(';')[5])
                }
              });
            }}
          >
            {admPlaces.map((a: AdmPlace) => (
              <option
                key={`optionRow_${a.admPlaceId || 0}`}
                value={
                  a.kommune +
                  ';' +
                  a.fylke +
                  ';' +
                  a.land +
                  ';' +
                  a.lat +
                  ';' +
                  a.long +
                  ';' +
                  a.zoom
                }
                label={`${a.name || ''} Type: ${a.type || ''} (${
                  a.kommune ? a.kommune + ':' : ''
                } ${a.fylke ? a.fylke + ':' : ''} : ${a.land ? a.land : ''})`}
              />
            ))}
          </select>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <label htmlFor="locality">Lokalitet </label>
          <textarea className="form-control" id="locality" value={props.locality} />
        </div>
        <div className="col-md-6">
          <label htmlFor="ecology">Økologi </label>
          <textarea className="form-control" id="ecology" value={props.ecology} />
        </div>
      </div>
      <div className="row form-group">
        {InputText({ value: props.admPlace.kommune, label: 'Kommune', readOnly: true })}
        {InputText({ value: props.admPlace.fylke, label: 'Fylke', readOnly: true })}
        {InputText({ value: props.admPlace.land, label: 'Land', readOnly: true })}
      </div>
    </div>
    <div className="well">
      <div className="row form-group">
        {InputText({ value: props.station, label: 'Station' })}
        {InputText({ value: props.sample, label: 'Sample' })}
        {InputText({ value: props.ship, label: 'Ship' })}
      </div>
    </div>
  </div>
);
const OtherComponent = (props: AdmPlace) => (
  <div className="well">
    <div className="row form-group">
      {InputText({ value: props.station, label: 'Station' })}
      {InputText({ value: props.sample, label: 'Sample' })}
      {InputText({ value: props.ship, label: 'Ship' })}
    </div>
  </div>
);

const AnyReactComponent = ({ text }) => (
  <div>
    <FontAwesome name={'map-pin'} />
    {text}
  </div>
);

const GetLetLong = (props: PlaceState) => {
  const latLong =
    props.editingCoordinate &&
    props.editingCoordinate.coordinateType &&
    props.editingCoordinate.coordinateType === 'Lat/Long' &&
    props.editingCoordinate.coordinateString
      ? {
          lat: Number(props.editingCoordinate.coordinateString.split(' ')[0]),
          lng: Number(props.editingCoordinate.coordinateString.split(' ')[1])
        }
      : {
          lat: props.admPlace && props.admPlace.lat ? props.admPlace.lat : 0,
          lng: props.admPlace && props.admPlace.long ? props.admPlace.long : 0
        };
  console.log('LatLong for Map', latLong);
  return latLong && latLong.lat && latLong.lng ? latLong : undefined;
};

const MapComponent = (props: PlaceState) => (
  <div className="well">
    {GetLetLong(props) && (
      <div
        key={
          props.admPlace && props.admPlace.admPlaceId
            ? props.admPlace.admPlaceId
            : 'mapDiv'
        }
        style={{ height: '40vh', width: '100%' }}
      >
        {console.log('Map Props', props)}
        <GoogleMapReact
          key={Date()}
          // TODO change to ENV.KEY variable and change key too
          bootstrapURLKeys={{ key: 'AIzaSyD_eIPYgmzLr_FsDLVf47fJ2mOP5wvPnG4' }}
          defaultCenter={GetLetLong(props)}
          defaultZoom={
            GetLetLong(props)
              ? 8
              : props.admPlace && props.admPlace.zoom
                ? props.admPlace.zoom
                : 3
          }
        >
          <AnyReactComponent
            lat={GetLetLong(props).lat}
            lng={GetLetLong(props).lng}
            text={'Test Object info.'}
          />
        </GoogleMapReact>
      </div>
    )}
  </div>
);

const CoordinateComp = (props: CoordinateProps) => {
  return (
    <div className="panel-group">
      <div className="panel panel-default">
        <div className="panel-heading">
          <CoordinateHeader {...props} />
          <button
            onClick={e => {
              props.onToggleCollapse();
              e.preventDefault();
            }}
            className="btn btn-default"
          >
            {props.coordinateCollapsed ? 'Show details' : 'Hide details'}
          </button>
          <div
            className={`panel-collapse${props.coordinateCollapsed ? ' collapse' : ' in'}`}
          >
            <div className="panel-body">
              <div>
                <CoordinateComponent {...props} />
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              className="btn btn-default"
              onClick={e => {
                e.preventDefault();
                props.onClickSaveRevision();
              }}
            >
              {' '}
              Save revision
            </button>
            <button
              className="btn btn-default"
              onClick={e => {
                e.preventDefault();
                props.onClickSaveEdit();
              }}
            >
              {' '}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default class PlaceComponent extends React.Component<PlaceProps, PlaceState> {
  constructor(props: PlaceProps) {
    super(props);
    this.state = {
      admPlace: {
        admPlaceId: 1,
        name: 'Oslo',
        type: 'Kommune',
        overordnet: 'Oslo fylke',
        kommune: 'Oslo',
        fylke: 'Oslo fylke',
        land: 'Norge',
        lat: 59.8939224,
        long: 10.7149059,
        zoom: 12
      },
      editingCoordinate: {
        coordinateType: 'MGRS',
        altitudeUnit: 'Meters',
        depthUnit: 'Meters'
      },
      coordinateHistory: [{ coordinate: { coordinateType: 'MGRS' } }],
      coordinateCollapsed: true,
      coordinateHistoryIndeks: 0
    };
  }

  render() {
    return (
      <form style={{ padding: '20px' }}>
        <div className="row form-group">
          <div className="col-md-4">
            <AdmPlaceComponent
              {...this.state}
              onChange={t => this.setState(s => ({ ...s, ...t }))}
            />
            <MapComponent {...this.state} />
          </div>

          {console.log('Pleace state', this.state)}
          <div className="col-md-8">
            <CoordinateComp
              {...this.state.coordinateHistory[this.state.coordinateHistoryIndeks]
                .coordinate}
              coordinateHistoryIndeks={this.state.coordinateHistoryIndeks}
              coordinateHistory={this.state.coordinateHistory}
              editingCoordinate={this.state.editingCoordinate}
              coordinateType={
                this.state.coordinateHistory[this.state.coordinateHistoryIndeks]
                  .coordinate.coordinateType || 'MGRS'
              }
              coordinateCollapsed={this.state.coordinateCollapsed}
              onChangeCoordinateNumber={(fieldName: string) => (value: number) => {
                this.setState((ps: PlaceState) => {
                  return {
                    ...ps,
                    editingCoordinate: {
                      ...ps.editingCoordinate,
                      [fieldName]: value
                    }
                  };
                });
              }}
              onChangeCoordinateText={(fieldName: string) => (value: string) => {
                this.setState((ps: PlaceState) => {
                  const s = {
                    ...ps,
                    editingCoordinate: {
                      ...ps.editingCoordinate,
                      [fieldName]: value
                    }
                  };

                  return s;
                });
              }}
              getCurrentCoordinate={(ind: number) => {
                const ret = this.state.editingCoordinate;
                return ret;
              }}
              onClickSaveRevision={() => {
                this.setState((ps: PlaceState) => {
                  return {
                    ...ps,
                    coordinateHistoryIndeks: ps.coordinateHistoryIndeks + 1,
                    coordinateHistory: [
                      ...ps.coordinateHistory,
                      {
                        coordinate: ps.editingCoordinate,
                        coordinateRevisionType: 'coordinateRevision'
                      }
                    ]
                  };
                });
              }}
              onClickSaveEdit={() => {
                this.setState((ps: PlaceState) => {
                  const ret = {
                    ...ps,
                    coordinateHistoryIndeks: ps.coordinateHistory[
                      ps.coordinateHistoryIndeks
                    ].coordinateRevisionType
                      ? ps.coordinateHistoryIndeks + 1
                      : ps.coordinateHistoryIndeks,

                    coordinateHistory: ps.coordinateHistory[ps.coordinateHistoryIndeks]
                      .coordinateRevisionType
                      ? [
                          ...ps.coordinateHistory,
                          {
                            coordinate: ps.editingCoordinate,
                            coordinateRevisionType: 'coordinateEdit',
                            registeredDate: moment().format('DD.MM.YYYY HH:mm'),
                            registeredBy: 'Stein Olsen'
                          }
                        ]
                      : [
                          ...ps.coordinateHistory.slice(0, ps.coordinateHistoryIndeks),
                          {
                            coordinate: ps.editingCoordinate,
                            coordinateRevisionType: 'newCoordinate'
                          }
                        ]
                  };
                  return ret;
                });
              }}
              getCurrentHistoryItem={(ind: number) => {
                const ret = this.state.coordinateHistory[ind];
                return ret;
              }}
              onToggleCollapse={() => {
                this.setState((ps: PlaceState) => ({
                  ...ps,
                  coordinateCollapsed: ps.coordinateCollapsed ? false : true
                }));
              }}
              onChangeHistoryItem={(fieldName: string) => (value: string) => {
                console.log('OnChangeHistItem', fieldName, value);
                this.setState((ps: PlaceState) => {
                  return {
                    ...ps,
                    coordinateHistory: [
                      ...ps.coordinateHistory.slice(0, ps.coordinateHistoryIndeks),
                      {
                        ...ps.coordinateHistory[ps.coordinateHistoryIndeks],
                        [fieldName]: value
                      },
                      ...ps.coordinateHistory.slice(ps.coordinateHistoryIndeks + 1)
                    ]
                  };
                });
              }}
            />
          </div>
        </div>
      </form>
    );
  }
}
