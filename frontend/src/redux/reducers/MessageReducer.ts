/* eslint-disable import/no-anonymous-default-export */
import { SET_MESSAGE, CLEAR_MESSAGE } from "../actions/ActionTypes";

const initialState = {}

export default function (state = initialState, action: any) {
  const { type, payload } = action

  switch(type) {
    case SET_MESSAGE:
      return { message: payload }

    case CLEAR_MESSAGE:
      return { message: '' }

    default:
      return state
  }
}