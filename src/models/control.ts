// @flow
import Config from '../config';
import { mapToBackend } from './mapper/control/to_backend';
import { simplePost, simpleGet } from '../shared/RxAjax';
import MusitActor from './actor';
import { uniq } from 'lodash';
import { Callback, AjaxGet, AjaxPost } from '../types/ajax';
import { Observable } from 'rxjs';
import { Star, Maybe } from '../types/common';

type ControlType = {
  id: number;
  registeredBy: string;
  doneBy?: string;
  // TODO fill in more fields here
};

type ObservationType = {
  id: number;
  registeredBy: string;
  doneBy: string;
  // TODO fill in more fields here
};

class Control {
  static loadControls: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      nodeId: number;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Array<ControlType>>;
  static addControl: (
    ajaxPost?: AjaxPost<Star>
  ) => (
    props: {
      nodeId: number;
      controlData: ControlType;
      observations?: Maybe<ObservationType>;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<ControlType>;
  static getControl: (
    ajaxGet?: AjaxGet<Star>,
    ajaxPost?: AjaxPost<Star>
  ) => (
    props: {
      nodeId: number;
      controlId: number;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<ControlType>;
}

Control.loadControls = (ajaxGet = simpleGet) => ({ nodeId, museumId, token, callback }) =>
  ajaxGet(
    `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/${nodeId}/controls`,
    token,
    callback
  )
    .map(({ response }) => response)
    .map(arr => {
      if (!arr) {
        return [];
      }
      return arr;
    });

Control.addControl = (ajaxPost = simplePost) => ({
  nodeId,
  controlData,
  observations,
  museumId,
  token,
  callback
}) => {
  const data = mapToBackend(controlData, observations, nodeId);
  const url = `${Config.magasin.urls.api.storagefacility.baseUrl(
    museumId
  )}/${nodeId}/controls`;
  return ajaxPost(url, data, token, callback);
};

Control.getControl = (ajaxGet = simpleGet, ajaxPost = simplePost) => ({
  nodeId,
  controlId,
  museumId,
  token,
  callback
}) => {
  const url = `${Config.magasin.urls.api.storagefacility.baseUrl(
    museumId
  )}/${nodeId}/controls/${controlId}`;
  return ajaxGet(url, token, callback).flatMap(control => {
    if (!control.response) {
      return Observable.empty();
    }
    const actorIds = uniq([
      control.response.doneBy,
      control.response.registeredBy
    ]).filter(p => p);
    return MusitActor.getActors(ajaxPost)({ actorIds, token }).map(actorDetails => ({
      ...control.response,
      ...MusitActor.getActorNames(
        actorDetails,
        control.response.doneBy,
        control.response.registeredBy
      )
    }));
  });
};

export default Control;
