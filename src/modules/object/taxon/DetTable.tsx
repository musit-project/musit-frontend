import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';

import { DetProps, IPersonName } from './TaxonClassification';

class DetTable extends React.Component<DetProps> {
  constructor(props: DetProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.personNames && this.props.personNames.length > 0 ? (
          <div className="row">
            <div className="col-md-12">
              <table className="table table-condensed table-hover">
                <thead>
                  <tr>
                    <th>Determinators</th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.props.personNames.map((d: IPersonName, i: number) => (
                    <tr
                      key={`det-row-${i}`}
                      className={i === this.props.editingIndex ? 'info' : ''}
                    >
                      <td>{d.personName}</td>
                      <td>
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            this.props.setDetEditingIndex(i);
                          }}
                        >
                          <FontAwesome name="edit" />
                        </a>
                      </td>
                      <td>
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            this.props.onDeletePerson(i);
                          }}
                        >
                          Delete person
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ' '
        )}
        {this.props.editingDet && (
          <div className="row">
            <div className="col-md-9">
              {' '}
              <div className="form-group">
                <label htmlFor="personName">Det</label>
                <input
                  type="text"
                  className="form-control"
                  id="personName"
                  value={this.props.editingDet ? this.props.editingDet.personName : ''}
                  onChange={e => {
                    e.preventDefault();
                    this.props.editingDet &&
                      this.props.onChangePerson('personName')(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ textAlign: 'left', verticalAlign: 'bottom' }}>
                <label htmlFor="btnAddPerson">Create new</label>
                <Link
                  to={{
                    pathname: 'person/addperson',
                    state: { newName: this.props.editingDet.personName }
                  }}
                >
                  <button className="btn btn-default form-control">
                    <FontAwesome name="user-plus" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-default"
              disabled={this.props.editingDet !== undefined}
              id="btnAdd"
              onClick={e => {
                e.preventDefault();
                this.props.onAddPerson();
              }}
            >
              Add
            </button>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              disabled={this.props.editingDet === undefined}
              className="btn btn-default"
              id="btnSave"
              onClick={e => {
                e.preventDefault();
                this.props.onSavePerson();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DetTable;