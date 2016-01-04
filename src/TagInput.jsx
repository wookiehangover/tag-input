import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import fuzzy from 'fuzzy'

import unique from 'lodash/array/unique'
import uniqueId from 'lodash/utility/uniqueId'
import compact from 'lodash/array/compact'
import without from 'lodash/array/without'
import last from 'lodash/array/last'
import pick from 'lodash/object/pick'

import KeyHandler from './KeyHandler'
import TagMenu from './TagMenu'
import Tag from './Tag'

const TagsInput = React.createClass({
  propTypes: {
    value: React.PropTypes.array,
    name: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    tags: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired,
    allowOriginalValues: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      placeholder: 'Add Some Tags...',
      allowOriginalValues: true,
      name: uniqueId('tag-input')
    }
  },

  getInitialState() {
    return {
      filteredTags: [],
      isOpen: false
    }
  },

  addTag(value) {
    if (this.props.allowOriginalValues === false
        && this.props.tags.indexOf(value) < 0) {
      return
    }

    const tags = (this.props.value || []).concat([ value ])
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
    const inputValue = ev.target.value
    const currentValue = this.props.value || []
    if (inputValue === '') {
      this.setState({ filteredTags: [] })
      return
    }

    // Wrap character mappings for hightlighting: <a>liceblue
    const results = fuzzy.filter(
      inputValue,
      this.props.tags,
      { pre: '<', post: '>' }
    )

    // Remove any currently matched tags and split the highlighted string into
    // something consumable
    const filteredTags = compact(
      results.map(match => {
        if (currentValue.indexOf(match.original) > -1) {
          return null
        }
        return {
          text: match.original,
          parts: compact( match.string.split(/(<.>)/) )
        }
      })
    )

    this.setState({ filteredTags })
  },

  render() {
    const tags = this.props.value || []
    const childProps = {
      addTag: this.addTag,
      removeTag: this.removeTag,
      active: this.state.focusedOption,
      filteredTags: this.state.filteredTags,
      update: (state) => this.setState(state)
    }

    return (
      <div className="tag-input" {...pick(this.props, ['className'])}>
        {tags.map((value, i) =>
          <Tag value={value} remove={this.removeTag} key={i} />
        )}
        <KeyHandler {...childProps}>
          <input ref="input" placeholder={this.props.placeholder} onChange={this.filterTags} contextmenu={`${this.props.name}-menu`}/>
        </KeyHandler>
        <TagMenu {...childProps} id={`${this.props.name}-menu`}/>
      </div>
    )
  }

})

export default TagsInput
