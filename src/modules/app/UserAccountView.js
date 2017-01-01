import { MenuItem, Dropdown, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';

export default class MusitUserAccount extends Component {
  static propTypes = {
    user: React.PropTypes.object,
    selectedMuseumId: React.PropTypes.number,
    selectedCollectionId: React.PropTypes.string,
    groups: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      shortName: React.PropTypes.string,
      permission: React.PropTypes.number,
      museumId: React.PropTypes.number,
      collections: React.PropTypes.arrayOf(React.PropTypes.shape({
        uuid: React.PropTypes.string
      })),
      description: React.PropTypes.string
    })),
    handleLogout: React.PropTypes.func,
    handleLanguage: React.PropTypes.func,
    handleMuseumId: React.PropTypes.func,
    handleCollectionId: React.PropTypes.func,
    rootNode: React.PropTypes.object
  }

  getCollections(mid, groups) {
    return uniqBy(flatten(groups.filter(g => g.museumId === mid).map(g => g.collections)), c => c.uuid);
  }

  render() {
    const currentLanguage = localStorage.getItem('language');
    const checked = (language) => currentLanguage === language && <FontAwesome name="check" /> ;
    const tooltip = 
      <Tooltip id="tooltip">Logget inn som <strong>{this.props.user.fn}</strong></Tooltip>;
    const menuText = (t1, t2) => (
      <Row>
        <Col md={1}>{t1}</Col>
        <Col md={1}>{t2}</Col>
      </Row>
    );
    const nodeId = this.props.rootNode && this.props.rootNode.id;
    const groups = this.props.groups;
    const museumId = this.props.selectedMuseumId;
    const collectionId = this.props.selectedCollectionId;
    const museumDropDown = groups.length > 1 && groups[0].museumName;
    const collectionDropdown = groups.length > 0 && groups[0].collections.length > 0;
    const collections = collectionDropdown && this.getCollections(museumId, groups);
    return (
      <OverlayTrigger overlay={tooltip} placement="left">
        <Dropdown id="dropdown-custom-1" style={{ marginTop: 10 }} >
          <Dropdown.Toggle style={{ backgroundColor: 'transparent', borderColor: '#edededed' }}>
            <FontAwesome name="user" size="lg" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem />
            {museumDropDown &&
              <MenuItem eventKey={3} header>Museum</MenuItem>
            }
            {museumDropDown &&
              groups.map((cc, i) =>
                <MenuItem
                  key={i}
                  eventKey={cc.museumId}
                  onClick={() => this.props.handleMuseumId(cc.museumId, this.getCollections(cc.museumId, groups)[0].uuid)}
                >
                  {menuText(museumId === cc.museumId ? <FontAwesome name="check" /> : '', cc.museumName)}
                </MenuItem>
              )
            }
            {museumDropDown &&
              <MenuItem divider/>
            }
            {collectionDropdown &&
              <MenuItem eventKey={3} header>Samlinger</MenuItem>
            }
            {collectionDropdown &&
              collections.map((cc, i) =>
                <MenuItem key={i} eventKey={cc.uuid} onClick={() => this.props.handleCollectionId(nodeId, cc.uuid)}>
                  {menuText(collectionId === cc.uuid ? <FontAwesome name="check" /> : '', cc.name)}
                </MenuItem>
              )
            }
            {collectionDropdown &&
              <MenuItem divider/>
            }
            <MenuItem header>Language</MenuItem>
            <MenuItem eventKey={5} onSelect={() => this.props.handleLanguage('no')}>
              {menuText(checked('no'),'NO')}
            </MenuItem>
            <MenuItem eventKey={6} onSelect={() => this.props.handleLanguage('en')}>
              {menuText(checked('en'),'EN')}
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={4} onSelect={this.props.handleLogout}>Logg ut</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>);
  }
}