import React, { Component, PropTypes } from 'react';
import IFrame from '../../util/IFrame';
import './ChooseTemplate.css';

class ChooseTemplate extends Component {
  static propTypes = {
    renderTemplate: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired
  };

  static defaultProps = {
    templates: []
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.loadTemplates();
  }

  render() {
    return (
      <div className="templateChooser">
        <ul>
          {this.props.templates.map((template, i) =>
            <li key={i}>
              <a onClick={(e) => {
                e.preventDefault();
                this.props.selectTemplate(template);
                this.props.nextStep();
                this.context.closeModal();
              }} href="#">
                {template.name}
              </a>
              <br />
              <IFrame
                frameProps={{
                  width: template.labelWidth + 5,
                  height: template.labelHeight + 5,
                  frameBorder: 0,
                  scrolling: 'no'
                }}
                content={template.content}
              />
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default ChooseTemplate;