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

import * as React from 'react';
import { Component, FocusEventHandler } from 'react';
import validate from '../common/validators';

interface MusitFieldProps {
  id?: string;
  value?: string;
  addOnPrefix?: string;
  help?: string; // always ? on add on after
  placeHolder?: string;
  tooltip?: string;
  onChange: Function; // PropTypes.func.isRequired,
  onBlur?: FocusEventHandler<any>;
  onFocus?: FocusEventHandler<any>;
  validate?: string;
  validator?: Function;
  minimumLength?: number;
  maximumLength?: number;
  precision?: number;
  disabled?: boolean;
  style?: object;
}

/* Old:
    id: PropTypes.string,
    value: PropTypes.string, // Should be any
    addOnPrefix: PropTypes.string,
    help: PropTypes.string, // always ? on add on after
    placeHolder: PropTypes.string,
    tooltip: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    validate: PropTypes.string,
    validator: PropTypes.func,
    minimumLength: PropTypes.number,
    maximumLength: PropTypes.number,
    precision: PropTypes.number,
    disabled: PropTypes.bool,
    style: PropTypes.object

*/

export default class MusitField extends Component<MusitFieldProps> {
  static defaultProps = {
    value: ''
  };

  classNameWithSpan() {
    let lvString = ' ';
    if (
      this.props.validator
        ? this.props.validator(this.props)
        : validate(this.props) === 'error'
    ) {
      lvString = 'input-group has-error';
    } else {
      lvString = 'input-group';
    }
    return lvString;
  }

  classNameOnlyWithInput() {
    let lvString = '';
    if (
      this.props.validator
        ? this.props.validator(this.props)
        : validate(this.props) === 'error'
    ) {
      lvString = 'has-error';
    } else {
      lvString = '';
    }
    return lvString;
  }

  render() {
    const lcAddOnPrefix = this.props.addOnPrefix ? (
      <span className="input-group-addon">{this.props.addOnPrefix}</span>
    ) : null;
    const lcPlaceholder = (
      <input
        id={this.props.id}
        style={this.props.style}
        type="text"
        className="form-control"
        placeholder={this.props.placeHolder}
        value={this.props.value}
        disabled={this.props.disabled}
        onChange={event => this.props.onChange(event.target.value)}
        data-toggle="tooltip"
        title={this.props.tooltip}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
      />
    );
    const lcHelp = this.props.help ? <span className="input-group-addon">?</span> : null;

    return lcAddOnPrefix !== null || lcHelp !== null ? (
      <div className={this.classNameWithSpan()}>
        {lcAddOnPrefix}
        {lcPlaceholder}
        {lcHelp}
      </div>
    ) : (
      <div className={this.classNameOnlyWithInput()}>{lcPlaceholder}</div>
    );
  }
}
