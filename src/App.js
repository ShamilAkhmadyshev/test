import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import Footer from './components/Footer'
const App = () => {


  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMesage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
      .catch(error => {
        alert("fail")
      })
  }, [])

  const addNote = (e) => {
    e.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes([...notes, returnedNote])
        setNewNote("")
      })
      .catch(error => {
        alert("This note was already deleated from the server")
      })
  }

  if (!notes) {
    return
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {

        setErrorMesage(
          `Note "${note.content}" was already removed from the server`
        )
        setTimeout(() => {
          setErrorMesage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleNoteChange = (e) => {
    setNewNote(e.target.value)
  }
  const valueClear = (e) => {
    e.target.value = ""
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  const trueOrFalse = (e) => {
    e.preventDefault()
    if (showAll) {
      setShowAll(false)
    } else {
      setShowAll(true)
    }
  }


  // useEffect(() => {
  //   console.log('effect')
  //   axios
  //     .get("http://localhost:3005/notes")
  //     .then(response => {
  //       console.log("promise fulfilled")
  //       setNotes(response.data)
  //     })
  // }, [])
  // console.log("render", notes.length, 'notes')

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input placeholder={newNote} onChange={handleNoteChange} onBlur={valueClear} />
        <button type='submit'>Save</button>
        <button onClick={trueOrFalse}>Show {showAll ? "important" : "all"}</button>
      </form>
      <Footer />
    </div>
  )
}

export default App

// () => setShowAll(!showAll)