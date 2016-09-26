import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import MusitModal from '../../components/formfields/musitModal'

export default class ObjectGrid extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    translate: PropTypes.func.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      identifier: PropTypes.shape({
        museumNo: PropTypes.string.isRequired,
        subNo: PropTypes.string.isRequired,
      }).isRequired,
      displayName: PropTypes.string
    })).isRequired,
    onAction: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.showModal = this.showModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.state = {
      showModal: false
    }
  }

  showModal(fromId) {
    this.setState({ ...this.state, showModal: true, showModalFromId: fromId })
  }

  hideModal() {
    this.setState({ ...this.state, showModal: false, showModalFromId: null })
  }

  moveModal(toId) {
    this.props.onMove(this.state.showModalFromId, toId, {
      onSuccess: () => {
        this.setState({ ...this.state, showModal: false, showModalFromId: null })
        this.props.refresh()
      }
    })
  }

  render() {
    const { id, translate, tableData } = this.props
    return (
      <div>
        <MusitModal
          show={this.state.showModal}
          onHide={this.hideModal}
          onMove={(moveTo) => this.moveModal(moveTo)}
          headerText={this.props.translate('musit.moveModal.moveNodes')}
        />
        <FormGroup>
          <div>
            <Table responsive hover condensed>
              <thead>
                <tr>
                  <th>
                    {translate('musit.grid.object.museumsNumber')}
                  </th>
                  <th>
                    {translate('musit.grid.object.uNumber')}
                  </th>
                  <th>
                    {translate('musit.grid.object.term')}
                  </th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {tableData.map((c, i) =>
                  <tr key={i} id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}`} >
                    <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_museumNumber`}>
                      <FontAwesome name="rebel" />
                      {` ${c.identifier.museumNo}`}
                    </td>
                    <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_uNumber`}>
                      {c.identifier.subNo}
                    </td>
                    <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_term`}>
                      {c.displayName}
                    </td>
                    <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_truck`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.moveModal(c.id)
                        }}
                      >
                        <FontAwesome name="truck" />
                      </a>
                    </td>
                    <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_shoppingCart`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.props.onAction('pickObject', c)
                        }}
                      >
                        <FontAwesome name="shopping-cart" />
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    )
  }
}
