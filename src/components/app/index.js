import { I18n } from 'react-i18nify';
import 'react-select/dist/react-select.css';
import React, { Component, PropTypes } from 'react';
import { IndexLink, hashHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, Badge } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { TYPES as PICK_TYPES } from '../../reducers/picklist';
import MusitUserAccount from '../../components/user-account-view';
import './index.css';
import Logo from './assets/logo.png';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    store: PropTypes.object,
    pickListNodeCount: PropTypes.number.isRequired,
    pickListObjectCount: PropTypes.number.isRequired,
    clearUser: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
  }

  componentWillMount() {
    const loaded = this.props.loadUser();
    if (!loaded) {
      hashHistory.replace('/');
    }
  }

  handleLogout = () => {
    this.props.clearUser();
    hashHistory.replace('/');
  }

  handleLanguage = (l) => {
    localStorage.setItem('language', l);
    window.location.reload(true);
  }

  render() {
    const { user, pickListNodeCount, pickListObjectCount } = this.props;
    return (
      <div>
        <Navbar fixedTop style={{ zIndex:1 }}>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to={'/'} activeStyle={{ color: '#33e0ff' }}>
                <div className="brand">
                  <img height="40" alt="logo" src={Logo} />
                </div>
                <span>MUSIT</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav navbar>
              {user &&
              <LinkContainer to="/magasin">
                <NavItem>{ I18n.t('musit.texts.magazine') }</NavItem>
              </LinkContainer>
              }
              {user &&
              <LinkContainer to={`/picklist/${PICK_TYPES.OBJECT.toLowerCase()}`}>
                <NavItem><Badge><FontAwesome name="rebel" />{` ${pickListObjectCount} `}</Badge></NavItem>
              </LinkContainer>
              }
              {user &&
              <LinkContainer to={`/picklist/${PICK_TYPES.NODE.toLowerCase()}`}>
                <NavItem><Badge><FontAwesome name="folder" />{` ${pickListNodeCount} `}</Badge></NavItem>
              </LinkContainer>
              }
              {user &&
              <LinkContainer to="/reports">
                <NavItem>{ I18n.t('musit.reports.reports') }</NavItem>
              </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              {user &&
              <MusitUserAccount user={this.props.user} handleLogout={this.handleLogout} handleLanguage={(l) => this.handleLanguage(l)}/>
              }
            </Nav>
            <Nav pullRight>
              {user &&
              <LinkContainer to={'/search/objects'}>
                <NavItem><FontAwesome name="search" style={{ fontSize: '1.3em' }} /></NavItem>
              </LinkContainer>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="appContent">
          {this.props.children}
        </div>

        <div className="well text-center">{' '}</div>
      </div>
    );
  }
}
