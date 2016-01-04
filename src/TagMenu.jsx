import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

const TagMenuItemText = function({ chunk }) {
  const isWrapped = chunk.match(/<(.)>/)

  if (isWrapped && isWrapped.length === 2) {
    return <b>{isWrapped[1]}</b>
  } else {
    return <span>{chunk}</span>
  }
}

const TagMenuItem = React.createClass({
  propTypes: {
    active: React.PropTypes.bool.isRequired,
    value: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired,
    className: React.PropTypes.string
  },

  componentDidUpdate() {
    if (this.props.active) {
      const node = findDOMNode(this)
      node.scrollIntoViewIfNeeded()
    }
  },

  render() {
    const { value, active, onClick } = this.props
    const className = active ? 'tag-item__focused': ''
    const valueText = value.parts
      ? value.parts.map((chunk, i) => <TagMenuItemText chunk={chunk} key={i} />)
      : value.text

    return (
      <li className={className} onClick={onClick}>
        {valueText}
      </li>
    )
  }
})

const TagMenu = React.createClass({
  propTypes: {
    active: PropTypes.string,
    id: React.PropTypes.string.isRequired,
    addTag: PropTypes.func.isRequired,
    filteredTags: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  },

  onClick(value, ev) {
    this.props.addTag(value)
  },

  updateFocusedOption(value, ev) {
    this.props.update({
      focusedOption: value
    })
  },

  render() {
    const className = this.props.filteredTags.length > 0 ? '-isOpen': ''
    return (
      <menu className={className} type="popup" id={this.props.id}>
        {this.props.filteredTags.map((value, index) => {
          const props = {
            key: index,
            active: this.props.active === value.text,
            onClick: this.onClick.bind(null, value.text),
            value: value
          }

          return <TagMenuItem {...props} />
        })}
      </menu>
    )
  }
})

export default TagMenu
