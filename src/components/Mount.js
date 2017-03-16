// @flow
import React from 'react';

type Props = any;

export const mount = (onMount: (props: Props) => void) => (Component: any) => {
  class MountWrapper extends React.Component {
    props: Props;

    componentWillMount() {
      onMount(this.props);
    }

    render() {
      return (
        <Component
          {...this.props}
        />
      );
    }
  }
  return MountWrapper;
};
