// @flow
import React from 'react';
import { ActorSuggest } from '../../../components/suggest/ActorSuggest';
import MusitActor from '../../../models/actor';
import type { AppSession } from '../../../types/appSession';
import type { Actor } from 'types/actor';
import { I18n } from 'react-i18nify';

export type Props = {
  id: string,
  appSession: AppSession,
  onChange: (actorId: ?string) => void,
  value?: ?string
};

export type State = {
  name: ?string
};

export default class StatefulActorSuggest extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { name: null };
  }

  render() {
    return (
      <ActorSuggest
        appSession={this.props.appSession}
        id={this.props.id}
        value={this.state.name || this.props.value || ''}
        placeHolder={I18n.t('musit.texts.findActor')}
        onChange={(actor: Actor) => {
          this.props.onChange(MusitActor.getActorId(actor));
          this.setState(ps => ({ name: actor.fn }));
        }}
      />
    );
  }
}
