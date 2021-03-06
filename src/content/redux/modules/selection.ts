import { message } from '@/_helpers/browser-api'
import { MsgSelection, MsgType } from '@/typings/message'
import { getDefaultSelectionInfo } from '@/_helpers/selection'

/*-----------------------------------------------*\
    Actions
\*-----------------------------------------------*/

export const enum Actions {
  NEW_SELECTION = 'selection/NEW_SELECTION'
}

/*-----------------------------------------------*\
    State
\*-----------------------------------------------*/

export type SelectionState = MsgSelection

const initState: SelectionState = {
  type: MsgType.Selection,
  selectionInfo: getDefaultSelectionInfo(),
  mouseX: 0,
  mouseY: 0,
  dbClick: false,
  ctrlKey: false,
}

export default function reducer (state = initState, action): SelectionState {
  switch (action.type) {
    case Actions.NEW_SELECTION:
      return action.payload
    default:
      return state
  }
}

/*-----------------------------------------------*\
    Action Creators
\*-----------------------------------------------*/

type Action = { type: Actions, payload?: any }

/** When new selection is made */
export function newSelection (selection): Action {
  return { type: Actions.NEW_SELECTION, payload: selection }
}

/*-----------------------------------------------*\
    Side Effects
\*-----------------------------------------------*/

type Dispatcher = (
  dispatch: (action: Action) => any,
) => any

export function listenSelection (): Dispatcher {
  return dispatch => {
    message.self.addListener(MsgType.Selection, message => dispatch(newSelection(message)))
  }
}
