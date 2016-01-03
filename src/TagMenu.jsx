import React, { PropTypes } from 'react'

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
      <datalist>
        {this.props.filteredTags.map((value, index) => {
          const props = {
            key: index,
            className: (value === this.props.active) ? 'tag-item__focused': '',
            onMouseOver: this.updateFocusedOption,
            onClick: this.onClick.bind(null, value),
            value
          }

          return (
            <option {...props}>
              {value}
            </option>
          )
        })}
      </datalist>
    )
  }
})

export default TagMenu
