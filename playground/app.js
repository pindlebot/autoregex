import React from 'react'
import { render } from 'react-dom'
import {
  ContentBlock,
  Editor,
  EditorState,
  convertToRaw,
  SelectionState,
  Modifier,
  ContentState
} from 'draft-js'
import ReverseRegex from '../src'
import classnames from 'classnames'
import { expand } from 'draft-js-compact'
import { instanceOfContentBlock } from 'draft-js-compact/lib/util';
import { removeInlineStyle, selectBlock } from 'draft-js-blocks'

class PlaygroundEditor extends React.Component {
  componentDidMount () {
    if (this.props.readOnly) return
    this.editor.focus()
  }

  render () {
    return (
      <Editor 
        ref={ref => {
          this.editor = ref
        }}
        {...this.props}
      />
    )
  }
}

const PlayButton = props => (
  <div className="execute-button-wrap" onClick={props.onClick}>
    <div className="execute-button" title="Execute">
      <svg width="35" height="35" viewBox="3.5,4.5,24,24"><path d="M 11 9 L 24 16 L 11 23 z"></path></svg>
    </div>
  </div>
)

const getTextArray = (editorState) => {
  return editorState.getCurrentContent()
    .getPlainText('\n')
    .split('\n')
}

class App extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
    results: EditorState.createEmpty(),
    regex: ''
  }
  onChange = editorState => {
    this.setState({ editorState })
  }

  handlePlay = evt => {
    this.convertToData()
  }

  applyHighlights = (results) => {
    let { editorState } = this.state
    let currentContent = editorState.getCurrentContent()
    let blocks = currentContent.getBlockMap().toArray()
    let contentState = results.reduce((acc, { result, index }) =>
      Modifier.applyInlineStyle(
        acc,
        selectBlock(blocks[index]),
        result.toString().toUpperCase()
      ),
      currentContent
    )
    let nextEditorState = EditorState.push(
      editorState,
      contentState,
      'change-inline-style'
    )
    return nextEditorState
  }

  clearHighlights = () => {
    if (!this.state.highlights) return
    let { editorState } = this.state
    let nextEditorState = ['TRUE', 'FALSE'].reduce((acc, style) => 
      removeInlineStyle(acc, style, editorState.getCurrentContent().getBlockMap())
    , editorState)
    this.setState({
      editorState: nextEditorState,
      highlights: false
    })
  }

  onFocus = evt => {
    this.clearHighlights()
  }

  convertToData = () => {
    let { editorState } = this.state
    let lines = getTextArray(editorState)
    if (!lines.length) return
    let { re, results } = new ReverseRegex(lines).tokenize().test()
    let nextEditorState = this.applyHighlights(results)
    this.setState({
      regex: re.toString(),
      editorState: nextEditorState,
      highlights: true
    })
  }

  render () {
    const className = classnames(
      'result',
      this.state.regex
        ? 'active'
        : ''
    )
    return (
      <main>
        <header>
          <div className={className}>{this.state.regex}</div>
          <PlayButton onClick={this.handlePlay} />
        </header>
        <div className='container'>
          <section>
            <PlaygroundEditor
              editorState={this.state.editorState}
              onChange={this.onChange}
              onFocus={this.onFocus}
              customStyleMap={{
                'TRUE': {
                  backgroundColor: '#CCFCCB'
                },
                'FALSE': {
                  backgroundColor: '#F5B7BB'
                }
              }}
            />
          </section>
          <section className={'read-only'}>
            <PlaygroundEditor
              editorState={this.state.results}
              readOnly={true}
            />
          </section>
        </div>
      </main>
    )
  }
}

render(
  <App />,
  document.getElementById('root')
)