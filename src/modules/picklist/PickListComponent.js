import MusitNode from '../../models/node';
import MusitObject from '../../models/object';
import React, { PropTypes } from 'react';
import PickListTable from './PickListTable';
import { PageHeader, Grid, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import MusitModal from '../movedialog/MoveDialogComponent';
import './PickListComponent.css';
import { emitError, emitSuccess } from '../../shared/errors';
import { getPath } from '../../shared/util';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import PrintTemplate from '../print/PrintTemplateComponent';
import { loadChildren$, loadNode$, updateMoveDialog } from '../movedialog/moveDialogStore';
import {
  toggleNode$,
  toggleMainObject$,
  toggleObject$,
  removeNode$,
  removeObject$,
  refreshNode$,
  refreshObjects$,
  addNode$,
  addObject$
} from '../app/pickList';
import inject from 'react-rxjs/dist/RxInject';
import { showModal } from '../../shared/modal';
import scanner$, { clearScanner$ } from '../app/scanner';
import scannerIcon from '../app/scannerIcon.png';
import wrapWithScanner from '../app/scannerWrapper';

export class PickListContainer extends React.Component {
  static propTypes = {
    pickList: PropTypes.object.isRequired,
    toggleNode: PropTypes.func.isRequired,
    toggleObject: PropTypes.func.isRequired,
    toggleMainObject: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    removeObject: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired,
    refreshNode: PropTypes.func.isRequired,
    refreshObjects: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired,
    classExistsOnDom: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.moveModal = this.moveModal.bind(this);
    this.print = this.print.bind(this);
    this.showMoveNodes = this.showMoveNodes.bind(this);
  }

  showMoveNodes = (items) => {
    let title;
    if (this.props.isTypeNode()) {
      title = I18n.t('musit.moveModal.moveNodes');
    } else {
      title = I18n.t('musit.moveModal.moveObjects');
    }
    this.props.showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveModal(items)}/>);
  }

  nodeCallback = (toName, toMoveLength, name, items, onSuccess) => ({
    onComplete: () => {
      items.map(item =>
        this.props.refreshNode({
          id: item.id,
          museumId: this.props.appSession.getMuseumId(),
          token: this.props.appSession.getAccessToken()
        })
      );
      onSuccess();
      if (toMoveLength === 1) {
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodeMoved', { name, destination: toName })
        });
      } else {
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodesMoved', { count: toMoveLength, destination: toName })
        });
      }
    },
    onFailure: (e) => {
      if (toMoveLength === 1) {
        this.props.emitError({type: 'errorOnMove', error: e, message: I18n.t('musit.moveModal.messages.errorNode', { name, destination: toName })});
      } else {
        this.props.emitError({type: 'errorOnMove', error: e,
          message: I18n.t('musit.moveModal.messages.errorNodes', { count: toMoveLength, destination: toName })});
      }
    }
  })

  objectCallback = (toName, toMoveLength, name, items, onSuccess) => ({
    onComplete: () => {
      this.props.refreshObjects({
        objectIds: items.map(item => item.id),
        museumId: this.props.appSession.getMuseumId(),
        token: this.props.appSession.getAccessToken()
      });
      onSuccess();
      if (toMoveLength === 1) {
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', { name, destination: toName })
        });
      } else {
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectsMoved', { count: toMoveLength, destination: toName })
        });
      }
    },
    onFailure: (error) => {
      if (toMoveLength === 1) {
        this.props.emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorObject', { name, destination: toName })
        });
      } else {
        this.props.emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorObjects', { count: toMoveLength, destination: toName })
        });
      }
    }
  })

  moveModal = (items) => (to, toName, onSuccess) => {
    const isNode = this.props.isTypeNode();
    const moveFn = isNode ? MusitNode.moveNode : MusitObject.moveObject;
    const toMove = items.map(itemToMove => itemToMove.id);
    const toMoveLength = toMove.length;
    const first = items[0];
    const name = isNode ? first.name : first.term;
    let callback;
    if (isNode) {
      callback = this.nodeCallback(toName, toMoveLength, name, items, onSuccess);
    } else {
      callback = this.objectCallback(toName, toMoveLength, name, items, onSuccess);
    }

    let error = false;
    if (isNode) {
      const itemsWithError = items.filter(fromNode => checkNodeBranchAndType(fromNode, to));
      const errorMessages = itemsWithError.map(fromNode => `${checkNodeBranchAndType(fromNode, to)} (${fromNode.value.name})` );
      if (errorMessages.length > 0) {
        error = true;
        for (const errorMessage of errorMessages) {
          this.props.emitError({
            type: 'errorOnMove',
            message: errorMessage
          });
        }
      }
    }

    if (!error) {
      moveFn()({
        id: toMove,
        destination: to.id,
        doneBy: this.props.appSession.getActor().getActorId(),
        museumId: this.props.appSession.getMuseumId(),
        token: this.props.appSession.getAccessToken(),
        callback
      }).toPromise();
    }
  }

  print(nodesToPrint) {
    this.props.showModal(I18n.t('musit.template.labelTemplates'), <PrintTemplate appSession={this.props.appSession} marked={nodesToPrint} />);
  }

  toggleObject({item, on}) {
    if (item.mainObjectId && item.isMainObject()) {
      this.props.toggleMainObject({item, on});
    } else {
      this.props.toggleObject({item, on});
    }
  }

  render() {
    const type = this.props.route.type;
    const pickList = (this.props.pickList && this.props.pickList[type]) || [];
    const marked = pickList.filter(p => p.marked);
    const markedValues = marked.map(p => p.value);
    const title = (
      <div>
        <span>{I18n.t(`musit.pickList.title.${this.props.route.type}`)}</span>
        <div
          style={{
            float: 'right',
            margin: '0 25px 0 0'
          }}
        >
          <Button active={this.props.scannerEnabled} onClick={this.props.toggleScanner}>
            <img src={scannerIcon} height={25} alt="scan" />
          </Button>
        </div>
      </div>
    );
    return (
      <div>
        <main>
          <Grid>
            <PageHeader>
              {title}
            </PageHeader>
            <PickListTable
              picks={pickList}
              marked={markedValues}
              isnode={this.props.isTypeNode(this.props)}
              iconRendrer={(pick) => (pick.value.name ? <FontAwesome name="folder"/> :
                <span className='icon icon-musitobject'/>)
              }
              labelRendrer={(pick) => {
                return (
                  <div>
                    {!this.props.isTypeNode(this.props) ? <span style={{ paddingLeft: '1em' }}>{pick.value.museumNo}</span> : null}
                    {!this.props.isTypeNode(this.props) ? <span style={{ paddingLeft: '1em' }}>{pick.value.subNo}</span> : null}
                    <span style={{ paddingLeft: '1em' }}>{pick.value.name ? pick.value.name : pick.value.term}</span>
                    <div className="labelText">
                      <Breadcrumb
                        node={pick.path}
                        onClickCrumb={node => hashHistory.push(`/magasin/${!node.id || node.id === -1 ? '' : node.id}`)}
                        allActive
                      />
                    </div>
                  </div>
                );
              }}
              toggle={(item, on) => this.props.isTypeNode(this.props) ? this.props.toggleNode({item, on}) : this.toggleObject({item, on})}
              remove={item => this.props.isTypeNode(this.props) ?  this.props.removeNode(item) :  this.props.removeObject(item)}
              move={this.showMoveNodes}
              print={this.print}
            />
            <div style={{ textAlign: 'left' }}>
              {marked.length}/{pickList.length} &nbsp;
              {this.props.isTypeNode(this.props) ? I18n.t('musit.pickList.footer.nodeSelected')
                : I18n.t('musit.pickList.footer.objectSelected') }
            </div>
          </Grid>
        </main>
      </div>
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  pickList$: { type: PropTypes.object.isRequired }
};

const commands = {
  refreshNode$,
  refreshObjects$,
  toggleObject$,
  toggleNode$,
  toggleMainObject$,
  removeObject$,
  removeNode$,
  addNode$,
  addObject$,
  clearScanner$,
  loadChildren$,
  loadNode$
};

const customProps = {
  findByUUID: MusitNode.findByUUID(),
  findNodeByBarcode: MusitNode.findByBarcode(),
  findObjectByBarcode: MusitObject.findByBarcode(),
  classExistsOnDom: (className) => document.getElementsByClassName(className).length > 0,
  subscribeToScanner: (next, err, complete) => scanner$.subscribe(next, err, complete),
  updateMoveDialog,
  emitError,
  emitSuccess,
  showModal,
  isTypeNode: (props) => 'nodes' === props.route.type
};

const processBarcode = (barCode, props) => {
  const isMoveDialogActive = props.classExistsOnDom('moveDialog');
  const museumId = props.appSession.getMuseumId();
  const collectionId = props.appSession.getCollectionId();
  const token = props.appSession.getAccessToken();
  const isNodeView = props.isTypeNode(props);
  if (barCode.uuid) {
    if (isNodeView) {
      props.findByUUID({uuid: barCode.code, museumId, token})
        .do((response) => {
          if (!response) {
            props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode')});
            return;
          }
          if (isMoveDialogActive) {
            props.updateMoveDialog(response, museumId, token);
          } else {
            props.addNode({value: response, path: getPath(response)});
          }
        }).toPromise();
    } else {
      props.emitError({message: I18n.t('musit.errorMainMessages.scanner.' + (isNodeView ? 'noMatchingNode' : 'noMatchingObject'))});
    }
  } else {
    const findByBarcode = isNodeView ? props.findNodeByBarcode : props.findObjectByBarcode;
    findByBarcode({barcode: barCode.code, museumId, collectionId, token}).do(response => {
      if (!response) {
        props.emitError({message: I18n.t('musit.errorMainMessages.scanner.' + (isNodeView ? 'noMatchingNode' : 'noMatchingObject'))});
        return;
      }
      if (!isNodeView && Array.isArray(response)) { // objects
        if (response.length === 1) {
          if (isMoveDialogActive) {
            props.updateMoveDialog(response[0], museumId, token);
          } else {
            props.addObject({value: response[0], path: getPath(response[0])});
          }
        } else {
          props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingObject')});
        }
      } else if (isNodeView && response.nodeId) { // node
        if (isMoveDialogActive) {
          props.updateMoveDialog(response, museumId, token);
        } else {
          props.addNode({value: response, path: getPath(response)});
        }
      } else {
        props.emitError({message: I18n.t('musit.errorMainMessages.scanner.' + (isNodeView ? 'noMatchingNode' : 'noMatchingObject'))});
      }
    }).toPromise();
  }
};

export default inject(data, commands, customProps)(wrapWithScanner(processBarcode)(PickListContainer));
