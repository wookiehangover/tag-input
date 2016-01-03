import React from 'react'
import { render } from 'react-dom'
import TagInput from '../src/TagInput'

require('./style.css')
const styles = require('../TagInput.css')
const tags = ["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"]

const App = React.createClass({
  getInitialState() {
    return {
      tags: ["aliceblue", "teal"]
    }
  },

  updateTags(tags) {
    this.setState({ tags })
  },

  render() {
    return (
      <div className="tag-input-wrapper">
        <TagInput
          tags={tags}
          value={this.state.tags}
          onChange={this.updateTags}
          className={styles.TagInput}
          placeholder="Add some colors!"
        />
        <div className="color-grid">
          {this.state.tags.map(tag =>
            <div className="color-block" style={{ background: tag }} key={tag}>
              <a href={`#${tag}`} name={tag} alt={tag} />
            </div>
          )}
        </div>
      </div>
    )
  }
})

render(<App />, document.getElementById('main'))
