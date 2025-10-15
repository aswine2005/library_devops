import React from 'react'

function StatusBadge({ status }) {
  const isBorrowed = status === 'borrowed'
  return (
    <span className={"badge " + (isBorrowed ? 'danger' : 'success')}>
      {isBorrowed ? 'Borrowed' : 'Available'}
    </span>
  )
}

function formatCurrencyINR(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '₹0'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
}

function formatDateTime(ms) {
  if (!ms) return '—'
  const d = new Date(ms)
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function BookList({ books, onToggleStatus, onDelete }) {
  if (!books.length) {
    return (
      <div className="empty">
        <p>No books yet. Add your first one above.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '28%' }}>Title</th>
            <th style={{ width: '18%' }}>Author</th>
            <th style={{ width: '14%' }}>Price</th>
            <th style={{ width: '22%' }}>Due</th>
            <th style={{ width: '10%' }}>Status</th>
            <th style={{ width: '8%' }}></th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => {
            const now = Date.now()
            const isBorrowed = book.status === 'borrowed'
            const isOverdue = isBorrowed && book.dueAt && now > book.dueAt
            const overdueDays = isOverdue ? Math.ceil((now - book.dueAt) / (24 * 60 * 60 * 1000)) : 0
            const interestPerDay = Number(book.interestPerDayRupees) || 0
            const accruedInterest = isOverdue ? overdueDays * interestPerDay : 0
            return (
            <tr key={book.id} className={isOverdue ? 'row-overdue' : undefined}>
              <td>
                <div className="title-cell">
                  <span className="title-text">{book.title}</span>
                </div>
              </td>
              <td className="muted">{book.author}</td>
              <td>{formatCurrencyINR(Number(book.priceRupees) || 0)}</td>
              <td>
                <div className="due">
                  <span>{formatDateTime(book.dueAt)}</span>
                  {isOverdue && (
                    <span className="badge warning" title={`Overdue by ${overdueDays} day(s)`}>
                      Overdue · +{formatCurrencyINR(accruedInterest)}
                    </span>
                  )}
                </div>
              </td>
              <td><StatusBadge status={book.status} /></td>
              <td className="actions">
                <button
                  className="btn outline"
                  onClick={() => onToggleStatus?.(book.id)}
                >
                  {book.status === 'available' ? 'Borrow' : 'Return'}
                </button>
                <button
                  className="btn ghost danger"
                  onClick={() => onDelete?.(book.id)}
                  aria-label={`Delete ${book.title}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  )
}


