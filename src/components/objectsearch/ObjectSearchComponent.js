import React from 'react';
import { I18n } from 'react-i18nify';
import { Grid, Form, FormGroup, FormControl, ControlLabel, Button, Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../layout/Breadcrumb';
import PagingToolbar from '../../util/paging';
import { hashHistory } from 'react-router';

export function renderParam(id, props, style) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{I18n.t(`musit.objectsearch.${id}.label`)}</ControlLabel>
      {' '}
      <FormControl
        style={{ ...style }}
        type="text"
        placeholder={I18n.t(`musit.objectsearch.${id}.placeHolder`)}
        value={props.params[id] || ''}
        onChange={(e) => props.onChangeField(id, e.target.value)}
      />
    </FormGroup>
  );
}

export default (props) =>
  <div style={{ paddingTop: 20 }}>
    <main>
      <Grid>
        <div>
          <h2>{I18n.t('musit.objectsearch.title')}</h2>
          <Form inline>
            {renderParam('museumNo', props)}
            {' '}
            {renderParam('subNo', props)}
            {' '}
            {renderParam('term', props, { width: '470px' })}
            {' '}
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                props.searchForObjects(props.params, 1, props.user.museumId);
              }}
            >
              <FontAwesome name="search" style={{ fontSize: '1.3em' }} />
            </Button>
          </Form>
          <br />
          <h4>
          {props.loaded &&
            (props.data.totalMatches > 0 ?
              I18n.t('musit.objectsearch.results.title', { count: props.data.totalMatches })
              :
              I18n.t('musit.objectsearch.results.noHit')
            )
          }
          </h4>
          {props.data.matches.length > 0 &&
            <div>
              <PagingToolbar inline
                numItems={props.data.totalMatches}
                baseUrl={props.location.pathname}
                currentPage={props.params.currentPage}
                perPage={props.params.perPage}
                onClick={(page) => props.searchForObjects(props.params, page, props.user.museumId)}
              />
              <Table>
                <thead>
                  <tr>
                    <th>{I18n.t('musit.objectsearch.museumNo.label')}</th>
                    <th>{I18n.t('musit.objectsearch.subNo.label')}</th>
                    <th>{I18n.t('musit.objectsearch.term.label')}</th>
                    <th>{I18n.t('musit.objectsearch.location.label')}</th>
                  </tr>
                </thead>
                <tbody>
                {props.data.matches.map((data, i) => {
                  const isMainObject = data.isMainObject();
                  return (
                    <tr key={i}>
                      <td className="museumNo">{data.museumNo}</td>
                      <td className="subNo">{data.subNo}</td>
                      <td className="term">{data.term}</td>
                      <td className="path">
                        {data.breadcrumb.length > 0 &&
                          <Breadcrumb
                            node={data}
                            allActive
                            onClickCrumb={(node) => hashHistory.push(node.url) }
                          />
                        }
                      </td>
                      <td className="move">
                        {isMainObject &&
                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            props.pickObject(data, data.breadcrumb);
                          }}
                          title={I18n.t('musit.objectsearch.addToPickList')}
                        >
                          <FontAwesome name="shopping-cart" style={{ fontSize: '1.3em' }}/>
                        </a>
                        }
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </Table>
              <PagingToolbar inline
                numItems={props.data.totalMatches}
                baseUrl={props.location.pathname}
                currentPage={props.params.currentPage}
                perPage={props.params.perPage}
                onClick={(page) => props.searchForObjects(props.params, page, props.user.museumId)}
              />
            </div>
          }
        </div>
      </Grid>
    </main>
  </div>;