

import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import { createBreadcrumbPath, parseISODateNonStrict as parseISODate, DATE_FORMAT_DISPLAY } from '../../util'

export default class ModalMoveHistoryGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object),
    translate: PropTypes.func.isRequired
  }

  render() {
    const toPathStr = (pathStr, pathNames) => {
      const pathArr = createBreadcrumbPath(pathStr, pathNames)
      return pathArr.map(o => o.name).join('/')
    }
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th>
                  {this.props.translate('musit.moveHistory.doneDate')}
                </th>
                <th>
                  {this.props.translate('musit.moveHistory.doneBy')}
                </th>
                <th>
                  {this.props.translate('musit.moveHistory.from')}
                </th>
                <th>
                  {this.props.translate('musit.moveHistory.to')}
                </th>
              </tr>
            </thead>
            <tbody style={{ 'fontSize': '12px', padding: '10px' }}>
              {this.props.tableData.map((c, i) =>
                <tr key={i} id={`${i}`}>
                  <td id={`${i}_${c.doneDate}`}>
                    {` ${parseISODate(c.doneDate).format(DATE_FORMAT_DISPLAY)}`}
                  </td>
                  <td id={`${i}_${c.doneBy}`}>
                    {` ${c.doneBy}`}
                  </td>
                  <td id={`${i}_${c.from.path}`}>
                    {` ${toPathStr(c.from.path, c.from.pathNames)}`}
                  </td>
                  <td id={`${i}_${c.to.path}`}>
                    {` ${toPathStr(c.to.path, c.to.pathNames)}`}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    )
  }
}
