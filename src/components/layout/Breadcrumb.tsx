import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import { takeRight } from 'lodash';
import { map } from 'lodash';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { TODO } from '../../types/common';

interface BreadcrumbItemProps {
  displayName?: string;
  name?: string;
  url?: string;
  icon?: TODO;
  style?: TODO;
  onClick: TODO;
  delimiter?: string;
}

interface BreadcrumbProps {
  onClickCrumb?: Function;
  node: TODO;
  disabled?: boolean;
  allActive?: boolean;
}

const tooltip = (tipText: TODO, child: TODO) => (
  <OverlayTrigger
    placement="top"
    overlay={<Popover id="breadcrumb tooltip">{tipText}</Popover>}
  >
    {child}
  </OverlayTrigger>
);

const CrumbItem: React.SFC<BreadcrumbItemProps> = props => {
  const name =
    props.displayName ||
    (props.name && props.name.length > 20 + 2
      ? props.name.substring(0, 20) + '..'
      : props.name);
  const icon = props.icon && (
    <FontAwesome name={props.icon} style={{ ...props.style, padding: '1px' }} />
  );
  const item = (
    <span>
      {props.url ? (
        <a href={props.url} onClick={props.onClick}>
          {icon}
          {name}
        </a>
      ) : (
        <span>
          {icon}
          {name}
        </span>
      )}
      {props.delimiter ? ' / ' : ''}
    </span>
  );
  return tooltip(props.name, item);
};

const crumbLimit: number = 3;

class Breadcrumb extends React.Component<BreadcrumbProps> {
  render() {
    const clickCrumb = (node: TODO) => (evt: TODO) => {
      evt.preventDefault();
      if (this.props.onClickCrumb) {
        this.props.onClickCrumb(node);
      }
      evt.stopPropagation();
    };

    let path = [];
    if (
      this.props.node &&
      this.props.node.breadcrumb &&
      this.props.node.breadcrumb.length
    ) {
      path = this.props.node.breadcrumb;
    } else if (this.props.node && this.props.node.length) {
      path = this.props.node;
    }
    const itemsWithIndex = map(path, (item, index) => ({ ...item, index }));
    const itemsCropped = takeRight(itemsWithIndex, crumbLimit);
    // Emulating lazy val by making it a function
    const dotdotdot = () => itemsWithIndex[itemsCropped[0].index - 1];
    return (
      <div>
        {CrumbItem({
          url: itemsWithIndex.length > 0 && !this.props.disabled ? '/magasin' : undefined,
          onClick: clickCrumb({ url: '/magasin' }),
          name: 'Magasin',
          displayName: ' ',
          icon: 'home',
          style: { fontSize: '1.5em' },
          delimiter: itemsWithIndex.length > 0 ? ' / ' : undefined
        })}
        {itemsWithIndex > itemsCropped &&
          CrumbItem({
            url: dotdotdot().url,
            onClick: clickCrumb(dotdotdot()),
            name: dotdotdot().name,
            displayName: '\u2026',
            delimiter: ' / '
          })}
        {itemsCropped.map((item, i, arr) => {
          const notLast = i < arr.length - 1;
          const enableLast = notLast && !this.props.disabled;
          const enableLink = this.props.allActive || enableLast;
          return (
            <span key={i}>
              {CrumbItem({
                url: enableLink ? item.url : undefined,
                name: item.name,
                onClick: clickCrumb(item),
                icon: 'folder',
                delimiter: notLast ? ' / ' : undefined
              })}
            </span>
          );
        })}
      </div>
    );
  }
}

export default Breadcrumb;
