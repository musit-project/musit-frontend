import * as React from 'react';
import { I18n } from 'react-i18nify';
import * as Loader from 'react-loader';
import NodeGrid from './NodeTable';
import ObjectGrid from './ObjectTable';
import NodeLeftMenuComponent from './TableLeftMenu';
import Layout from '../../components/layout';
import Toolbar from '../../components/layout/Toolbar';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { blur, filter } from '../../shared/util';
import MusitNode, { Paging } from '../../models/node';
import MusitObject from '../../models/object';
import Actor from '../../models/actor';
import PagingToolbar from '../../components/PagingToolbar';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import MusitModal from '../movedialog/MoveDialogComponent';
import MusitModalHistory from '../movehistory/MoveHistoryComponent';
import Config from '../../config';
import ScannerButton from '../../components/scanner/ScannerButton';
import { TODO, MUSTFIX } from '../../types/common';
import { AppSession } from '../../types/appSession';
import { Match } from '../../types/Routes';
import { PicklistData } from '../../types/picklist';
import { History } from 'history';

interface TableComponentProps {
  appSession: AppSession;
  tableStore: TODO;
  loadNodes: Function;
  loadObjects: Function;
  loadStats: Function;
  loadRootNode: Function;
  deleteNode: Function;
  match: Match<TODO>;
  pickObject: Function;
  pickNode: Function;
  setLoading: Function;
  clearRootNode: Function;
  emitError: Function;
  emitSuccess: Function;
  pickList: PicklistData;
  isItemAdded: Function;
  toggleScanner: Function;
  scannerEnabled: boolean;
  goTo: Function;
  history: History;
  sampleStore: TODO;
  getSamplesForNode: Function;
  getSampleTypes: Function;

  //Added some missing items:
  showObjects: boolean;
  showSamples: boolean;
  location: TODO;
  showModal: Function;
  moveNode: Function;
  showConfirm: MUSTFIX;

  clearMoveDialog: MUSTFIX;
  searchPattern: TODO;
}

/* Old:
static propTypes = {
    appSession: PropTypes.object.isRequired,
    tableStore: PropTypes.object.isRequired,
    loadNodes: PropTypes.func.isRequired,
    loadObjects: PropTypes.func.isRequired,
    loadStats: PropTypes.func.isRequired,
    loadRootNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    pickObject: PropTypes.func.isRequired,
    pickNode: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    clearRootNode: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired,
    pickList: PropTypes.object.isRequired,
    isItemAdded: PropTypes.func.isRequired,
    toggleScanner: PropTypes.func.isRequired,
    scannerEnabled: PropTypes.bool.isRequired,
    goTo: PropTypes.func.isRequired,
    history: PropTypes.object,
    sampleStore: PropTypes.object.isRequired,
    getSamplesForNode: PropTypes.func.isRequired,
    getSampleTypes: PropTypes.func.isRequired
  };
*/

interface TableComponentState {
  searchPattern: TODO;
}

export default class TableComponent extends React.Component<
  TableComponentProps,
  TableComponentState
> {
  constructor(props: TableComponentProps) {
    super(props);
    this.state = { searchPattern: '' };
    this.loadNodes = this.loadNodes.bind(this);
    this.loadRootNode = this.loadRootNode.bind(this);
    this.loadObjects = this.loadObjects.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.moveObject = this.moveObject.bind(this);
    this.showObjectMoveHistory = this.showObjectMoveHistory.bind(this);
    this.showMoveNodeModal = this.showMoveNodeModal.bind(this);
    this.showMoveObjectModal = this.showMoveObjectModal.bind(this);
    this.showNodes = this.showNodes.bind(this);
    this.getSamplesForNode = this.getSamplesForNode.bind(this);
  }

  loadRootNode(nodeId: TODO, museumId: number, token: string) {
    this.props.clearRootNode();
    if (!nodeId) {
      return;
    }
    this.props.loadRootNode({
      id: nodeId,
      museumId,
      token,
      callback: {
        onComplete: (node: TODO) => {
          if (node && !MusitNode.isRootNode(node)) {
            this.props.loadStats({ id: nodeId, museumId, token });
          }
        }
      }
    });
  }

  componentWillMount(
    nodeId = this.props.match.params.id,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken
  ) {
    const currentPage = this.props.match.params.page;
    this.loadRootNode(nodeId, museumId, token);
    this.props.getSampleTypes({ museumId, collectionId, token });
    if (this.props.showObjects) {
      this.loadObjects(nodeId, museumId, collectionId, token, currentPage);
    } else if (this.props.showSamples) {
      this.getSamplesForNode(nodeId, museumId, collectionId, token);
    } else {
      this.loadNodes(nodeId, museumId, token, { page: currentPage });
    }
  }

  componentWillReceiveProps(newProps: TableComponentProps) {
    const museumHasChanged =
      newProps.appSession.museumId !== this.props.appSession.museumId;
    const collectionHasChanged =
      newProps.appSession.collectionId !== this.props.appSession.collectionId;
    const museumId = newProps.appSession.museumId;
    const collectionId = newProps.appSession.collectionId;
    const token = this.props.appSession.accessToken;

    const newParams = newProps.match.params || {};
    const curParams = this.props.match.params || {};

    const locationState = newProps.location.state;
    const idHasChanged = newParams.id !== curParams.id;
    const stateHasChanged = locationState !== this.props.location.state;
    const pageHasChanged = newParams.page !== curParams.page;
    if (
      idHasChanged ||
      pageHasChanged ||
      museumHasChanged ||
      collectionHasChanged ||
      stateHasChanged
    ) {
      const nodeId = museumHasChanged ? null : newParams.id;
      const currentPage = newParams.page;
      this.loadRootNode(nodeId, museumId, token);
      if (newProps.showObjects) {
        this.loadObjects(nodeId, museumId, collectionId, token, currentPage);
      } else if (newProps.showSamples) {
        this.getSamplesForNode(nodeId, museumId, collectionId, token);
      } else {
        this.loadNodes(nodeId, museumId, token, { page: currentPage });
      }
    }
  }

  showNodes(node = this.props.tableStore.rootNode) {
    const appSession = this.props.appSession;
    if (node && node.nodeId) {
      this.props.goTo(
        Config.magasin.urls.client.storagefacility.goToNode(node.nodeId, appSession)
      );
    } else {
      this.props.goTo(Config.magasin.urls.client.storagefacility.goToRoot(appSession));
    }
  }

  showObjects(node = this.props.tableStore.rootNode) {
    const appSession = this.props.appSession;
    if (node && node.nodeId) {
      this.props.goTo(
        Config.magasin.urls.client.storagefacility.goToObjects(node.nodeId, appSession)
      );
    } else {
      this.props.goTo(Config.magasin.urls.client.storagefacility.goToRoot(appSession));
    }
  }

  showSamples(node = this.props.tableStore.rootNode) {
    const appSession = this.props.appSession;
    if (node && node.nodeId) {
      this.props.goTo(
        Config.magasin.urls.client.storagefacility.goToSamples(node.nodeId, appSession)
      );
    } else {
      this.props.goTo(Config.magasin.urls.client.storagefacility.goToRoot(appSession));
    }
  }

  loadNodes(
    id: string,
    museumId = this.props.appSession.museumId,
    token = this.props.appSession.accessToken,
    page?: Paging
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
    id: TODO,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken,
    page?: Paging
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

  getSamplesForNode(
    nodeId: TODO,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken
  ) {
    if (nodeId) {
      this.props.getSamplesForNode({
        nodeId,
        museumId,
        collectionId,
        token
      });
    }
  }

  showMoveNodeModal(nodeToMove: TODO) {
    const title = I18n.t('musit.moveModal.moveNode', { name: nodeToMove.name });
    this.props.showModal(
      title,
      <MusitModal appSession={this.props.appSession} onMove={this.moveNode(nodeToMove)} />
    );
  }

  moveNode = (
    nodeToMove: TODO,
    userId = Actor.getActorId(this.props.appSession.actor),
    museumId = this.props.appSession.museumId,
    token = this.props.appSession.accessToken,
    nodeId = this.props.tableStore.rootNode.nodeId,
    moveNode = this.props.moveNode,
    loadNodes = this.loadNodes,
    loadRootNode = this.loadRootNode
  ) => (toNode: TODO, toName: TODO, onSuccess: Function, onFailure = () => true) => {
    const errorMessage = checkNodeBranchAndType(nodeToMove, toNode);
    if (!errorMessage) {
      MusitNode.moveNode()({
        id: nodeToMove.nodeId,
        destination: toNode.nodeId,
        doneBy: userId as MUSTFIX,
        museumId,
        token,
        callback: {
          onComplete: () => {
            onSuccess();
            loadRootNode(nodeId, museumId, token);
            loadNodes(nodeId);
            this.props.emitSuccess({
              type: 'movedSuccess',
              message: I18n.t('musit.moveModal.messages.nodeMoved', {
                name: nodeToMove.name,
                destination: toName
              })
            });
          },
          onFailure: (e: TODO) => {
            onFailure();
            this.props.emitError({
              type: 'errorOnMove',
              error: e,
              message: I18n.t('musit.moveModal.messages.errorNode', {
                name: nodeToMove.name,
                destination: toName
              })
            });
          }
        }
      }).toPromise();
    } else {
      onFailure();
      this.props.emitError({
        type: 'errorOnMove',
        message: errorMessage
      });
    }
  };

  showMoveObjectModal(objectToMove: TODO) {
    const objStr = MusitObject.getObjectDescription(objectToMove);
    const title = I18n.t('musit.moveModal.moveObject', { name: objStr });
    this.props.showModal(
      title,
      <MusitModal
        appSession={this.props.appSession}
        onMove={this.moveObject(objectToMove)}
      />,
      this.props.clearMoveDialog
    );
  }

  moveObject = (
    objectToMove: TODO,
    userId = Actor.getActorId(this.props.appSession.actor),
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken,
    nodeId = this.props.tableStore.rootNode.nodeId,
    loadObjects = this.loadObjects,
    getSamplesForNode = this.getSamplesForNode
  ) => (toNode: TODO, toName: TODO, onSuccess: Function, onFailure = () => true) => {
    const description = MusitObject.getObjectDescription(objectToMove);
    MusitObject.moveObjects({
      object: objectToMove,
      destination: toNode.nodeId,
      doneBy: userId as MUSTFIX,
      museumId,
      collectionId,
      token,
      callback: {
        onComplete: () => {
          onSuccess();
          loadObjects(nodeId);
          getSamplesForNode(nodeId);
          this.props.emitSuccess({
            type: 'movedSuccess',
            message: I18n.t('musit.moveModal.messages.objectMoved', {
              name: description,
              destination: toName
            })
          });
        },
        onFailure: e => {
          onFailure();
          this.props.emitError({
            type: 'errorOnMove',
            error: e,
            message: I18n.t('musit.moveModal.messages.errorObject', {
              name: description,
              destination: toName
            })
          });
        }
      }
    });
  };

  showObjectMoveHistory(objectToShowHistoryFor: TODO) {
    const objStr = MusitObject.getObjectDescription(objectToShowHistoryFor);
    const componentToRender = (
      <MusitModalHistory
        appSession={this.props.appSession}
        objectId={objectToShowHistoryFor.uuid}
      />
    );
    const title = `${I18n.t('musit.moveHistory.title')} ${objStr}`;
    this.props.showModal(title, componentToRender);
  }

  makeToolbar(
    nodeId = this.props.match.params.id,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken,
    showObjects = this.props.showObjects,
    showSamples = this.props.showSamples,
    searchPattern = this.state.searchPattern
  ) {
    return (
      <Toolbar
        showCenter={showObjects}
        showLeft={!showObjects && !showSamples}
        showRight={showSamples}
        labelCenter={I18n.t('musit.grid.button.objects')}
        labelLeft={I18n.t('musit.grid.button.nodes')}
        labelRight={I18n.t('musit.grid.button.samples')}
        placeHolderSearch={I18n.t('musit.grid.search.placeHolder')}
        searchValue={searchPattern}
        onSearchChanged={(newPattern: TODO) =>
          this.setState(ps => ({ ...ps, searchPattern: newPattern }))
        }
        clickShowCenter={() => {
          this.showObjects();
          blur();
        }}
        clickShowLeft={() => {
          this.showNodes();
          blur();
        }}
        clickShowRight={() => {
          this.showSamples();
          blur();
        }}
      />
    );
  }

  makeLeftMenu(
    museumId = this.props.appSession.museumId,
    token = this.props.appSession.accessToken,
    rootNode = this.props.tableStore.rootNode,
    stats = this.props.tableStore.stats,
    deleteNode = this.props.deleteNode,
    moveNode = this.showMoveNodeModal,
    confirm = this.props.showConfirm
  ) {
    return (
      <div style={{ paddingTop: 10 }}>
        <NodeLeftMenuComponent
          appSession={this.props.appSession}
          showNewNode={!!rootNode}
          showButtons={rootNode && !MusitNode.isRootNode(rootNode)}
          onClickNewNode={() =>
            this.props.goTo(
              Config.magasin.urls.client.storagefacility.addNode(
                rootNode.nodeId,
                this.props.appSession
              )
            )
          }
          stats={stats}
          onClickProperties={() => {
            this.props.goTo({
              pathname: Config.magasin.urls.client.storagefacility.editNode(
                rootNode.nodeId,
                this.props.appSession
              ),
              state: rootNode
            });
          }}
          onClickControlObservations={() =>
            this.props.goTo(
              Config.magasin.urls.client.storagefacility.viewControlsObservations(
                rootNode.nodeId,
                this.props.appSession
              )
            )
          }
          onClickMoveNode={() => moveNode(rootNode)}
          onClickDelete={() => {
            const message = I18n.t(
              'musit.leftMenu.node.deleteMessages.askForDeleteConfirmation',
              {
                name: rootNode.name
              }
            );
            confirm(message, () => {
              deleteNode({
                id: rootNode.nodeId,
                museumId,
                token,
                callback: {
                  onComplete: () => {
                    if (rootNode.isPartOf) {
                      this.props.history.replace(
                        Config.magasin.urls.client.storagefacility.goToNode(
                          rootNode.pathNames.filter(
                            (path: TODO) => path.nodeId === rootNode.isPartOf
                          )[0].nodeUuid,
                          this.props.appSession
                        )
                      );
                    }
                    this.props.emitSuccess({
                      type: 'deleteSuccess',
                      message: I18n.t(
                        'musit.leftMenu.node.deleteMessages.confirmDelete',
                        { name: rootNode.name }
                      )
                    });
                  },
                  onFailure: (e: TODO) => {
                    if (e.status === 403) {
                      this.props.emitError({
                        type: 'deleteError',
                        message: I18n.t('musit.errorMainMessages.notAllowed')
                      });
                    } else if (e.status === 400) {
                      this.props.emitError({
                        type: 'deleteError',
                        message: I18n.t(
                          'musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild'
                        )
                      });
                    } else {
                      this.props.emitError({
                        type: 'deleteError',
                        message: e.message
                      });
                    }
                  }
                }
              }).toPromise();
            });
          }}
        />
      </div>
    );
  }

  makeContentGrid(
    searchPattern = this.state.searchPattern,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken,
    rootNode = this.props.tableStore.rootNode,
    children = this.props.tableStore.children,
    showObjects = this.props.showObjects,
    showSamples = this.props.showSamples,
    moveNode = this.showMoveNodeModal,
    moveObject = this.showMoveObjectModal,
    showHistory = this.showObjectMoveHistory
  ) {
    const currentPage = this.props.match.params.page || 1;
    const matches = children && children.data && children.data.matches;
    const totalMatches = children && children.data && children.data.totalMatches;
    const isLoading = children && children.loading;
    const showPaging = totalMatches > 0 && totalMatches > Config.magasin.limit;
    if (showObjects || showSamples) {
      return (
        <Loader loaded={!isLoading}>
          <ObjectGrid
            tableData={
              matches ? filter(matches, ['museumNo', 'subNo', 'term'], searchPattern) : []
            }
            showMoveHistory={showHistory}
            pickObject={object =>
              this.props.pickObject({
                object,
                breadcrumb: rootNode.breadcrumb,
                museumId,
                collectionId,
                token
              })
            }
            goToObject={(uuid, objectType) =>
              this.props.history.push(
                objectType === 'sample'
                  ? Config.magasin.urls.client.analysis.gotoSample(
                      this.props.appSession,
                      uuid
                    )
                  : Config.magasin.urls.client.object.gotoObject(
                      this.props.appSession,
                      uuid
                    )
              )
            }
            isObjectAdded={object =>
              this.props.isItemAdded(object, this.props.pickList.objects)
            }
            onMove={moveObject}
            sampleStore={showSamples ? this.props.sampleStore : {}}
            appSession={this.props.appSession}
          />
          {showPaging && (
            <PagingToolbar
              numItems={totalMatches}
              currentPage={currentPage}
              perPage={Config.magasin.limit}
              onClick={(cp: TODO) => {
                this.props.history.replace({
                  pathname: Config.magasin.urls.client.storagefacility.goToObjects(
                    rootNode.nodeId,
                    this.props.appSession,
                    cp
                  )
                });
              }}
            />
          )}
        </Loader>
      );
    }
    return (
      <Loader loaded={!isLoading}>
        <NodeGrid
          appSession={this.props.appSession}
          tableData={matches ? filter(matches, ['name'], searchPattern) : []}
          goToEvents={(node: TODO) =>
            this.props.goTo(
              Config.magasin.urls.client.storagefacility.viewControlsObservations(
                node.nodeId,
                this.props.appSession
              )
            )
          }
          onMove={moveNode}
          pickNode={(node: TODO) =>
            this.props.pickNode({ node, breadcrumb: rootNode.breadcrumb })
          }
          onClick={(node: TODO) =>
            this.props.goTo(
              Config.magasin.urls.client.storagefacility.goToNode(
                node.nodeId,
                this.props.appSession
              )
            )
          }
          isNodeAdded={(node: TODO) =>
            this.props.isItemAdded(node, this.props.pickList.nodes)
          }
        />
        {showPaging && (
          <PagingToolbar
            numItems={totalMatches}
            currentPage={currentPage}
            perPage={Config.magasin.limit}
            onClick={(cp: TODO) => {
              this.props.history.replace({
                pathname: Config.magasin.urls.client.storagefacility.goToNode(
                  rootNode.nodeId,
                  this.props.appSession,
                  cp
                )
              });
            }}
          />
        )}
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
          <ScannerButton
            enabled={this.props.scannerEnabled}
            onClick={this.props.toggleScanner}
          />
        </div>
      </div>
    );
    return (
      <Layout
        title={title}
        breadcrumb={
          <Breadcrumb
            node={this.props.tableStore.rootNode}
            onClickCrumb={this.showNodes}
          />
        }
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContentGrid()}
      />
    );
  }
}
