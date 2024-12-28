import React from "react";
import SimpleContainer from "../../simpleComponents/SimpleContainer";

export default function SimplePopUp({isOpen, children, onClose}) {
    const styles = {
        overlayStyle: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // make sure it's above other content
        },
        cardStyle: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: '100%',
        },
        closeButton: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '16px',
            color: 'black',
            cursor: 'pointer',
        }
    }

    if (!isOpen) {
        return null;
    }
    
    return (
        <div style={styles.overlayStyle} onClick={onClose}>
            <div style={styles.cardStyle} onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button style={styles.closeButton} onClick={onClose}>X</button>
                {/* Children content */}
                {children}
            </div>
        </div>
    );
}
