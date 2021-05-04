import React from 'react';

function Note(props) {
    const {title, active, noteClicked} = props;
    return (
        <li className={`note-item ${active && 'active'}`} onClick={noteClicked}>{title}</li>
    )

}

export default Note;