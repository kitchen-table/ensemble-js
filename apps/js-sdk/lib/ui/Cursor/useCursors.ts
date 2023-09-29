import { resolve, TYPE } from 'di';

export default function useCursors() {
  const cursor = resolve(TYPE.CURSOR);

  return {
    deleteCursorClick: cursor().deleteCursorClick,
  };
}
