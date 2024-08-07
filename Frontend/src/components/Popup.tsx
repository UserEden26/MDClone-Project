import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface IPopup {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Popup: React.FC<IPopup> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="popup-close" onClick={onClose}>
                    &#10005;
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('portal')!
    );
};

export default Popup;
