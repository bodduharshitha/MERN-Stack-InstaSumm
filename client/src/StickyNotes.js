import React, { useState, useEffect } from "react";
import "./StickyNotes.css";
import html2canvas from "html2canvas";
import { AppBar, Toolbar, Typography } from "@mui/material";

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  
  // Add a new sticky note
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
      color: "#FED800", // Default yellow
      opacity: 1,
      width: 300,
      height: 300,
      position: { x: 50, y: 50 },
    };
    setNotes([...notes, newNote]);
  };

  // Handle title change
const handleTitleChange = (id, e) => {
  const updatedTitle = e.target.innerText; // Get the content from the contentEditable div
  updateNote(id, { title: updatedTitle }); // Update the note's title state
};

  // Update a note's properties
  const updateNote = (id, updatedProperties) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, ...updatedProperties } : note)));
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

const handleContentChange = (id, e) => {
  const updatedContent = e.target.innerHTML; // Get the content from the contentEditable div
  updateNote(id, { content: updatedContent }); // Update the note's content state
};

// Drag and move notes
const handleDrag = (e, id) => {
  const noteIndex = notes.findIndex((note) => note.id === id);
  const updatedNotes = [...notes];
  updatedNotes[noteIndex].position = {
    x: e.clientX - e.target.offsetWidth / 2,
    y: e.clientY - e.target.offsetHeight / 2,
  };
  setNotes(updatedNotes);
};

const takeScreenshot = async (noteId) => {
  const noteElement = document.querySelector(`#note-${noteId}`);
  if (noteElement) {
    // Store original styles
    const originalOverflow = noteElement.style.overflow;
    const originalHeight = noteElement.style.height;

    // Temporarily expand the note to show all content
    noteElement.style.overflow = "visible";
    noteElement.style.height = "auto";

    // Temporarily hide action buttons
    const actions = noteElement.querySelector(".note-actions");
    if (actions) {
      actions.style.visibility = "hidden";
    }

    // Capture the screenshot
    const canvas = await html2canvas(noteElement, {
      scale: 2, // Higher resolution
      useCORS: true, // Cross-origin handling
      allowTaint: true,
    });

    // Restore original styles
    noteElement.style.overflow = originalOverflow;
    noteElement.style.height = originalHeight;

    // Restore visibility of action buttons
    if (actions) {
      actions.style.visibility = "visible";
    }

    // Convert the canvas to an image and trigger download
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `sticky-note-${noteId}.png`;
    link.click();
  }
};

  // Render sticky notes
  return (
    <div className="sticky-notes-container">
      {/* AppBar Component */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #FFB6C1, #ADD8E6)",
          boxShadow: "none",
          padding: "10px 0",
        }}
      >
        <Toolbar sx={{ flexDirection: "column", textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              color: "#000000",
              fontWeight: "bold",
              fontSize: "2.5rem",
              fontFamily: "Times New Roman, Times, serif",
              letterSpacing: "2px",
            }}
          >
            InstaSumm
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#000000",
              fontSize: "1.2rem",
              fontFamily: "Times New Roman, Times, serif",
              marginTop: "10px",
              letterSpacing: "1px",
            }}
          >
            Empowering Users with API-Driven Text Summarization and Personalizable Notes
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="header">
        <button className="add-note-btn" onClick={addNote}>
          + Add Note
        </button>
      </div>
      <div className="notes-area">
        {notes.map((note) => (
          <div
            id={`note-${note.id}`}
            key={note.id}
            className="sticky-note"
            style={{
              backgroundColor: note.color,
              opacity: note.opacity,
              width: `${note.width}px`,
              height: `${note.height}px`,
              left: `${note.position.x}px`,
              top: `${note.position.y}px`,
            }}
            draggable
            onDragEnd={(e) => handleDrag(e, note.id)}
          >
             <div
      className="note-title"
      contentEditable
      suppressContentEditableWarning={true}
      style={{
        fontWeight: "bold",
        textAlign: "center",
        padding: "5px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
        cursor: "text",
      }}
      onInput={(e) => handleTitleChange(note.id, e)}
    />
            <div
              className="note-content"
              contentEditable
              suppressContentEditableWarning={true}
              style={{
                whiteSpace: "pre-wrap", // Preserve line breaks
                overflowWrap: "break-word", // Prevent text overflow
                outline: "none", // Remove default outline
                color: note.fontColor, // Apply font color
              }}
              onInput={(e) => handleContentChange(note.id, e)}
            />
            <div className="note-actions">
            <input
    type="color"
    title="Background color"
    className="color-picker"
    value={note.color}
    onChange={(e) => updateNote(note.id, { color: e.target.value })}
  />
  <button
    className="format-btn"
    onClick={() => {
      document.execCommand("bold");
    }}
    title="Bold"
  >
    B
  </button>
  <button
    className="format-btn"
    onClick={() => {
      document.execCommand("italic");
    }}
    title="Italics"
  >
    I
  </button><input
  type="color"
  className="font-color-picker"
  title="Change Font Color"
  onChange={(e) => {
    const color = e.target.value;
    document.execCommand("foreColor", false, color); // Applies color to selected text
  }}
/>
<button
    className="format-btn"
    onClick={() => {
      document.execCommand("insertUnorderedList"); // Adds bullet points
    }}
    title="Bullet Points"
  >
    •
  </button>
              <button
                className="resize-btn"
                onClick={() => updateNote(note.id, { width: note.width + 50, height: note.height + 50 })
            }title = "Maximize"
              >
                🗖
              </button>
              <button
  className="resize-btn"
  onClick={() => {
    // Define minimum width and height
    const minWidth = 200;
    const minHeight = 200;

    // Only update the note if the new size is above the minimum
    const newWidth = note.width - 50;
    const newHeight = note.height - 50;

    if (newWidth >= minWidth && newHeight >= minHeight) {
      updateNote(note.id, { width: newWidth, height: newHeight });
    }
  }}
  title="Minimize"
>
  ━
</button>

              <button
    className="screenshot-btn"
    onClick={() => takeScreenshot(note.id)}
    title="Take Screenshot"
  >
    ❤️
  </button>
              <button className="delete-btn" onClick={() => deleteNote(note.id)} title="Delete">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default StickyNotes;
