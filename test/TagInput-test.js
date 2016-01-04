/* eslint-env mocha, node */

'use strict'

import { assert } from 'chai'
import React from 'react'
import { findDOMNode } from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import TagInput from '../src/TagInput'
import KeyHandler from '../src/KeyHandler'
import sinon from 'sinon/pkg/sinon'

const KEY_MAP = {
  backspace: 8,
  tab: 9,
  enter: 13,
  comma: 188,
  up: 38,
  down: 40,
  aKey: 65
}

describe('TagInput', function () {

  beforeEach(function () {
    this.changeSpy = sinon.spy()

    const props = {
      tags: ['a', 'aa', 'aaa', 'b', 'c'],
      onChange: this.changeSpy
    }

    this.component = TestUtils.renderIntoDocument(<TagInput {...props} />)
  })

  describe('componentDidMount renders', function () {
    it('the component', function () {
      const tagsInput = TestUtils.findRenderedComponentWithType(this.component, TagInput)
      assert.isDefined(tagsInput)
    })

    it('No tag labels', function () {
      const labels = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'label')
      assert.lengthOf(labels, 0)
    })

    it('tags input', function () {
      assert.isDefined(this.component.refs.input)
    })

    it('No tags menu', function () {
      const tagMenu = TestUtils.scryRenderedDOMComponentsWithTag(this.component, 'option')
      assert.lengthOf(tagMenu, 0)
    })
  })

  describe('filtered tags', function () {
    beforeEach(function () {
      this.component.setState({ filteredTags: ['a', 'aa']})
    })

    it('renders a tags menu', function () {
      const tagMenu = TestUtils.scryRenderedDOMComponentsWithTag(this.component, 'option')
      assert.lengthOf(tagMenu, 2)
    })

    describe('ListItems', function () {

      it('renders a List item for each result', function () {
        this.component.setState({
          filteredTags: ['a' , 'aa', 'aaa', 'aaaa']
        })

        const listItems = TestUtils.scryRenderedDOMComponentsWithTag(this.component, 'option')
        assert.lengthOf(listItems, 4)
      })

      it('onMouseOver of an item sets its class to focused', function () {
        const listItems = TestUtils.scryRenderedDOMComponentsWithTag(this.component, 'option')
        const chosenListItem = listItems[0]
        TestUtils.Simulate.mouseOver(findDOMNode(chosenListItem))
        assert.isTrue(findDOMNode(chosenListItem).classList.contains('tag-item__focused'))
      })

      it('renders a tag label for each prop value', function () {
        const props = {
          value: ['a' , 'aa'],
          tags: ['a', 'aa', 'b', 'bb'],
          onChange: function() {}
        }

        const component = TestUtils.renderIntoDocument(<TagInput {...props} />)
        const label = TestUtils.scryRenderedDOMComponentsWithClass(component, 'label')
        assert.lengthOf(label, 2)
      })
    })
  })

  describe('#addTag', function () {
    beforeEach(function () {
      this.component.setState({
        filteredTags: ['a','b','c']
      })
      this.component.addTag('a')
    })

    it('resets filtered tags state', function () {
      const filteredTags = this.component.state.filteredTags
      assert.sameMembers(filteredTags, [])
    })

    it('resets input value', function () {
      const inputValue = findDOMNode(this.component.refs.input).value
      assert.equal(inputValue, '')
    })

    it('allows original values', function() {
      this.changeSpy.reset()
      this.component.addTag('z')
      assert.isTrue(this.changeSpy.calledWith(['z']))
    })

    it('prevents original values when allowOriginalValues is false', function() {
      const props = {
        tags: ['a'],
        onChange: sinon.stub(),
        allowOriginalValues: false
      }
      const component = TestUtils.renderIntoDocument(<TagInput {...props}/>)
      component.addTag('z')
      assert.isFalse(props.onChange.called)
      component.addTag('a')
      assert.isTrue(props.onChange.calledWith(['a']))
    })
  })

  describe('#filterTags', function () {
    describe('without a value', function () {
      it('resets filteredTags', function () {
        this.component.setState({
          filteredTags: [{ text: 'a' }, { text: 'b' }, { text: 'c' }]
        })

        const syntheticEvent = {target: {value: ''}}
        this.component.filterTags(syntheticEvent)
        const filteredTags = this.component.state.filteredTags
        assert.sameMembers(filteredTags, [])
      })
    })

    describe('with a value', function () {
      it('sets the fuzzy filtered results in filteredTags state', function () {
        const syntheticEvent = {target: {value: 'a'}}
        this.component.filterTags(syntheticEvent)
        const filteredTags = this.component.state.filteredTags
        assert.sameMembers(filteredTags, ['a', 'aa', 'aaa'])
      })
    })
  })

  describe('TagInput keyboard events', function () {
    beforeEach(function () {
      this.inputNode = findDOMNode(this.component.refs.input)
    })

    describe('backspace', function () {
      it('removes no tags when there is an input value', function () {
        this.inputNode.value = 'abc'
        const removeSpy = sinon.spy(this.component, 'removeTag')
        TestUtils.Simulate.keyDown(this.inputNode, { keyCode: KEY_MAP.backspace })
        assert.isFalse(removeSpy.called)
      })

      it('removes last tag when there no input value', function () {
        const props = {
          tags: ['a', 'aa', 'b', 'bb'],
          value: ['a' , 'aa'],
          onChange: function() {}
        }

        const component = TestUtils.renderIntoDocument(<TagInput {...props} />)
        const removeSpy = sinon.spy(component, 'removeTag')
        const inputNode = findDOMNode(component.refs.input)
        component.forceUpdate()
        TestUtils.Simulate.keyDown(inputNode, { keyCode: KEY_MAP.backspace })
        assert.isTrue(removeSpy.called)
      })
    })

    describe('tab', function () {
      it('adds input value as a tag', function () {
        this.inputNode.value = 'abc'
        const addSpy = sinon.spy(this.component, 'addTag')
        this.component.forceUpdate()
        TestUtils.Simulate.keyDown(this.inputNode, { keyCode: KEY_MAP.tab })
        assert.isTrue(addSpy.calledWith('abc'))
      })
    })

    describe('enter', function () {
      it('sets the focused option as an tag', function () {
        this.component.setState({
          focusedOption: 'abc'
        })
        const addSpy = sinon.spy(this.component, 'addTag')
        this.component.forceUpdate()
        TestUtils.Simulate.keyDown(this.inputNode, { keyCode: KEY_MAP.enter })
        assert.isTrue(addSpy.calledWith('abc'))
      })

      it('sets the input value as an tag', function () {
        this.inputNode.value = 'abc'
        const addSpy = sinon.spy(this.component, 'addTag')
        this.component.forceUpdate()
        TestUtils.Simulate.keyDown(this.inputNode, { keyCode: KEY_MAP.enter })
        assert.isTrue(addSpy.calledWith('abc'))
      })
    })

    describe('comma', function () {
      it('adds the preceeding input as a tag', function () {
        this.inputNode.value = 'abc'
        const addSpy = sinon.spy(this.component, 'addTag')
        this.component.forceUpdate()
        TestUtils.Simulate.keyDown(this.inputNode, { keyCode: KEY_MAP.comma })
        assert.isTrue(addSpy.calledWith('abc'))
      })
    })

    describe('nav keys', function () {
      beforeEach(function () {
        this.component.setState({
          filteredTags: ['a', 'b', 'c'],
          focusedOption: 'b'
        })
      })

      describe('up', function () {
        it('sets focusedOption to the previous list option', function () {
          TestUtils.Simulate.keyDown(this.inputNode, { keyCode: KEY_MAP.up })
          const focusedOption = this.component.state.focusedOption
          assert.equal(focusedOption, 'a')
        })
      })

      describe('down', function () {
        it('sets focusedOption to the next list option', function () {
          TestUtils.Simulate.keyDown(this.inputNode, { keyCode: KEY_MAP.down })
          const focusedOption = this.component.state.focusedOption
          assert.equal(focusedOption, 'c')
        })
      })

      it('#getFocusedOptionIndex', function () {
        const component = TestUtils.findRenderedComponentWithType(this.component, KeyHandler)
        const index = component.getFocusedOptionIndex()
        assert.equal(index, 1)
      })
    })

    describe('any other key', function () {
      before(function () {
        this.component.setState({
          focusedOption: 'focus'
        })
      })

      it('resets the focused option', function () {
        TestUtils.Simulate.keyDown(this.inputNode, { keyCode: KEY_MAP.aKey })
        const focusedOption = this.component.state.focusedOption
        assert.equal(focusedOption, '')
      })
    })
  })
})

