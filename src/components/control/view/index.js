/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';
import { hashHistory } from 'react-router';
import { Grid, Row, Col, ControlLabel, Button } from 'react-bootstrap';
import ControlView from './ControlView';
import { MusitField } from '../../../components/formfields';
import Layout from '../../../layout';
import Breadcrumb from '../../../layout/Breadcrumb';
import { parseISODateNonStrict as parseISODate, DATE_FORMAT_DISPLAY } from '../../../util';
import { I18n } from 'react-i18nify';

export default class ControlViewContainer extends React.Component {
  static propTypes = {
    controls: React.PropTypes.object,
    loadControl: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    loadActorDetails: React.PropTypes.func.isRequired,
    doneBy: React.PropTypes.object,
    rootNode: React.PropTypes.object
  }

  componentWillMount() {
    if (this.props.params.controlId) {
      this.props.loadControl(this.props.params.id, this.props.params.controlId, {
        onSuccess: (control) => {
          this.props.loadActorDetails(control);
        }
      });
    }
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id);
    }
  }

  getDate(data, field) {
    return data && data[field] ? parseISODate(data[field]).format(DATE_FORMAT_DISPLAY) : '';
  }

  render() {
    if (!this.props.controls) {
      return null;  // We need data to display. If there is no data, there is nothing to display. Maybe spin wheel?
    }
    const data = this.props.controls.data;
    return (
      <Layout
        title="Magasin"
        breadcrumb={<Breadcrumb node={this.props.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.viewControl.title')}</h4>
            <Grid>
              <Row>
                <Col sm={4} md={5}>
                  <ControlLabel>{I18n.t('musit.texts.datePerformed')}</ControlLabel>
                  <br />
                  <MusitField
                    onChange={() => true}
                    value={this.getDate(data, 'doneDate')}
                    disabled
                  />
                </Col>
                <Col sm={4} md={5}>
                  <ControlLabel>{I18n.t('musit.texts.performedBy')}</ControlLabel>
                  <br />
                  <MusitField
                    onChange={() => true}
                    value={data ? data.doneBy : ''}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={4} md={5}>
                  <ControlLabel>{I18n.t('musit.texts.dateRegistered')}</ControlLabel>
                  <br />
                  <MusitField
                    onChange={() => true}
                    value={this.getDate(data, 'registeredDate')}
                    disabled
                  />
                </Col>
                <Col sm={4} md={5} >
                  <ControlLabel>{I18n.t('musit.texts.registeredBy')}</ControlLabel>
                  <br />
                  <MusitField
                    onChange={() => true}
                    value={data ? data.registeredBy : ''}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <br />
              </Row>
              <Row>
                <Col sm={8} md={10}>
                  <ControlView
                    id="1"
                    controlsJson={data}
                  />
                </Col>
              </Row>
              <Row className="row-centered" style={{ textAlign: 'center', border: '12px', borderColor: 'red' }}>
                <Col xs={10}>
                  <Button onClick={() => hashHistory.goBack()}>
                    {I18n.t('musit.texts.close')}
                  </Button>
                </Col>
              </Row>
            </Grid>
          </div>
        }
      />

    );
  }
}
