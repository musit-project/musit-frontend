import React from 'react'
import { Checkbox, ControlLabel, Grid, Row, Col } from 'react-bootstrap'
export default class EnvironmentOptions extends React.Component {
  static propTypes = {
    unit: React.PropTypes.shape({
      sikringSkallsikring: React.PropTypes.bool,
      sikringTyverisikring: React.PropTypes.bool,
      sikringBrannsikring: React.PropTypes.bool,
      sikringVannskaderisiko: React.PropTypes.bool,
      sikringRutineOgBeredskap: React.PropTypes.bool,
      bevarLuftfuktOgTemp: React.PropTypes.bool,
      bevarLysforhold: React.PropTypes.bool,
      temperatur: React.PropTypes.bool,
      bevarPrevantKons: React.PropTypes.bool,
    }),
    updateSkallsikring: React.PropTypes.func.isRequired,
    updateTyverisikring: React.PropTypes.func.isRequired,
    updateBrannsikring: React.PropTypes.func.isRequired,
    updateVannskaderisiko: React.PropTypes.func.isRequired,
    updateRutinerBeredskap: React.PropTypes.func.isRequired,
    updateLuftfuktighet: React.PropTypes.func.isRequired,
    updateLysforhold: React.PropTypes.func.isRequired,
    updateTemperatur: React.PropTypes.func.isRequired,
    updatePreventivKonservering: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col lg={6} md={6} sm={6} xs={12}>
            <ControlLabel>Sikring</ControlLabel>
            <Checkbox
              checked={this.props.unit.sikringSkallsikring}
              onChange={(event) => this.props.updateSkallsikring(event.target.checked)}
            >
              Skallsikring
            </Checkbox>
            <Checkbox
              checked={this.props.unit.sikringTyverisikring}
              onChange={(event) => this.props.updateTyverisikring(event.target.checked)}
            >
              Tyverisikring
            </Checkbox>
            <Checkbox
              checked={this.props.unit.sikringBrannsikring}
              onChange={(event) => this.props.updateBrannsikring(event.target.checked)}
            >
              Brannsikring
            </Checkbox>
            <Checkbox
              checked={this.props.unit.sikringVannskaderisiko}
              onChange={(event) => this.props.updateVannskaderisiko(event.target.checked)}
            >
              Vannskaderisiko
            </Checkbox>
            <Checkbox
              checked={this.props.unit.sikringRutineOgBeredskap}
              onChange={(event) => this.props.updateRutinerBeredskap(event.target.checked)}
            >
              Rutiner/beredskap
            </Checkbox>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <ControlLabel>Bevaring</ControlLabel>

            <Checkbox
              checked={this.props.unit.bevarLuftfuktOgTemp}
              onChange={(event) => this.props.updateLuftfuktighet(event.target.checked)}
            >
              Luftfuktighet
            </Checkbox>
            <Checkbox
              checked={this.props.unit.bevarLysforhold}
              onChange={(event) => this.props.updateLysforhold(event.target.checked)}
            >
              Lysforhold
            </Checkbox>
            <Checkbox
              checked={this.props.unit.temperatur}
              onChange={(event) => this.props.updateTemperatur(event.target.checked)}
            >
              Temperatur
            </Checkbox>
            <Checkbox
              checked={this.props.unit.bevarPrevantKons}
              onChange={(event) => this.props.updatePreventivKonservering(event.target.checked)}
            >
              Preventiv Konservering
            </Checkbox>
          </Col>
        </Row>
      </Grid>
    )
  }
}
