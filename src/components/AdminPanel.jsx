import React, { useState } from 'react'

export default function AdminPanel({ books, onAddBook, onUpdateAvailability }) {
  const [form, setForm] = useState({
    title: '', author: '', category: 'Marvel',
    priceRupees: '', rentPerDayRupees: '', availability: '5',
  })

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    onAddBook?.(form)
    setForm({ title: '', author: '', category: 'Marvel', priceRupees: '', rentPerDayRupees: '', availability: '5' })
  }

  return (
    <div className="admin">
      <h2>Admin</h2>
      <form className="book-form" onSubmit={submit}>
        <div className="fields">
          <div className="field">
            <label htmlFor="a-title">Title</label>
            <input id="a-title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g., Batman: Year One" />
          </div>
          <div className="field">
            <label htmlFor="a-author">Author</label>
            <input id="a-author" value={form.author} onChange={(e) => update('author', e.target.value)} placeholder="e.g., Frank Miller" />
          </div>
          <div className="field">
            <label htmlFor="a-category">Category</label>
            <select id="a-category" value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option>Marvel</option>
              <option>DC</option>
              <option>Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="a-price">Price (₹)</label>
            <input id="a-price" type="number" min="0" step="0.01" value={form.priceRupees} onChange={(e) => update('priceRupees', e.target.value)} placeholder="499" />
          </div>
          <div className="field">
            <label htmlFor="a-rent">Rent/Day (₹)</label>
            <input id="a-rent" type="number" min="0" step="0.01" value={form.rentPerDayRupees} onChange={(e) => update('rentPerDayRupees', e.target.value)} placeholder="20" />
          </div>
          <div className="field">
            <label htmlFor="a-avail">Availability</label>
            <input id="a-avail" type="number" min="0" step="1" value={form.availability} onChange={(e) => update('availability', e.target.value)} />
          </div>
        </div>
        <button className="btn primary" type="submit" disabled={!form.title.trim() || !form.author.trim()}>Add Book</button>
      </form>

      <div className="table-wrapper" style={{ marginTop: 16 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rent/Day</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td className="muted">{b.author}</td>
                <td>{b.category}</td>
                <td>₹{Number(b.priceRupees || 0).toLocaleString('en-IN')}</td>
                <td>₹{Number(b.rentPerDayRupees || 0).toLocaleString('en-IN')}</td>
                <td>
                  <input
                    style={{ width: 88 }}
                    type="number"
                    min="0"
                    step="1"
                    value={b.availability || 0}
                    onChange={(e) => onUpdateAvailability?.(b.id, Number(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


