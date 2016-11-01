
import React from 'react'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import { suggestPerson, clearSuggest } from '../../reducers/suggest'

const mapStateToProps = (state) => ({
  suggest: state.suggest
})

const mapDispatchToProps = (dispatch) => ({
  onUpdateRequested: (id, { value, reason }) => {
    if (reason && reason === 'type' && value && value.length >= 2) {
      dispatch(suggestPerson(id, value))
    } else {
      dispatch(clearSuggest(id))
    }
  },
  clearSuggest: () => dispatch(clearSuggest())
})

class ActorSuggest extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    placeHolder: React.PropTypes.string,
    suggest: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    onUpdateRequested: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    clearSuggest: React.PropTypes.func
  }

  static defaultProps = {
    id: 'doneByField',
    disabled: false
  }

  constructor(props) {
    super(props)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.state = {
      value: this.props.value
    }
  }

  onChange(event, { newValue }) {
    this.setState({ ...this.state, value: newValue })
  }

  onSuggestionSelected(event, { suggestion }) {
    if (event.keyCode === 13) {
      event.preventDefault()
    }
    this.props.onChange(suggestion)
  }

  getSuggestions() {
    const suggest = this.props.suggest[this.props.id];
    return suggest && suggest.data ? suggest.data : []
  }

  doneByProps = {
    id: this.props.id,
    placeholder: this.props.placeHolder,
    type: 'search',
    onChange: this.onChange.bind(this)
  }

  onBlur() {
    return this.props.clearSuggest
  }

  render() {
    return (
      <Autosuggest
        suggestions={this.getSuggestions()}
        disabled={this.props.disabled}
        onSuggestionsUpdateRequested={(update) => this.props.onUpdateRequested(this.props.id, update)}
        getSuggestionValue={(suggestion) => suggestion.fn}
        renderSuggestion={(suggestion) => <span className={'suggestion-content'}>{`${suggestion.fn}`}</span>}
        inputProps={{ ...this.doneByProps, value: this.state.value, onBlur: this.onBlur() }}
        shouldRenderSuggestions={(v) => v !== 'undefined'}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActorSuggest)
