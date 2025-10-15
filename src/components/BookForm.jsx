import React, { useState } from 'react'

export default function BookForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [priceRupees, setPriceRupees] = useState('')
  const [dueDate, setDueDate] = useState('') // yyyy-mm-dd
  const [dueTime, setDueTime] = useState('') // HH:MM
  const [interestPerDay, setInterestPerDay] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Compose dueAt epoch ms if both date and time provided
    let dueAtMs = null
    if (dueDate) {
      const timePart = dueTime || '23:59'
      const composed = new Date(`${dueDate}T${timePart}:00`)
      if (!Number.isNaN(composed.getTime())) {
        dueAtMs = composed.getTime()
      }
    }
    onAdd?.(title, author, priceRupees, dueAtMs, interestPerDay)
    setTitle('')
    setAuthor('')
    setPriceRupees('')
    setDueDate('')
    setDueTime('')
    setInterestPerDay('')
  }

  const isDisabled = !title.trim() || !author.trim()

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="fields">
        <div className="field">
          <label htmlFor="title">Book Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g., The Pragmatic Programmer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
            placeholder="e.g., Andrew Hunt, David Thomas"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="price">Price (₹)</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 499"
            value={priceRupees}
            onChange={(e) => setPriceRupees(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="dueTime">Due time</label>
          <input
            id="dueTime"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="interest">Interest/day (₹)</label>
          <input
            id="interest"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 10"
            value={interestPerDay}
            onChange={(e) => setInterestPerDay(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <button className="btn primary" type="submit" disabled={isDisabled}>
        Add Book
      </button>
    </form>
  )
}


