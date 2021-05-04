import React, {Component} from 'react';
import './App.css';
import Preview from './component/preview/preview';
import Message from './component/message/message';
import Notes from './component/notes/notes';
import NotesList from './component/notes/notesList';
import Note from './component/notes/note';
import NoteForm from './component/notes/noteForm';
import Alert from './component/alert/alert';


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            notes: [],
            title: '',
            content: '',
            selectedNote: null,
            creating: false,
            editing: false,
            validation: [],
        }
    }

    componentWillMount(){
        if(localStorage.getItem('notes')){
            this.setState({notes: JSON.parse(localStorage.getItem('notes'))});
        }else{
            localStorage.setItem('notes', JSON.stringify([]));
        }
    }

    componentDidUpdate(){
        if(this.state.validation !== 0){
            setTimeout(() =>{
                this.setState({validation: []})
            }, 4000)
        }
    }

    validate() {
        const validationErrors = [];
        let passed = true;

        if(!this.state.title){
            validationErrors.push("الرجاء ادخال عنوان الملاحظة");
            passed = false;
        }

        if(!this.state.content){
            validationErrors.push("الرجاء ادخال نص الملاحظة");
            passed = false;
        }

        this.setState({validation: validationErrors});
        return passed;

    }

    saveToLocalStorage(name, value){
        localStorage.setItem(name, JSON.stringify(value))
    }

    addNewNote = () => {
        this.setState({creating: true, editing: false, title: '', content: ''});
    }

    onChangeTitle = (event) => {
        this.setState({title: event.target.value})
    }

    onChangeContent = (event) => {
        this.setState({content: event.target.value})
    }

    saveNewNote = () => {
        if(!this.validate()) return;
        const {title, content, notes} = this.state;
        const note = {
            id: new Date(),
            title: title,
            content: content
        };

        const updateNotes = [...notes, note];
        this.saveToLocalStorage('notes', updateNotes);
        this.setState({notes: updateNotes, creating: false, selectedNote: note.id, title: '', content:''});
    }

    updateNote = () => {
        if(!this.validate()) return;
        const {title, content, notes, selectedNote} = this.state;
        const updateNotes = [...notes];
        const noteIndex = notes.findIndex(note => note.id === selectedNote);

        updateNotes[noteIndex] = {
            id: selectedNote,
            title: title,
            content: content
        }
        this.saveToLocalStorage('notes', updateNotes);
        this.setState({notes: updateNotes, editing:false, title: '', content: ''})
    }

    deleteNote = () => {
        const updateNotes = [...this.state.notes];
        const noteIndex = updateNotes.findIndex(note => note.id === this.state.selectedNote);
        updateNotes.splice(noteIndex, 1);
        this.saveToLocalStorage('notes', updateNotes);
        this.setState({notes: updateNotes, selectedNote: null});
    }

    selectNote = (noteId) => {
        this.setState({selectedNote: noteId, creating: false, editing:false, active: true});
    }

    editNote = () => {
        const note = this.state.notes.filter(note => note.id === this.state.selectedNote)[0];
        this.setState({editing: true, title: note.title,content: note.content});
    }

    getAddNote = () => {
        return (
          
          <NoteForm 
            formTitle = "ملاحظة جديدة"
            title = {this.state.title}
            content = {this.state.content}
            titleChanged = {this.onChangeTitle}
            contentChanged = {this.onChangeContent}
            submitClicked = {this.saveNewNote}
            submitText = "حفظ"
            />
    
        );
    }

     getPreview = () => {
         const {notes, selectedNote} = this.state;

        if(notes.length == 0){
            return <Message title="لا يوجد ملاحظات" />
        }

        if(!selectedNote){
            return <Message title="اختر ملاحظة" />
        }

        const note = notes.filter(note => {return note.id === selectedNote})[0];

        let noteDisplay = (
            <div>
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                </div>
        );

        if(this.state.editing){
            noteDisplay = (
                <NoteForm 
                formTitle = "تعديل الملاحظة"
                title = {this.state.title}
                content = {this.state.content}
                titleChanged = {this.onChangeTitle}
                contentChanged = {this.onChangeContent}
                submitClicked = {this.updateNote}
                submitText = "تعديل"
                />
            );
        }

        return (
            <div>
                {!this.state.editing && 
                <div className="note-operations">
                <a href="#" onClick={this.editNote}><i className="fa fa-pencil-alt"/></a>
                <a href="#" onClick={this.deleteNote}><i className="fa fa-trash"/></a>
                </div>
                }
                <div>
                    {noteDisplay}
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="App">
                <Notes>
                    <NotesList>
                        {this.state.notes.map( note =>
                            <Note key={note.id}
                                  title={note.title}
                                  noteClicked={ () => this.selectNote(note.id)}
                                  active={this.state.selectedNote === note.id}
                                  />
                        )}
                    </NotesList>
                    <button className="add-btn" onClick={this.addNewNote}>
                        +
                    </button>
                </Notes>
                <Preview>
                    {this.state.creating ? this.getAddNote(): this.getPreview()}
                </Preview>
                {this.state.validation.length !== 0 && <Alert validationMessages={this.state.validation} />}
            </div>
        );
    }
}

export default App;
