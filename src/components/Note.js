const Note = ({ note, toggleImportance }) => {
    const label = note.important ? "Make not important" : "Make important"
    const style = {
        color: "grey",
        padding: 3,
        fontSize: 15,
    }
    return (
        <li  >{note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    )
}

export default Note