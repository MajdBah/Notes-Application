import React from 'react';

function Notes(props) {
    return (
        <div className="notes-section">
            {props.children}
        </div>
    )

}

export default Notes;