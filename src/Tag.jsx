import React from 'react'

const Tag = function({ value, remove }) {
  return (
    <div className="label label-default">
      <span>{value}</span>
      <button
        type="button"
        className="close"
        aria-label="Remove Tag"
        onClick={remove.bind(null, value)}>
          <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}

export default Tag
