import { useReducer, ChangeEvent } from 'react';

export default function useTodoDetails<T, K extends keyof T>(init: T) {
  const [todoDetails, dispatch] = useReducer(reducer, init);

  function reducer(
    state: T,
    action:
      | {
          type: 'change';
          detail: K;
          payload: T[K];
        }
      | {
          type: 'reset';
        }
  ) {
    switch (action.type) {
      case 'change': {
        console.log({ ...state, [action.detail]: action.payload });
        return { ...state, [action.detail]: action.payload };
      }

      case 'reset':
        return init;
    }
  }
  function onChange(e: ChangeEvent) {
    const el = e.target as HTMLInputElement | HTMLSelectElement;
    console.log(el.name, el.value);
    dispatch({
      type: 'change',
      detail: el.name as K,
      payload:
        el.type === 'checkbox' && el instanceof HTMLInputElement
          ? (el.checked as T[K])
          : (el.value as T[K]),
    });
  }

  function reset() {
    dispatch({
      type: 'reset',
    });
  }

  return {
    todoDetails,
    onChange,
    reset,
  };
}
