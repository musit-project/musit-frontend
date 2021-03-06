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
import { Component } from 'react';
import validate from '../common/validators';

interface MusitTextAreaProps {
  id?: string;
  value?: string;
  placeHolder?: string;
  tooltip?: string;
  onChange: Function;
  validate?: string;
  minimumLength?: number;
  maximumLength?: number;
  precision?: number;
  numberOfRows?: number;
  disabled?: boolean;
}

/* Old:
    value: PropTypes.string, // Should be any
    placeHolder: PropTypes.string,
    tooltip: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.string,
    minimumLength: PropTypes.number,
    maximumLength: PropTypes.number,
    precision: PropTypes.number,
    numberOfRows: PropTypes.number,
    disabled: PropTypes.bool

*/

export default class MusitTextArea extends Component<MusitTextAreaProps> {
  classNameOnlyWithInput() {
    let lvString = '';
    if (validate(this.props) === 'error') {
      lvString = 'has-error';
    } else {
      lvString = '';
    }
    return lvString;
  }

  render() {
    const lcPlaceholder = (
      <textarea
        id={this.props.id}
        className="form-control"
        placeholder={this.props.placeHolder}
        value={this.props.value}
        rows={this.props.numberOfRows}
        disabled={this.props.disabled}
        onChange={event => this.props.onChange(event.target.value)}
        title={this.props.tooltip}
      />
    );

    return <div className={this.classNameOnlyWithInput()}>{lcPlaceholder}</div>;
  }
}
