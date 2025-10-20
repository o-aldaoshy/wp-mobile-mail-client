import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { XMarkIcon, EditIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, CameraIcon, ChevronDownIcon } from './icons';
import { IconButton } from './ui/IconButton';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  signature: string;
  onSave: (newSignature: string) => void;
}

const RichTextToolbar: React.FC = () => (
    <div className="bg-surface border-t border-outline flex items-center justify-between px-4 py-2 shrink-0">
        <div className="flex items-center space-x-4">
            <IconButton label="Formatting options"><EditIcon className="w-6 h-6 text-on-surface-variant" /></IconButton>
            <IconButton label="Undo"><ArrowUturnLeftIcon className="w-6 h-6 text-on-surface-variant" /></IconButton>
            <IconButton label="Redo"><ArrowUturnRightIcon className="w-6 h-6 text-on-surface-variant" /></IconButton>
            <IconButton label="Add image"><CameraIcon className="w-6 h-6 text-on-surface-variant" /></IconButton>
        </div>
        <div className="flex items-center space-x-2 text-on-surface-variant text-sm font-medium">
            <span>Roboto...</span>
            <ChevronDownIcon className="w-4 h-4" />
            <span>10</span>
            <ChevronDownIcon className="w-4 h-4" />
            <span className="font-bold">B</span>
        </div>
    </div>
);

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, signature, onSave }) => {
  const [currentSignature, setCurrentSignature] = useState(signature);

  useEffect(() => {
    if (isOpen) {
        setCurrentSignature(signature);
    }
  }, [isOpen, signature]);

  const handleSave = () => {
    onSave(currentSignature);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-bg z-[60] flex flex-col">
      <header className="flex items-center p-2 shrink-0">
        <IconButton label="Close" onClick={onClose}>
          <XMarkIcon className="w-6 h-6 text-on-surface" />
        </IconButton>
        <div className="flex-grow" />
        <button onClick={handleSave} className="font-semibold text-on-surface px-4 py-2">
          Save
        </button>
      </header>
      <main className="flex-grow p-4">
        <textarea
          value={currentSignature}
          onChange={(e) => setCurrentSignature(e.target.value)}
          className="w-full h-full bg-transparent outline-none resize-none text-on-surface"
          autoFocus
        />
      </main>
      <RichTextToolbar />
    </div>,
    document.body
  );
};