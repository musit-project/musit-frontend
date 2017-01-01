
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
import { loadChildren, clear, loadNode } from './moveDialogActions';
import { connect } from 'react-redux';
import MusitModalImpl from './MoveDialogModal';
import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';
import { customSortingStorageNodeType } from '../../util';

const getGridData = (state) => {
  if (!state.data) {
    return [];
  }
  return state.data.length ? state.data : state.data.matches || [];
};

const getSortedStorageGridUnit = createSelector(
  [ state => getGridData(state.moveDialog) ],
  (storageGridUnit) => orderBy(storageGridUnit, [(o) => customSortingStorageNodeType(o.type), (o) => toLower(o.name)])
);

export const totalNodesSelector = (state) => state.moveDialog.data && state.moveDialog.data.totalMatches;

const mapStateToProps = (state) => ({
  user: state.app.user,
  children: getSortedStorageGridUnit(state),
  totalNodes: totalNodesSelector(state),
  selectedNode: state.moveDialog.root.data
});

const loadRootChildren = (museumId) => loadChildren(null, museumId);

const mapDispatchToProps = {
  clear,
  loadNode,
  loadRootChildren,
  loadChildren
};

export default connect(mapStateToProps, mapDispatchToProps)(MusitModalImpl);