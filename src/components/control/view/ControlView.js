
import React, { Component, PropTypes } from 'react'
import { Panel, FormGroup, Button, Col, Row } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import * as ObservationRender from '../../observation/render'
import { formatFloatToString } from './../../../util'
import reduce from 'lodash/reduce'

export default class ControlView extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    controlsJson: PropTypes.object
  }

  static iconMap = {
    alcohol: 'musitalcoholicon',
    cleaning: 'musitcleaningicon',
    gas: 'musitgasicon',
    hypoxicAir: 'musithypoxicairicon',
    lightingCondition: 'musitlightingcondicon',
    mold: 'musitmoldicon',
    pest: 'musitpesticon',
    relativeHumidity: 'musitrelhumidityicon',
    temperature: 'musittemperatureicon'

  }

  static typeMap = {
    alcohol: 'controlAlcohol',
    cleaning: 'controlCleaning',
    gas: 'controlGas',
    hypoxicAir: 'controlHypoxicAir',
    lightingCondition: 'controlLightingCondition',
    mold: 'controlMold',
    pest: 'controlPest',
    relativeHumidity: 'controlRelativeHumidity',
    temperature: 'controlTemperature'
  }

  constructor(props) {
    super(props);
    this.state = {
      alcohol: {
        open: false
      },
      cleaning: {
        open: false
      },
      gas: {
        open: false
      },
      hypoxicAir: {
        open: false
      },
      lightingCondition: {
        open: false
      },
      mold: {
        open: false
      },
      pest: {
        open: false
      },
      relativeHumidity: {
        open: false
      },
      temperature: {
        open: false
      }
    };

    this.showObservation = (control, controlType) => {
      let lv;
      const { ok } = control
      if (!ok) {
        const observation = control.observation;
        switch (controlType) {
          case 'temperature':
            lv = (<ObservationRender.RenderFromToNumberComment
              disabled
              translate={this.props.translate}
              type="temperature"
              valueProps={{
                fromValue: formatFloatToString(observation.range.from),
                toValue: formatFloatToString(observation.range.to),
                commentValue: observation.note
              }}
              layoutProps={{
                fromWidth: 3,
                toWidth: 3,
                commentWidth: 6
              }}
            />)
            break
          case 'alcohol':
            lv = (<ObservationRender.RenderAlcohol
              disabled
              translate={this.props.translate}
              valueProps={{
                statusValue: observation.condition,
                volumeValue: formatFloatToString(observation.volume),
                commentValue: observation.note
              }}
              layoutProps={{
                statusWidth: 3,
                volumeWidth: 3,
                commentWidth: 6
              }}
            />)
            break
          case 'cleaning':
            lv = (<ObservationRender.RenderDoubleTextArea
              disabled
              translate={this.props.translate}
              type="cleaning"
              valueProps={{
                leftValue: observation.cleaning,
                rightValue: observation.note
              }}
              layoutProps={{
                leftWidth: 6,
                rightWidth: 6
              }}
            />)
            break
          case 'gas':
            lv = (<ObservationRender.RenderDoubleTextArea
              disabled
              type="gas"
              translate={this.props.translate}
              valueProps={{
                leftValue: observation.gas,
                rightValue: observation.note
              }}
              layoutProps={{
                leftWidth: 6,
                rightWidth: 6
              }}
            />)
            break
          case 'hypoxicAir':
            lv = (<ObservationRender.RenderFromToNumberComment
              disabled
              type="hypoxicAir"
              translate={this.props.translate}
              valueProps={{
                fromValue: formatFloatToString(observation.range.from),
                toValue: formatFloatToString(observation.range.to),
                commentValue: observation.note
              }}
              layoutProps={{
                fromWidth: 3,
                toWidth: 3,
                commentWidth: 6
              }}
            />)
            break
          case 'lightingCondition':
            lv = (<ObservationRender.RenderDoubleTextArea
              disabled
              type="lightCondition"
              translate={this.props.translate}
              valueProps={{
                leftValue: observation.lightingCondition,
                rightValue: observation.note
              }}
              layoutProps={{
                leftWidth: 6,
                rightWidth: 6
              }}
            />)
            break
          case 'mold':
            lv = (<ObservationRender.RenderDoubleTextArea
              disabled
              type="mold"
              translate={this.props.translate}
              valueProps={{
                leftValue: observation.mold,
                rightValue: observation.note
              }}
              layoutProps={{
                leftWidth: 6,
                rightWidth: 6
              }}
            />)
            break
          case 'pest':
            lv = (<ObservationRender.RenderPest
              disabled
              translate={this.props.translate}
              canEdit={false}
              valueProps={{
                observations: observation.lifecycles.map(lc => {
                  return {
                    lifeCycle: lc.stage,
                    count: formatFloatToString(lc.quantity)
                  }
                }),
                identificationValue: observation.identification,
                commentValue: observation.note
              }}
              layoutProps={{
                lifeCycleWidth: 3,
                countWidth: 3,
                removeIconWidth: 1,
                addIconWidth: 1,
                commentsLeftWidth: 6,
                commentsRightWidth: 6
              }}
            />)
            break
          case 'relativeHumidity':
            lv = (<ObservationRender.RenderFromToNumberComment
              disabled
              translate={this.props.translate}
              type="relativeHumidity"
              valueProps={{
                fromValue: formatFloatToString(observation.range.from),
                toValue: formatFloatToString(observation.range.to),
                commentValue: observation.note
              }}
              layoutProps={{
                fromWidth: 3,
                toWidth: 3,
                commentWidth: 6
              }}
            />)
            break
          default:
            lv = ''
            break
        }
      }
      return lv
    }
  }

  render() {
    const { id } = this.props
    const observation = (fontName, observationType) => {
      return (
        <Col xs={5} sm={5} md={5} >
          <span className={`icon icon-${fontName}`} style={{ 'fontSize': 'x-large' }} />
          {` ${observationType}`}
        </Col>
    ) }
    const controlOk = (
      <Col xs={5} sm={5} md={5} >
        <FontAwesome name="check" style={{ 'fontSize': 'x-large' }} />
        {`  ${this.props.translate('musit.texts.ok')}`}
      </Col>
    )
    const controlNotOk = (
      <Col xs={5} sm={5} md={5} >
        <FontAwesome name="close" style={{ 'fontSize': 'x-large' }} />
        {`  ${this.props.translate('musit.texts.notOk')}`}
      </Col>
    )
    const downButton = (observationType, ok) => {
      return (
        <Col xs={1} sm={1} >
          <Button
            id={`${id}_${observationType}_downButton`}
            onClick={() => this.setState({ [observationType]: { open: !this.state[observationType].open } })}
            bsStyle="link"
          >
            {ok ? null : <FontAwesome name="sort-desc" style={{ 'fontSize': 'x-large' }} />}
          </Button>
        </Col>
      ) }

    const oneTableRow = (control, eventType) => {
      const { ok } = control
      return (
        <div>
          <Row style={{ top: '0', bottom: '0' }} >
            {observation(ControlView.iconMap[eventType],
              this.props.translate(`musit.viewControl.${ControlView.typeMap[eventType]}`))}
            {ok ? controlOk : controlNotOk}
            {downButton(eventType, ok)}
          </Row>
          <Row>
            <Panel collapsible expanded={this.state[eventType].open}>
              {this.showObservation(control, eventType)}
            </Panel>
          </Row>
        </div>
      ) }

    const getControls = () => {
      return reduce(this.props.controlsJson, (result, control, type) => {
        if (ControlView.typeMap[type]) {
          result.push(oneTableRow(control, type))
        }
        return result;
      }, [])
    }

    return (
      <FormGroup>
        {this.props.controlsJson && getControls()}
      </FormGroup>
    )
  }
}
