import React, { PropTypes } from 'react'
import classnames from 'classnames'

const TagMenu = React.createClass({
  propTypes: {
    active: PropTypes.string,
    addTag: PropTypes.func.isRequired,
    filteredTags: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  },

  onClick(value, ev) {
    this.props.addTag(value)
  },

  updateFocusedOption(ev) {
    this.props.update({
      focusedOption: ev.currentTarget.text
    })
  },

  render() {
    return (
      <ul>
        {this.props.filteredTags.map((value, index) => {
          const focusedClass = classnames({
            'tag-item__focused': (value === this.props.active)
          })

          const props = {
            key: index,
            className: focusedClass,
            onMouseOver: this.updateFocusedOption,
            onClick: this.onClick.bind(null, value)
          }

          return (
            <li {...props}>
              <a href="#">{value}</a>
            </li>
          )
        })}
      </ul>
    )
  }
})

export default TagMenu
