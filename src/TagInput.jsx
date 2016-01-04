import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import fuzzy from 'fuzzy'

import unique from 'lodash/array/unique'
import without from 'lodash/array/without'
import pluck from 'lodash/collection/pluck'
import last from 'lodash/array/last'
import pick from 'lodash/object/pick'

import KeyHandler from './KeyHandler'
import TagMenu from './TagMenu'
import Tag from './Tag'

const TagsInput = React.createClass({
  propTypes: {
    value: React.PropTypes.array,
    defaultValue: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    tags: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
    allowOriginalValues: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      placeholder: 'Add Some Tags...',
      allowOriginalValues: true
    }
  },

  getInitialState() {
    return {
      filteredTags: [],
      isOpen: false
    }
  },

  componentWillMount() {
    if (this.props.value && this.props.defaultValue && process.env.NODE_ENV !== 'production') {
      console.warn('Warning: you have provided both a `value` and `defaultValue` to a form element. Check the render method of TagsInput') // eslint-disable-line no-console
    }
  },

  componentDidMount() {
    const menuElem = findDOMNode(this)
    const controlElem = findDOMNode(this.refs.input)

    this._closeMenuIfClickedOutside = (event) => {
      var eventOccuredOutsideMenu = this.clickedOutsideElement(menuElem, event)
      var eventOccuredOutsideControl = this.clickedOutsideElement(controlElem, event)

      // Hide dropdown menu if click occurred outside of menu
      if (eventOccuredOutsideMenu && eventOccuredOutsideControl) {
        this.setState({
          isOpen: false
        }, this._unbindCloseMenuIfClickedOutside)
      }
    }

    this._bindCloseMenuIfClickedOutside = _ => {
      document.addEventListener('click', this._closeMenuIfClickedOutside)
    }

    this._unbindCloseMenuIfClickedOutside = _ => {
      document.removeEventListener('click', this._closeMenuIfClickedOutside)
    }
  },

  componentWillUnmount() {
    this._unbindCloseMenuIfClickedOutside()
  },

  clickedOutsideElement(element, event) {
    var eventTarget = (event.target) ? event.target : event.srcElement
    while (eventTarget != null) {
      if (eventTarget === element) return false
      eventTarget = eventTarget.offsetParent
    }
    return true
  },

  addTag(value) {
    if (this.props.allowOriginalValues === false
        && this.props.tags.indexOf(value) < 0) {
      return
    }

    const tags = (this.props.value || this.props.defaultValue || []).concat([ value ])
    this.setState({ filteredTags: [] })

    // Reset the input value
    const node = findDOMNode(this.refs.input)
    node.value = ''

    if (this.props.onChange) {
      this.props.onChange(unique(tags))
    }
  },

  removeTag(value = last(this.props.value)) {
    const tags = this.props.value || []
    if (this.props.onChange) {
      this.props.onChange(without(tags, value))
    }
  },

  filterTags(ev) {
    const value = ev.target.value
    if (value === '') {
      this.setState({ filteredTags: [] })
      return
    }

    const filteredTags = without(
      pluck(
        fuzzy.filter(value, this.props.tags), 'string'
      ),
      this.props.value
    )

    this.setState({ filteredTags })
  },

  handleInputFocus: function() {
    this.setState({
      isOpen: true
    }, function() {
      this._bindCloseMenuIfClickedOutside()
    })
  },

  render() {
    const childProps = {
      addTag: this.addTag,
      removeTag: this.removeTag,
      active: this.state.focusedOption,
      filteredTags: this.state.filteredTags,
      update: (state) => this.setState(state)
    }

    const tags = this.props.value || this.props.defaultValue || []

    return (
      <div className="tag-input" {...pick(this.props, ['className'])}>
        {tags.map((value, i) =>
          <Tag value={value} remove={this.removeTag} key={i} />
        )}
        <KeyHandler {...childProps}>
          <input ref="input" placeholder={this.props.placeholder} onChange={this.filterTags} onFocus={this.handleInputFocus} />
        </KeyHandler>
        <TagMenu {...childProps}/>
      </div>
    )
  }

})

export default TagsInput
