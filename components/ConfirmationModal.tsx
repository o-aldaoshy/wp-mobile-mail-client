import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onClose }) => {
    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 z-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-dialog-title"
            >
                <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6">
                    <h2 id="confirmation-dialog-title" className="text-lg font-medium text-on-surface mb-6 text-center">
                        {message}
                    </h2>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-full text-sm font-semibold text-on-surface-variant hover:bg-on-surface/10 transition-colors"
                        >
                            No
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-2 rounded-full text-sm font-semibold bg-accent text-on-primary hover:opacity-90 transition-opacity"
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
