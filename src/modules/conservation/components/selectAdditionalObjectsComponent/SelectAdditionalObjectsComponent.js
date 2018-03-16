// @flow

import React from 'react';
import Modal from '../../../../components/modal/MusitModal';
import PropTypes from 'prop-types';
import { RxInjectLegacy as inject } from 'react-rxjs';
import appSession$ from '../../../../stores/appSession';
import type { AppSession } from '../../../../types/appSession';
import Config from '../../../../config';
import type { SearchResult } from 'types/search';
import { ajaxGetRequest } from '../../../../shared/ajaxPromise';
import type { MuseumId, CollectionId } from 'types/ids';

import range from 'lodash/range';
/* import {
  actions as searchActions,
  store$ as searchStore$
} from '../../../objectsearch/searchStore'; */
import { I18n } from 'react-i18nify';

import pullRight from '../../../../shared/pullRight';
import cx from 'classnames';

const data = {
  appSession$
  // searchStore$
};

type ChangePage = number; //  | 'next' | 'previous';

type PaginationProps = {
  onChangePage: (page: ChangePage) => void,
  currentPage: number,
  visiblePageCount: number,
  objectsPerPage: number,
  totalObjectCount: number
};

class Pagination extends React.Component<PaginationProps> {
  constructor(props) {
    super(props);
  }

  totalPageCount = () => {
    return Math.ceil(this.props.totalObjectCount / this.props.objectsPerPage);
  };

  firstVisiblePage = () =>
    Math.max(1, this.props.currentPage - Math.floor(this.props.visiblePageCount / 2));

  gotoPage = (newCurrentPage: number) => {
    this.props.onChangePage(newCurrentPage);
  };

  render = () => {
    let firstVisible = this.firstVisiblePage();
    const lastVisible = Math.min(
      firstVisible + this.props.visiblePageCount - 1,
      this.totalPageCount()
    );

    firstVisible = Math.min(firstVisible, lastVisible - this.props.visiblePageCount + 1);
    firstVisible = Math.max(1, firstVisible);
    const visiblePages = range(firstVisible, lastVisible + 1);
    /* console.log("firstvisible " + firstVisible + " - "+ Math.min(firstVisible + this.props.visiblePageCount, this.totalPageCount()))
    console.log("visiblepages " + visiblePages) */
    if (this.props.totalObjectCount <= this.props.objectsPerPage) {
      return <span> </span>;
    } else {
      return (
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={cx({ disabled: this.props.currentPage === 1 })}>
              <span
                onClick={() => {
                  if (this.props.currentPage !== 1) {
                    this.gotoPage(this.props.currentPage - 1);
                  }
                }}
              >
                <span>&laquo;</span>
              </span>
            </li>

            {visiblePages.map(pageNum => (
              <li
                key={pageNum}
                className={cx({ active: this.props.currentPage === pageNum })}
              >
                {this.props.currentPage === pageNum ? (
                  <span className="active">{pageNum}</span>
                ) : (
                  <span onClick={() => this.gotoPage(pageNum)}>{pageNum}</span>
                )}
              </li>
            ))}

            <li
              className={cx({
                disabled: this.props.currentPage === this.totalPageCount()
              })}
            >
              <span
                onClick={() => {
                  if (this.props.currentPage !== this.totalPageCount())
                    this.gotoPage(this.props.currentPage + 1);
                }}
              >
                <span>&raquo;</span>
              </span>
            </li>
          </ul>
        </nav>
      );
    }
  };
}

type SelectAdditionalObjectsComponentProps = {
  appSession: AppSession,
  addObjects: Function // PropTypes.func.isRequired
};

type CurrentPageObject = {
  id: any,
  museumNo?: string,
  subNo?: string,
  term?: string
}; //& any

type SelectAdditionalObjectsComponentState = {
  currentPageObjects: CurrentPageObject[], //The search result, with selected info etc as well.
  q: string, //current value in search field
  selectedObjects: Set<string>,
  esFrom: number,
  currentPage: number,
  totalObjectCount: number
};

const objectsPerPage = 15;

const RightAlignedPagination = pullRight(Pagination);
export class SelectAdditionalObjectsComponent extends React.Component<
  SelectAdditionalObjectsComponentProps,
  SelectAdditionalObjectsComponentState
> {
  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  constructor(props: SelectAdditionalObjectsComponentProps) {
    super(props);
    this.state = {
      currentPageObjects: [],
      selectedObjects: new Set(),
      q: '',
      esFrom: 0,
      currentPage: 1,
      totalObjectCount: 0
    };
  }

  toggleObject(currentObject: CurrentPageObject, index: number) {
    this.setState(prevState => {
      const newSet = new Set(prevState.selectedObjects);
      const wasSelected = newSet.has(currentObject.id);
      if (wasSelected) {
        newSet.delete(currentObject.id);
      } else {
        newSet.add(currentObject.id);
      }

      return { selectedObjects: newSet };
    });
  }

  doSearch = async (newSearch: boolean, from?: number = 0) => {
    const soek = `*${this.state.q}*`;
    const esQuery = `museumNo:${soek} OR subNo:${soek} OR term:${soek}`;

    const result = await executeSearch(
      esQuery,
      from,
      objectsPerPage, // limit: number,«
      this.props.appSession.collectionId,
      this.props.appSession.museumId,
      this.props.appSession.accessToken
    );

    const objects =
      (result &&
        result.hits.hits.map(o => ({
          ...o._source //,
          //selected: false
        }))) ||
      [];
    console.log('Objects', objects);
    this.setState(() => ({
      currentPageObjects: objects,
      totalObjectCount: result.hits.total,
      currentPage: from == 0 ? 1 : this.state.currentPage,
      selectedObjects: newSearch ? new Set() : this.state.selectedObjects
    }));
  };

  changePage = (changedTo: number) => {
    this.setState({ currentPage: changedTo });
    this.doSearch(false, (changedTo - 1) * objectsPerPage);
  };

  enterKey = (key: KeyboardEvent) => {
    if (key.key == 'Enter') {
      this.doSearch(true);
    }
  };

  render = () => {
    const body = (
      <div>
        <div className="form-group">
          <label htmlFor="query"> {I18n.t('musit.texts.searchData')}</label>
          <input
            type="text"
            className="form-control"
            id="q"
            onChange={v => {
              this.setState({ q: v.target.value });
            }}
            onKeyPress={this.enterKey}
          />
        </div>
        <button
          onClick={() => {
            this.doSearch(true);
          }}
        >
          {I18n.t('musit.texts.search')}
        </button>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <button
          onClick={() => {
            this.props.addObjects(
              this.state
                .selectedObjects /*.currentPageObjects
                .map(o => ({ id: o.id, selected: o.selected, ...o }))
                .filter(o => o.selected)
                .map(o => o)*/
            );
            this.context.closeModal();
          }}
        >
          {I18n.t('musit.texts.select')}
        </button>{' '}
        <span>&nbsp;&nbsp;&nbsp;</span>
        <span>
          {' '}
          {I18n.t('musit.texts.count')}:{this.state.totalObjectCount}
          &nbsp;&nbsp;&nbsp; Antall valgte: {this.state.selectedObjects.size}
        </span>
        <RightAlignedPagination
          objectsPerPage={objectsPerPage}
          visiblePageCount={5}
          totalObjectCount={this.state.totalObjectCount}
          currentPage={this.state.currentPage}
          onChangePage={changedTo => this.changePage(changedTo)}
        />
        <table className="table">
          <thead>
            <tr key={'resultat'}>
              <th> {I18n.t('musit.objectsearch.museumNo.label')}</th>
              <th> {I18n.t('musit.objectsearch.subNo.label')}</th>
              <th> {I18n.t('musit.objectsearch.term.label')}</th>
              <th> {I18n.t('musit.texts.select')}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.currentPageObjects.map((o, i) => (
              <tr key={`resultat_${i}`}>
                <td>{o.museumNo}</td>
                <td>{o.subNo}</td>
                <td>{o.term}</td>
                <td
                  onClick={() => {
                    this.toggleObject(this.state.currentPageObjects[i], i);
                  }}
                >
                  {this.state.selectedObjects.has(o.id) ? (
                    I18n.t('musit.texts.selected')
                  ) : (
                    I18n.t('musit.texts.notSelected')
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return <Modal body={body} />;
  };
}

export async function executeSearch(
  query: string,
  from: number,
  limit: number,
  collectionId: CollectionId,
  museumId: number,
  token: string
): Promise<SearchResult> {
  const url = Config.magasin.urls.api.thingaggregate.searchObjectUrl(
    undefined, //props.queryParam.museumNo,
    undefined, //props.queryParam.subNo,
    undefined, // props.queryParam.term,
    query,
    limit, // this.props.limit,
    from, //this.state.esFrom,
    collectionId,
    museumId
  );
  const result = JSON.parse(await ajaxGetRequest(url, token));
  return result;
}

export default inject(data, {})(SelectAdditionalObjectsComponent);