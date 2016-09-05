import React, { Component } from 'react';
import { MusitTextArea as TextArea, MusitField as Field } from '../../components/formfields'
import { Panel, Form, Grid, Row, Col, FormGroup } from 'react-bootstrap'

export default class EnvironmentRequirementComponent extends Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    updateStorageUnit: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props)

    this.state = {
      environmentRequirement: {
        temperature: '',
        temperatureTolerance: '',
        relativeHumidity: '',
        relativeHumidityTolerance: '',
        hypoxicAir: '',
        hypoxicAirTolerance: '',
        cleaning: '',
        lightningConditions: '',
        comments: ''
      }
    }

    this.temperature = {
      id: 'temperature',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.temperature.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.temperature.placeHolder'),
      onChange: (temperature) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            temperature
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }

    this.temperatureTolerance = {
      id: 'temperatureTolerance',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.placeHolder'),
      addOnPrefix: this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.addOnPrefix'),
      onChange: (temperatureTolerance) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            temperatureTolerance
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }

    this.relativeHumidity = {
      id: 'relativeHumidity',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.placeHolder'),
      onChange: (relativeHumidity) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            relativeHumidity
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }

    this.relativeHumidityTolerance = {
      id: 'relativeHumidityTolerance',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.placeHolder'),
      addOnPrefix: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.addOnPrefix'),
      onChange: (relativeHumidityTolerance) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            relativeHumidityTolerance
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }

    this.hypoxicAir = {
      id: 'inertAir',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.inertAir.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.inertAir.placeHolder'),
      onChange: (hypoxicAir) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            hypoxicAir
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }

    this.hypoxicAirTolerance = {
      id: 'inertAirTolerance',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.inertAirTolerance.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.inertAirTolerance.placeHolder'),
      addOnPrefix: this.props.translate('musit.storageUnits.environmentRequirements.inertAirTolerance.addOnPrefix'),
      onChange: (hypoxicAirTolerance) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            hypoxicAirTolerance
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }

    this.cleaning = {
      id: 'renhold',
      // placeHolder: 'test placeHolder',
      // addOnPrefix: '\u00b1',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.renhold.tooltip'),
      validate: 'text',
      onChange: (cleaning) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            cleaning
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }

    this.lightningConditions = {
      id: 'lightCondition',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.tooltip'),
      validate: 'text',
      onChange: (lightningConditions) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            lightningConditions
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }

    this.comments = {
      id: 'comments',
      numberOfRows: 4,
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.comments.tooltip'),
      validate: 'text',
      onChange: (comments) => {
        this.setState({
          environmentRequirement: {
            ...this.state.environmentRequirement,
            comments
          }
        })
        this.props.updateStorageUnit(this.state.environmentRequirement)
      }
    }
  }

  render() {
    const renderFieldBlock = (bindValue, fieldProps, label) => (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor="comments2">{label}</label>
        <div class="col-sm-9" is="null">
          <Field {...fieldProps} value={bindValue} />
        </div>
      </FormGroup>
    )

    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <Row className="row-centered">
                <Col md={6}>
                  <form className="form-horizontal">
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="comments2">
                        {this.props.translate('musit.storageUnits.environmentRequirements.temperature.labelText')}</label>
                      <div class="col-sm-5" is="null">
                        <Field {...this.temperature} value={this.state.environmentRequirement.temperature} />
                      </div>
                      <div class="col-sm-4" is="null">
                        <Field {...this.temperatureTolerance} value={this.state.environmentRequirement.temperatureTolerance} />
                      </div>
                    </div>
                  </form>
                </Col>
                <Col md={6}>
                  <form className="form-horizontal">
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="comments2">
                        {this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.labelText')}</label>
                      <div class="col-sm-5" is="null">
                        <Field {...this.relativeHumidity} value={this.state.environmentRequirement.relativeHumidity} />
                      </div>
                      <div class="col-sm-4" is="null">
                        <Field
                          {...this.relativeHumidityTolerance}
                          value={this.state.environmentRequirement.relativeHumidityTolerance}
                        />
                      </div>
                    </div>
                  </form>
                </Col>
              </Row>
              <Row className="row-centered">
                <Col md={6}>
                  <form className="form-horizontal">
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="comments2">
                        {this.props.translate('musit.storageUnits.environmentRequirements.inertAir.labelText')}</label>
                      <div class="col-sm-5" is="null">
                        <Field {...this.hypoxicAir} value={this.state.environmentRequirement.hypoxicAir} />
                      </div>
                      <div class="col-sm-4" is="null">
                        <Field {...this.hypoxicAirTolerance} value={this.state.environmentRequirement.hypoxicAirTolerance} />
                      </div>
                    </div>
                  </form>
                </Col>
                <Col md={6}>
                  <Form horizontal>
                    {renderFieldBlock(this.state.environmentRequirement.cleaning, this.cleaning,
                      this.props.translate('musit.storageUnits.environmentRequirements.renhold.labelText'))}
                  </Form>
                </Col>
              </Row>
              <Row className="row-centered">
                <Col md={6}>
                  <Form horizontal>
                    {renderFieldBlock(this.state.environmentRequirement.lightningConditions, this.lightningConditions,
                      this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.labelText'))}
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <form className="form-horizontal">
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="comments">
                        {this.props.translate('musit.storageUnits.environmentRequirements.comments.labelText')}</label>
                      <div class="col-sm-9" is="null">
                        <TextArea
                          {...this.comments}
                          value={this.state.environmentRequirement.comments}
                        />
                      </div>
                    </div>
                  </form>
                </Col>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    );
  }
}
