import TrashSvg from '../svg/TrashSvg';
import PencilSvg from '../svg/PencilSvg';

interface FunctionsProps {
  editCb: () => void;
  trashCb: () => void;
}

export default function Functions({ editCb, trashCb }: FunctionsProps) {
  return (
    <div className="btn-ctn flex gap-x-1 text-gray-300">
      <button type="button" className="animated-btn-sq" onClick={editCb}>
        <PencilSvg size="20" />
      </button>
      <button type="button" className="animated-btn-sq" onClick={trashCb}>
        <TrashSvg size="20" />
      </button>
    </div>
  );
}
