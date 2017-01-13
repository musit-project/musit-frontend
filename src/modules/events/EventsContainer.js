
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
import { I18n } from 'react-i18nify';
import { connect } from 'react-redux';
import { loadControlsAndObservationsForNode } from '../../reducers/grid/observationcontrol';
import { loadRoot } from '../storagefacility/reducers/grid/nodes';
import ObservationControlGridShow from './EventsComponent';
import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';

const getObservationControl = (state) => state.observationControlGrid.data;

const getSortedObservationControl = createSelector(
    [ getObservationControl ],
    (observationControl) => orderBy(observationControl, ['doneDate', 'id'], ['desc', 'desc'])
);

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => I18n.t(key, markdown),
    observationControlGridData: getSortedObservationControl(state),
    rootNode: state.storageGridUnit.root.data,
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadControlAndObservations: (id, museumId, callback) => {
    dispatch(loadControlsAndObservationsForNode(id, museumId, callback));
  },
  loadStorageObj: (id, museumId) => {
    dispatch(loadRoot(id, museumId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ObservationControlGridShow);
