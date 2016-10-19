
import React from 'react'
import { connect } from 'react-redux'
import AutoSuggest from 'react-autosuggest'
import { suggestNode, clearSuggest } from '../../reducers/suggest'

const mapStateToProps = (state) => ({
    suggest: state.suggest
});

const mapDispatchToProps = (dispatch) => ({
    onUpdateRequested: (id, { value, reason }) => {
        if (reason && reason === 'type' && value && value.length >= 2) {
            dispatch(suggestNode(id, value))
        } else {
            dispatch(clearSuggest(id))
        }
    }
});

class NodeSuggest extends React.Component {

    static propTypes = {
        id: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        placeHolder: React.PropTypes.string,
        suggest: React.PropTypes.object,
        onChange: React.PropTypes.func.isRequired,
        onUpdateRequested: React.PropTypes.func,
        disabled: React.PropTypes.bool
    };

    static defaultProps = {
        id: 'nodeField',
        disabled: false,
        value: ''
    };

    constructor(props) {
        super(props);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.state = {
            value: this.props.value
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ ...this.state, value: nextProps.value })
        }
    }

    onChange(event, { newValue }) {
        this.setState({ ...this.state, value: newValue });
        this.props.onChange(newValue)
    }

    onSuggestionSelected(event, { suggestion }) {
        if (event.keyCode === 13) {
            event.preventDefault()
        }
        const value = this.getNodeSuggestionValue(suggestion);
        this.props.onChange(value)
    }

    getSuggestions() {
        const suggest = this.props.suggest[this.props.id];
        return suggest && suggest.data ? suggest.data : []
    }

    getNodeSuggestionValue(suggestion) {
        return `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`
    }

    doneByProps = {
        id: this.props.id,
        placeholder: this.props.placeHolder,
        type: 'search',
        onChange: this.onChange.bind(this)
    };

    renderNodeSuggestion(suggestion) {
        const suggestionText = `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`;
        return (
            <span className={'suggestion-content'}>{suggestionText}</span>
        )
    }

    render() {
        return (
            <AutoSuggest
                suggestions={this.getSuggestions()}
                disabled={this.props.disabled}
                onSuggestionsUpdateRequested={(update) => this.props.onUpdateRequested(this.props.id, update)}
                getSuggestionValue={this.getNodeSuggestionValue}
                renderSuggestion={this.renderNodeSuggestion}
                inputProps={{ ...this.doneByProps, value: this.state.value }}
                shouldRenderSuggestions={(v) => v !== 'undefined'}
                onSuggestionSelected={this.onSuggestionSelected}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeSuggest)
