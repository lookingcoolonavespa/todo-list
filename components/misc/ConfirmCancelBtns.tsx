interface ConfirmCancelBtnsProps {
  confirmText: string;
  cancelText: string;
  cancelCb: () => void;
  className?: string;
}

export default function ConfirmCancelBtns({
  confirmText,
  cancelText,
  cancelCb,
  className,
}: ConfirmCancelBtnsProps) {
  return (
    <div className={`btn-ctn flex gap-x-1 text-gray-300 ${className || ''}`}>
      <button type="submit" className="action-btn rect-btn">
        {confirmText}
      </button>
      <button
        type="button"
        className="underline_on_hover rect-btn"
        onClick={cancelCb}
      >
        {cancelText}
      </button>
    </div>
  );
}
