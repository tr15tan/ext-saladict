import { combineReducers } from 'redux'
import config, { ConfigState } from './config'
import selection, { SelectionState } from './selection'
import dictionaries, { DictionariesState } from './dictionaries'
import widget, { WidgetState } from './widget'

export default combineReducers({
  config,
  selection,
  dictionaries,
  widget,
})

export type StoreState = {
  readonly config: ConfigState
  readonly selection: SelectionState
  readonly dictionaries: DictionariesState
  readonly widget: WidgetState
}
