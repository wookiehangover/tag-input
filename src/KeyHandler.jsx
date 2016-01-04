import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import pluck from 'lodash/collection/pluck'

const KeyHandler = React.createClass({
  propTypes: {
    removeTag: PropTypes.func.isRequired,
    addTag: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    filteredTags: PropTypes.array.isRequired,
    focusedOption: PropTypes.string,
    children: PropTypes.element.isRequired
  },

  getInitialState() {
    return {
      focusedOption: ''
    }
  },

  getFocusedOptionIndex() {
    const tags = this.props.filteredTags
    let focusedIndex = -1

    for (var i = 0; i < tags.length; i++) {
      if (this.props.active === tags[i].text) {
        focusedIndex = i
        break
      }
    }

    return focusedIndex
  },

  focusOption(direction) {
    let tags = pluck(this.props.filteredTags, 'text')
    let tagCount = tags.length

    if (!tagCount) {
      return
    }

    let focusedIndex = this.getFocusedOptionIndex()
    let focusedOption = tags[0]

    if (direction === 'next' && focusedIndex > -1 && focusedIndex < tagCount - 1) {
      focusedOption = tags[focusedIndex + 1]
    } else if (direction === 'previous') {
      if (focusedIndex > 0) {
        focusedOption = tags[focusedIndex - 1]
      } else {
        focusedOption = tags[tagCount - 1]
      }
    }

    this.props.update({
      focusedOption
    })
  },

  onKeyDown(ev) {
    const { removeTag, addTag, update, focus } = this.props
    const node = findDOMNode(this)

    switch (ev.keyCode) {
      case 8: // backspace
        if (node.value.length === 0) {
          removeTag()
        }
        break

      case 9: // tab
        if (node.value === '') {
          return
        }

        ev.preventDefault()

        if (this.props.filteredTags.length > 0) {
          if (!this.props.active) {
            this.focusOption('next')
          } else {
            addTag(this.props.active)
          }
        } else {
          addTag(node.value)
        }

        break

      case 13: // enter
        ev.preventDefault()
        if (this.props.active) {
          addTag(this.props.active)
        } else {
          addTag(node.value)
        }
        break

      case 188: // comma
        if (node.value.length > 0 && ev.shiftKey !== true) {
          ev.preventDefault()
          addTag(node.value)
        }
        break

      case 38: // up
        this.focusOption('previous')
        break

      case 40: // down
        this.focusOption('next')
        break

      case 27: // esc
        // console.log('ESCAPE');
        break

      default:
        update({
          focusedOption: ''
        })
    }
  },

  render() {
    return React.cloneElement(
      React.Children.only(this.props.children), {
        onKeyDown: this.onKeyDown
      }
    )
  }
})

export default KeyHandler
