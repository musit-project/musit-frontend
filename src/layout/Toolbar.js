import React from 'react'
import { Button } from 'react-bootstrap'
import { MusitField } from '../components/formfields'
import styles from './Toolbar.scss'
import FontAwesome from 'react-fontawesome'

export default class Toolbar extends React.Component {
  static propTypes = {
    showLeft: React.PropTypes.bool.isRequired,
    showRight: React.PropTypes.bool.isRequired,
    clickShowLeft: React.PropTypes.func.isRequired,
    clickShowRight: React.PropTypes.func.isRequired,
    labelLeft: React.PropTypes.string.isRequired,
    labelRight: React.PropTypes.string.isRequired,
    placeHolderSearch: React.PropTypes.string,
    searchValue: React.PropTypes.string,
    onSearchChanged: React.PropTypes.func
  }

  render() {
    const {
      placeHolderSearch,
      onSearchChanged,
      searchValue,
      showLeft,
      labelLeft,
      clickShowLeft,
      showRight,
      labelRight,
      clickShowRight
    } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.searchField}>
          <MusitField
            id={'search'}
            addOnPrefix={'\u2315'}
            placeHolder={placeHolderSearch}
            value={searchValue}
            validate="text"
            onChange={onSearchChanged}
          />
        </div>
        <div className={styles.toolBarButtons}>
          <Button active={showLeft} onClick={() => clickShowLeft()}>
            <FontAwesome name={showLeft ? 'check-square-o' : 'square-o'} />{' '}{labelLeft}
          </Button>
          <Button active={showRight} onClick={() => clickShowRight()}>
            <FontAwesome name={showRight ? 'check-square-o' : 'square-o'} />{' '}{labelRight}
          </Button>
        </div>
      </div>
    )
  }
}
