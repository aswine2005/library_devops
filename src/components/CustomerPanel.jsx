import React from 'react'

function formatCurrencyINR(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '₹0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
}

export default function CustomerPanel({ books, cartItems, onAddToCart, onUpdateCartItemDates, onRemoveCartItem, onRent }) {
  const selectableBooks = books.filter(b => (b.availability || 0) > 0)

  return (
    <div className="customer">
      <h2>Customer</h2>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rent/Day</th>
              <th>Availability</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td className="muted">{b.author}</td>
                <td>{b.category}</td>
                <td>{formatCurrencyINR(Number(b.priceRupees) || 0)}</td>
                <td>{formatCurrencyINR(Number(b.rentPerDayRupees) || 0)}</td>
                <td>
                  {(b.availability || 0) > 0
                    ? <span className="badge success">Available · {b.availability}</span>
                    : <span className="badge danger">Not Available</span>}
                </td>
                <td>
                  <button className="btn outline" disabled={(b.availability || 0) <= 0} onClick={() => onAddToCart?.(b.id)}>Add to Cart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: 20 }}>Cart</h3>
      {cartItems.length === 0 ? (
        <div className="empty"><p>No items in cart. Add available books to rent.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Rent Start</th>
                <th>Return</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(ci => {
                const book = books.find(b => b.id === ci.bookId)
                const startISO = ci.startAt ? new Date(ci.startAt).toISOString() : ''
                const returnISO = ci.returnAt ? new Date(ci.returnAt).toISOString() : ''
                const startDate = startISO ? startISO.slice(0,10) : ''
                const startTime = startISO ? startISO.slice(11,16) : ''
                const returnDate = returnISO ? returnISO.slice(0,10) : ''
                const returnTime = returnISO ? returnISO.slice(11,16) : ''

                const updateStart = (date, time) => {
                  if (!date) return onUpdateCartItemDates?.(ci.id, null, ci.returnAt)
                  const t = time || '00:00'
                  const d = new Date(`${date}T${t}:00`)
                  onUpdateCartItemDates?.(ci.id, Number.isNaN(d.getTime()) ? null : d.getTime(), ci.returnAt)
                }
                const updateReturn = (date, time) => {
                  if (!date) return onUpdateCartItemDates?.(ci.id, ci.startAt, null)
                  const t = time || '23:59'
                  const d = new Date(`${date}T${t}:00`)
                  onUpdateCartItemDates?.(ci.id, ci.startAt, Number.isNaN(d.getTime()) ? null : d.getTime())
                }

                return (
                  <tr key={ci.id}>
                    <td>{book?.title || 'Unknown'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="date" value={startDate} onChange={(e) => updateStart(e.target.value, startTime)} />
                        <input type="time" value={startTime} onChange={(e) => updateStart(startDate, e.target.value)} />
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="date" value={returnDate} onChange={(e) => updateReturn(e.target.value, returnTime)} />
                        <input type="time" value={returnTime} onChange={(e) => updateReturn(returnDate, e.target.value)} />
                      </div>
                    </td>
                    <td className="actions">
                      <button className="btn ghost danger" onClick={() => onRemoveCartItem?.(ci.id)}>Remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button className="btn primary" onClick={onRent} disabled={cartItems.length === 0}>Rent</button>
      </div>
    </div>
  )
}


