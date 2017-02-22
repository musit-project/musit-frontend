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
import React, {Component, PropTypes} from 'react';
import Breadcrumb from '../../components/layout/Breadcrumb';
import ModalNodeGrid from './MoveDialogGrid';
import NodeSuggest from '../../components/suggest/NodeSuggest';
import Modal from '../../components/modal/MusitModal';
import SubmitButton from '../../components/buttons/submit';
import CancelButton from '../../components/buttons/cancel';
import { I18n } from 'react-i18nify';
import PagingToolbar from '../../shared/paging';
import moveDialogStore$, {
  clear$,
  loadChildren$,
  loadNode$,
  setLoading$,
  setPage$,
  PER_PAGE
} from './moveDialogStore';
import Loader from 'react-loader';
import inject from 'react-rxjs/dist/RxInject';

export class MoveDialogComponent extends Component {

  static propTypes = {
    onMove: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    loadChildren: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    moveDialogStore: PropTypes.object,
    appSession: PropTypes.object.isRequired
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.loadHome();
  }

  loadHome() {
    this.props.clear();
    this.props.setLoading(true);
    this.props.loadChildren({
      id: null,
      museumId: this.props.appSession.getMuseumId(),
      token: this.props.appSession.getAccessToken()
    });
  }

  loadNode(id, currentPage = 1) {
    this.props.clear();
    this.props.setPage(currentPage);
    this.props.setLoading(true);
    this.props.loadNode({
      id: id,
      museumId: this.props.appSession.getMuseumId(),
      token: this.props.appSession.getAccessToken()
    });
    this.props.loadChildren({
      id: id,
      museumId: this.props.appSession.getMuseumId(),
      token: this.props.appSession.getAccessToken(),
      page: {
        page: currentPage,
        limit: PER_PAGE
      }
    });
  }

  render() {
    const { data, selectedNode, page = 1 } = this.props.moveDialogStore;

    const isSelected = Object.keys({...selectedNode}).length > 0;

    const header =
      <div style={{ width: '500px', paddingBottom: '10px' }}>
        <NodeSuggest
          appSession={this.props.appSession}
          label="Search"
          id="nodeSearch"
          onChange={ (v) => v ? this.loadNode(v) : null }
          placeHolder={I18n.t('musit.moveModal.nodeSuggestPlaceholder')}
        />
      </div>;

    let body = data.loading ?
      <div style={{ textAlign: 'center', color: 'grey' }}>
        <Loader loaded={false} />
      </div> :
      <div style={{ textAlign: 'center', color: 'grey' }}>
        {I18n.t('musit.moveModal.noData')}
      </div>;

    if (!data.loading && data.totalMatches > 0) {
      body = (
        <div>
          <ModalNodeGrid
            tableData={data.matches}
            onClick={(n) => this.loadNode(n.id)}
          />
          {data.totalMatches > PER_PAGE &&
          <PagingToolbar
            numItems={data.totalMatches}
            currentPage={page}
            perPage={PER_PAGE}
            onClick={(currentPage) => this.loadNode(selectedNode && selectedNode.id, currentPage)}
          />
          }
        </div>
      );
    }

    const footer =
      <div>
        {I18n.t('musit.moveModal.currentDestination')}
        <Breadcrumb
          node={selectedNode}
          onClickCrumb={(node) => {
            return node.id === -1 || !node.id ? this.loadHome() : this.loadNode(node.id);
          }}
        />
        <div style={{ paddingTop: '10px' }}>
          <SubmitButton
            disabled={!isSelected || data.loading}
            onClick={() => {
              this.props.setLoading(true);
              this.props.onMove(
                selectedNode,
                selectedNode.name,
                () =>  {
                  this.props.setLoading(false);
                  this.context.closeModal();
                },
                () => {
                  this.props.setLoading(false);
                }
              );
            }}
            label={I18n.t('musit.moveModal.move')}
          />
          &nbsp;
          <CancelButton
            onClick={this.context.closeModal}
            label={I18n.t('musit.texts.close')}
          />
        </div>
      </div>;

    return (
      <Modal
        className="moveDialog"
        style={{ minWidth: 700 }}
        header={header}
        body={body}
        footer={footer}
      />
    );
  }
}

const data = {
  moveDialogStore$
};

const commands = {
  clear$,
  loadChildren$,
  loadNode$,
  setLoading$,
  setPage$
};

export default inject(data, commands)(MoveDialogComponent);