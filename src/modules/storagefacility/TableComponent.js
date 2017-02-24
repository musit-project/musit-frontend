import React from 'react';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import Loader from 'react-loader';
import { Button } from 'react-bootstrap';
import NodeGrid from './NodeTable';
import ObjectGrid from './ObjectTable';
import NodeLeftMenuComponent from './TableLeftMenu';

import Layout from '../../components/layout';
import Toolbar from '../../components/layout/Toolbar';
import Breadcrumb from '../../components/layout/Breadcrumb';

import { blur, filter } from '../../shared/util';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import PagingToolbar from '../../shared/paging';
import { emitError, emitSuccess } from '../../shared/errors';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';

import MusitModal from '../movedialog/MoveDialogComponent';
import MusitModalHistory from '../movehistory/MoveHistoryComponent';

import Config from '../../config';

import { Observable } from 'rxjs';

import inject from 'react-rxjs/dist/RxInject';

import { loadChildren$, loadNode$, updateMoveDialog } from '../movedialog/moveDialogStore';

import { addNode$, addObject$ } from '../app/pickList';
import scanner$, { clear$ } from '../app/scanner';
import { showConfirm, showModal } from '../../shared/modal';

import pickList$, { isItemAdded } from '../app/pickList';

import tableStore$, {
  loadNodes$,
  loadStats$,
  loadRootNode$,
  loadObjects$,
  setLoading$,
  clearRootNode$
} from './tableStore';

import scannerIcon from '../app/scanIcon.png';

export class StorageUnitsContainer extends React.Component {
  static propTypes = {
    tableStore: React.PropTypes.object.isRequired,
    loadNodes: React.PropTypes.func.isRequired,
    loadObjects: React.PropTypes.func.isRequired,
    loadStats: React.PropTypes.func.isRequired,
    loadRootNode: React.PropTypes.func.isRequired,
    deleteNode: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    pickObject: React.PropTypes.func.isRequired,
    pickNode: React.PropTypes.func.isRequired,
    setLoading: React.PropTypes.func.isRequired,
    clearRootNode: React.PropTypes.func.isRequired,
    emitError: React.PropTypes.func.isRequired,
    emitSuccess: React.PropTypes.func.isRequired,
    pickList: React.PropTypes.object.isRequired,
    isItemAdded: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { searchPattern: '', scannerEnabled: false };
    this.loadNodes = this.loadNodes.bind(this);
    this.loadRootNode = this.loadRootNode.bind(this);
    this.loadObjects = this.loadObjects.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.moveObject = this.moveObject.bind(this);
    this.showObjectMoveHistory = this.showObjectMoveHistory.bind(this);
    this.onClickCrumb = this.onClickCrumb.bind(this);
    this.showMoveNodeModal = this.showMoveNodeModal.bind(this);
    this.showMoveObjectModal = this.showMoveObjectModal.bind(this);
    this.toggleScanner = this.toggleScanner.bind(this);
  }

  getCurrentPage(
    state = this.props.location.state
  ) {
    return state && state.currentPage;
  }

  loadRootNode(id, museumId, token) {
    this.props.clearRootNode();
    if (!id) {
      return;
    }
    this.props.loadRootNode({
      id,
      museumId,
      token,
      callback: {
        onComplete: node => {
          if (node && !new MusitNode(node).isRootNode()) {
            this.props.loadStats({id, museumId, token});
          }
        }
      }
    });
  }

  enabbleScanner() {
    this.disableScanner();
    this.scanner = this.props.subscribeToScanner((barCode) => {
      this.props.clear();
      this.processBarcode(barCode);
    });
  }

  disableScanner() {
    if (this.scanner) {
      this.scanner.unsubscribe();
    }
  }

  toggleScanner() {
    const scannerEnabled = !this.state.scannerEnabled;
    this.setState({...this.state, scannerEnabled });
    if (scannerEnabled) {
      this.enabbleScanner();
    } else {
      this.disableScanner();
    }
  }

  processBarcode(barCode) {
    const isMoveHistoryActive = this.props.classExistsOnDom('moveHistory');
    const isMoveDialogActive = this.props.classExistsOnDom('moveDialog');
    const museumId = this.props.appSession.getMuseumId();
    const collectionId = this.props.appSession.getCollectionId();
    const token = this.props.appSession.getAccessToken();
    if (barCode.uuid) {
      this.props.findByUUID({uuid: barCode.code, museumId, token}).do((response) => {
        if (!response) {
          this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode', {uuid: barCode.code})});
        } else {
          if (isMoveDialogActive) {
            this.props.updateMoveDialog(response, museumId, token);
          } else if (isMoveHistoryActive) {
            this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.cannotActOnObject')});
          } else {
            hashHistory.push('/magasin/' + response.id);
          }
        }
      }).toPromise();
    } else {
      this.props.findByBarcode({barcode: barCode.code, museumId, collectionId, token}).do(response => {
        if (!response) {
          this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject', {barcode: barCode.code})});
        } else if (Array.isArray(response)) {
          if (response.length === 1) {
            if (!response[0].currentLocationId) {
              this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noCurrentLocation')});
            } else {
              if (isMoveDialogActive) {
                this.props.updateMoveDialog(response[0], museumId, token);
              } else if (isMoveHistoryActive) {
                this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.cannotActOnObject')});
              } else {
                hashHistory.push('/magasin/' + response[0].currentLocationId + '/objects');
              }
            }
          } else {
            this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject', {barcode: barCode.code})});
          }
        } else if (response.nodeId) {
          if (isMoveDialogActive) {
            this.props.updateMoveDialog(response, museumId, token);
          } else if (isMoveHistoryActive) {
            this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.cannotActOnNode')});
          } else {
            hashHistory.push('/magasin/' + response.id);
          }
        }
      }).toPromise();
    }
  }

  componentWillUnmount() {
    this.disableScanner();
  }

  componentWillMount(
    nodeId = this.props.params.id,
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken()
  ) {
    this.loadRootNode(nodeId, museumId, token);
    if (this.props.route.showObjects) {
      this.loadObjects(nodeId, museumId, collectionId, token);
    } else {
      this.loadNodes(nodeId, museumId, token);
    }
  }

  componentWillReceiveProps(newProps) {
    const museumHasChanged = newProps.appSession.getMuseumId() !== this.props.appSession.getMuseumId();
    const collectionHasChanged = newProps.appSession.getCollectionId() !== this.props.appSession.getCollectionId();
    const museumId = newProps.appSession.getMuseumId();
    const collectionId = newProps.appSession.getCollectionId();
    const token = this.props.appSession.getAccessToken();
    const nodeId = museumHasChanged ? null : newProps.params.id;
    const locationState = newProps.location.state;
    const idHasChanged = newProps.params.id !== this.props.params.id;
    const stateHasChanged = locationState !== this.props.location.state;

    if (idHasChanged || museumHasChanged || collectionHasChanged || stateHasChanged) {
      const currentPage = this.getCurrentPage(locationState);
      this.loadRootNode(nodeId, museumId, token);
      if (newProps.route.showObjects) {
        this.loadObjects(nodeId, museumId, collectionId, token, currentPage);
      } else {
        this.loadNodes(nodeId, museumId, token, currentPage);
      }
    }
  }

  onClickCrumb(node) {
    this.props.goTo(node.url);
  }

  showNodes(
    node = this.props.tableStore.rootNode
  ) {
    if (node && node.id) {
      this.props.goTo(`/magasin/${node.id}`);
    } else {
      this.props.goTo('/magasin');
    }
  }

  showObjects(
    node = this.props.tableStore.rootNode
  ) {
    if (node) {
      this.props.goTo(`/magasin/${node.id}/objects`);
    } else {
      this.props.goTo('/magasin');
    }
  }

  loadNodes(
    id,
    museumId = this.props.appSession.getMuseumId(),
    token = this.props.appSession.getAccessToken(),
    page
  ) {
    this.props.setLoading();
    this.props.loadNodes({
      id,
      museumId,
      page,
      token
    });
  }

  loadObjects(
    id,
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken(),
    page
  ) {
    if (id) {
      this.props.setLoading();
      this.props.loadObjects({
        id,
        museumId,
        collectionId,
        page,
        token
      });
    }
  }

  showMoveNodeModal(
    nodeToMove
  ) {
    const title = I18n.t('musit.moveModal.moveNode', { name: nodeToMove.name });
    this.props.showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveNode(nodeToMove)} />);
  }

  moveNode = (
    nodeToMove,
    userId = this.props.appSession.getActor().getActorId(),
    museumId = this.props.appSession.getMuseumId(),
    token = this.props.appSession.getAccessToken(),
    nodeId = this.props.tableStore.rootNode.id,
    moveNode = this.props.moveNode,
    loadNodes = this.loadNodes,
    loadRootNode = this.loadRootNode
  ) => (toNode, toName, onSuccess, onFailure = () => true) => {
    const errorMessage = checkNodeBranchAndType(nodeToMove, toNode);
    if (!errorMessage) {
      nodeToMove.moveNode({ destination: toNode.id, doneBy: userId, museumId, token, callback: {
        onComplete: () => {
          onSuccess();
          loadRootNode(nodeId, museumId, token);
          loadNodes(nodeId);
          this.props.emitSuccess({
            type: 'movedSuccess',
            message: I18n.t('musit.moveModal.messages.nodeMoved', {name: nodeToMove.name, destination: toName})
          });
        },
        onFailure: (e) => {
          onFailure();
          this.props.emitError({
            type: 'errorOnMove',
            error: e,
            message: I18n.t('musit.moveModal.messages.errorNode', {name: nodeToMove.name, destination: toName})
          });
        }
      }});
    } else {
      onFailure();
      this.props.emitError({
        type: 'errorOnMove',
        message: errorMessage
      });
    }
  };

  showMoveObjectModal(
    objectToMove
  ) {
    const objStr = objectToMove.getObjectDescription();
    const title = I18n.t('musit.moveModal.moveObject', { name: objStr });
    this.props.showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveObject(objectToMove)} />, this.props.clearMoveDialog);
  }

  moveObject = (
    objectToMove,
    userId = this.props.appSession.getActor().getActorId(),
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken(),
    nodeId = this.props.tableStore.rootNode.id,
    loadObjects = this.loadObjects
  ) => (toNode, toName, onSuccess, onFailure = () => true) => {
    const description = objectToMove.getObjectDescription();
    objectToMove.moveObject({ destination: toNode.id, doneBy: userId, museumId, collectionId, token, callback: {
      onComplete: () => {
        onSuccess();
        loadObjects(nodeId);
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', {name: description, destination: toName})
        });
      },
      onFailure: (e) => {
        onFailure();
        this.props.emitError({
          type: 'errorOnMove',
          error: e,
          message: I18n.t('musit.moveModal.messages.errorObject', {name: description, destination: toName})
        });
      }
    }});
  };

  showObjectMoveHistory(
    objectToShowHistoryFor
  ) {
    const objStr = objectToShowHistoryFor.getObjectDescription();
    const componentToRender = <MusitModalHistory appSession={this.props.appSession} objectId={objectToShowHistoryFor.id} />;
    const title = `${I18n.t('musit.moveHistory.title')} ${objStr}`;
    this.props.showModal(title, componentToRender);
  }

  makeToolbar(
    nodeId = this.props.params.id,
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken(),
    showObjects = this.props.route.showObjects,
    searchPattern = this.state.searchPattern
  ) {
    return <Toolbar
      showRight={!!showObjects}
      showLeft={!showObjects}
      labelRight={I18n.t('musit.grid.button.objects')}
      labelLeft={I18n.t('musit.grid.button.nodes')}
      placeHolderSearch={I18n.t('musit.grid.search.placeHolder')}
      searchValue={searchPattern}
      scannerEnabled={this.state.scannerEnabled}
      toggleScanner={this.toggleScanner}
      onSearchChanged={(newPattern) => this.setState({ ...this.state, searchPattern: newPattern })}
      clickShowRight={() => {
        this.showObjects();
        this.loadObjects(nodeId, museumId, collectionId, token);
        blur();
      }}
      clickShowLeft={() => {
        this.showNodes();
        this.loadNodes(nodeId, museumId, token);
        blur();
      }}
    />;
  }

  makeLeftMenu(
    museumId = this.props.appSession.getMuseumId(),
    token = this.props.appSession.getAccessToken(),
    rootNode = this.props.tableStore.rootNode,
    stats = this.props.tableStore.stats,
    deleteNode = this.props.deleteNode,
    moveNode = this.showMoveNodeModal,
    confirm = this.props.showConfirm
  ) {
    return (
      <div style={{ paddingTop: 10 }}>
        <NodeLeftMenuComponent
          showNewNode={!!rootNode}
          showButtons={rootNode && !rootNode.isRootNode()}
          onClickNewNode={() => {
            if (rootNode.id) {
              this.props.goTo(`/magasin/${rootNode.id}/add`);
            } else {
              this.props.goTo('/magasin/add');
            }
          }}
          stats={stats}
          onClickProperties={() => {
            this.props.goTo({
              pathname: `/magasin/${rootNode.id}/view`,
              state: rootNode
            });
          }}
          onClickControlObservations={() => this.props.goTo(`/magasin/${rootNode.id}/controlsobservations`)}
          onClickObservations={() => this.props.goTo(`/magasin/${rootNode.id}/observations`)}
          onClickController={() => this.props.goTo(`/magasin/${rootNode.id}/controls`)}
          onClickMoveNode={() => moveNode(rootNode)}
          onClickDelete={() => {
            const message = I18n.t('musit.leftMenu.node.deleteMessages.askForDeleteConfirmation', {
              name: rootNode.name
            });
            confirm(message, () => {
              deleteNode({ id: rootNode.id, museumId, token, callback: {
                onComplete: () => {
                  if (rootNode.isPartOf) {
                    hashHistory.replace(`/magasin/${rootNode.isPartOf}`);
                  }
                  this.props.emitSuccess({
                    type: 'deleteSuccess',
                    message: I18n.t('musit.leftMenu.node.deleteMessages.confirmDelete', {name: rootNode.name})
                  });
                },
                onFailure: (e) => {
                  if (e.status===403) {
                    this.props.emitError({
                      type: 'deleteError',
                      message: I18n.t('musit.errorMainMessages.notAllowed')
                    });
                  } else if (e.status===400) {
                    this.props.emitError({
                      type: 'deleteError',
                      message: I18n.t('musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild')
                    });
                  } else {
                    this.props.emitError({
                      type: 'deleteError',
                      message: e.message
                    });
                  }
                }
              }}).toPromise();
            });
          }}
        />
      </div>
    );
  }

  makeContentGrid(
    searchPattern = this.state.searchPattern,
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken(),
    rootNode = this.props.tableStore.rootNode,
    children = this.props.tableStore.children,
    showObjects = this.props.route.showObjects,
    moveNode = this.showMoveNodeModal,
    moveObject = this.showMoveObjectModal,
    showHistory = this.showObjectMoveHistory
  ) {
    const currentPage = this.getCurrentPage() || 1;
    const matches = children && children.data && children.data.matches;
    const totalMatches = children && children.data && children.data.totalMatches;
    const isLoading = children && children.loading;
    const showPaging = totalMatches > 0 && totalMatches > Config.magasin.limit;
    if (showObjects) {
      return (
        <Loader loaded={!isLoading}>
          <ObjectGrid
            tableData={matches && matches[0] && !!matches[0].museumNo ?
              filter(matches, ['museumNo', 'subNo', 'term'], searchPattern) : []}
            showMoveHistory={showHistory}
            pickObject={(object) =>
              this.props.pickObject({
                object,
                breadcrumb: rootNode.breadcrumb,
                museumId,
                collectionId,
                token
              })
            }
            isObjectAdded={(object) => this.props.isItemAdded( object , this.props.pickList.objects )}
            onMove={moveObject}
          />
          {showPaging &&
            <PagingToolbar
              numItems={totalMatches}
              currentPage={currentPage}
              perPage={Config.magasin.limit}
              onClick={(cp) => {
                hashHistory.replace({
                  pathname: `/magasin/${rootNode.id}/objects`,
                  state: {
                    currentPage: cp
                  }
                });
              }}
            />
          }
        </Loader>
      );
    }
    return (
      <Loader loaded={!isLoading}>
        <NodeGrid
          tableData={matches && matches[0] && !!matches[0].name ?
            filter(matches, ['name'], searchPattern) : []}
          goToEvents={(node) => this.props.goTo(`/magasin/${node.id}/controlsobservations`)}
          onMove={moveNode}
          pickNode={(node) => this.props.pickNode({ node, breadcrumb: rootNode.breadcrumb})}
          isNodeAdded={(node) => this.props.isItemAdded( node , this.props.pickList.nodes )}
          onClick={(node) => this.props.goTo(`/magasin/${node.id}`)}
        />
        {showPaging &&
          <PagingToolbar
            numItems={totalMatches}
            currentPage={currentPage}
            perPage={Config.magasin.limit}
            onClick={(cp) => {
              hashHistory.replace({
                pathname: `/magasin/${rootNode.id}`,
                state: {
                  currentPage: cp
                }
              });
            }}
          />
        }
      </Loader>
    );
  }

  render() {
    const title = (
      <div>
        <span>{I18n.t('musit.storageUnits.title')}</span>
        <div
          style={{
            float: 'right',
            margin: '0 25px 0 0'
          }}
        >
          <Button active={this.state.scannerEnabled} onClick={this.toggleScanner}>
            <img src={scannerIcon} height={25} alt="scan" />
          </Button>
        </div>
      </div>
    );
    return (
      <Layout
        title={title}
        breadcrumb={<Breadcrumb node={this.props.tableStore.rootNode} onClickCrumb={this.onClickCrumb} />}
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContentGrid()}
      />
    );
  }
}

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  tableStore$,
  pickList$
};

const commands = {
  clearRootNode$,
  loadStats$,
  loadRootNode$,
  loadNodes$,
  loadObjects$,
  setLoading$,
  clear$,
  loadNode$,
  loadChildren$
};

const props = {
  pickNode: MusitNode.pickNode(addNode$),
  pickObject: MusitObject.pickObject(addObject$),
  deleteNode: MusitNode.deleteNode(),
  findByUUID: MusitNode.findByUUID(),
  findByBarcode: MusitNode.findNodeOrObjectByBarcode(),
  goTo: hashHistory.push.bind(hashHistory),
  classExistsOnDom: (className) => document.getElementsByClassName(className).length > 0,
  subscribeToScanner: (next, err, complete) => scanner$.subscribe(next, err, complete),
  updateMoveDialog,
  isItemAdded,
  showConfirm,
  showModal,
  emitError,
  emitSuccess
};

export default inject(data, commands, props)(StorageUnitsContainer);
