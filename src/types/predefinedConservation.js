// @flow
import type {
  ConservationTypes,
  ConservatonSubType,
  ConditionCodeType
} from './conservation';
import type { SampleType } from './sample';

export type SampleTypes = {
  [string]: Array<SampleType>,
  raw: Array<SampleType>
};

export type PredefinedConservation = {
  sampleTypes: ?SampleTypes,
  conservationTypes: ?ConservationTypes,
  materialList: ?Array<ConservatonSubType>,
  keywordList: ?Array<ConservatonSubType>,
  roleList: ?Array<ConservatonSubType>,
  conditionCodeList: ?Array<ConditionCodeType>,
  materialDeterminationList: ?Array<any>
};
