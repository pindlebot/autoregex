import React from 'react'
import { render } from 'react-dom'
import {
  ContentBlock,
  Editor,
  EditorState,
  convertToRaw,
  SelectionState,
  Modifier,
  ContentState,
  convertFromRaw,
} from 'draft-js'
import { Map } from 'immutable'
import ReverseRegex from '../src'
import classnames from 'classnames'
import { expand } from 'draft-js-compact'
import { instanceOfContentBlock } from 'draft-js-compact/lib/util';
import { removeInlineStyle, selectBlock, insertBlocks } from 'draft-js-blocks'
import './style.scss'

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
    .split(/\r\n|\n|\r/gm)
}

const CUSTOM_STYLE_MAP = {
  'success': {
    backgroundColor: '#CCFCCB'
  },
  'fail': {
    backgroundColor: '#F5B7BB'
  }
}

class App extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
    results: EditorState.createEmpty(),
    regex: '',
    customStyleMap: CUSTOM_STYLE_MAP,
    highlights: false
  }
  onChange = editorState => {
    this.setState({ editorState })
  }

  handlePlay = async evt => {
    this.convertToData()
  }

  applyHighlights = (results) => {
    let { editorState } = this.state
    let currentContent = editorState.getCurrentContent()
    let blocks = currentContent.getBlockMap().toArray()
    let contentState = results.reduce((acc, { result, index }) =>
      Modifier.setBlockData(
        acc,
        selectBlock(blocks[index]),
        Map({ result })
      ),
      currentContent
    )
    let nextEditorState = EditorState.push(
      editorState,
      contentState,
      'change-block-data'
    )
    return nextEditorState
  }

  onFocus = evt => {
    this.setState(prevState => {
      if (prevState.highlights) {
        return { highlights: false }
      }
      return null
    })
  }

  convertToData = () => {
    let { editorState } = this.state
    let lines = getTextArray(editorState)
    if (!lines.length) return
    let { re, results } = new ReverseRegex(lines).tokenize().test()
    console.log({ re, results, lines })
    let nextEditorState = this.applyHighlights(results)
    this.setState({
      regex: re.toString(),
      editorState: nextEditorState,
      highlights: true
    })
  }

  blockStyleFn = contentBlock => {
    let result = contentBlock.getData().get('result')
    console.log({ result })
    if (this.state.highlights) {
      if (result) {
        return 'success'
      } else {
        return 'fail'
      }
    }
    return ''
  }

  onPaste = (text, html, editorState) => {
    let currentContent = editorState.getCurrentContent()
    let blocks = text.split(/\r\n|\n|\r/gm).filter(text => text !== '')
    console.log({ blocks })
    let raw = expand({ blocks: blocks })
    console.log({ raw })
    let contentState = convertFromRaw(raw)
    let newContentState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      contentState.getBlockMap()
    )

    let newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-fragment'
    )
    this.setState({ editorState: newEditorState })
    return 'handled'
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
        <div className='background'></div>
        <header>
          <div className={'upper'}>
            <div className={className}>{this.state.regex}</div>
          </div>
          <div className={'lower'}>
            <PlayButton onClick={this.handlePlay} />
            <div className='shadow'></div>
          </div>
        </header>
        <div className='container'>
          <section>
            <div className='playground-editor'>
              <PlaygroundEditor
                editorState={this.state.editorState}
                onChange={this.onChange}
                onFocus={this.onFocus}
                handlePastedText={this.onPaste}
                customStyleMap={this.state.customStyleMap}
                blockStyleFn={this.blockStyleFn}
              />
            </div>
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