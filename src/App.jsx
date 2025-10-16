import React, { useMemo, useState, useEffect } from 'react'
import BookForm from './components/BookForm.jsx'
import BookList from './components/BookList.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import CustomerPanel from './components/CustomerPanel.jsx'

function createInitialBooks() {
  const randomAvail = () => 4 + Math.floor(Math.random() * 2) // 4-5
  return [
    { title: 'The Amazing Spider-Man 2', author: 'Stan Lee', category: 'Marvel', priceRupees: 399, rentPerDayRupees: 15, availability: randomAvail() },
    { title: 'Batman: Year One', author: 'Frank Miller', category: 'DC', priceRupees: 499, rentPerDayRupees: 20, availability: randomAvail() },
    { title: 'Watchmen', author: 'Alan Moore', category: 'DC', priceRupees: 599, rentPerDayRupees: 22, availability: randomAvail() },
    { title: 'X-Men: Dark Phoenix Saga', author: 'Chris Claremont', category: 'Marvel', priceRupees: 449, rentPerDayRupees: 18, availability: randomAvail() },
    { title: 'V for Vendetta', author: 'Alan Moore', category: 'Other', priceRupees: 549, rentPerDayRupees: 19, availability: randomAvail() },
  ].map(b => ({
    id: crypto.randomUUID(),
    status: b.availability > 0 ? 'available' : 'unavailable',
    createdAt: Date.now(),
    ...b,
  }))
}

export default function App() {
  const [activeTab, setActiveTab] = useState('customer') // 'customer' | 'admin'
  const [books, setBooks] = useState([])
  const [cartItems, setCartItems] = useState([]) // {id, bookId, startAt, returnAt}

  useEffect(() => {
    setBooks(createInitialBooks())
  }, [])

  const handleAddBook = (title, author, priceRupees, dueAtMs, interestPerDayRupees) => {
    const trimmedTitle = title.trim()
    const trimmedAuthor = author.trim()
    if (!trimmedTitle || !trimmedAuthor) return
    const parsedPrice = Number(priceRupees)
    const parsedInterest = Number(interestPerDayRupees)
    const safeDueAt = typeof dueAtMs === 'number' && !Number.isNaN(dueAtMs) ? dueAtMs : null

    setBooks(prev => [
      {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        author: trimmedAuthor,
        priceRupees: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
        interestPerDayRupees: Number.isFinite(parsedInterest) && parsedInterest >= 0 ? parsedInterest : 0,
        dueAt: safeDueAt, // epoch ms for due date/time, optional
        status: 'available',
        category: 'Other',
        rentPerDayRupees: 0,
        availability: 1,
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }

  const handleToggleStatus = (id) => {
    setBooks(prev => prev.map(b => b.id === id ? {
      ...b,
      status: b.status === 'available' ? 'borrowed' : 'available'
    } : b))
  }

  const handleDelete = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  // Admin actions
  const handleAdminAddBook = (bookInput) => {
    const title = bookInput.title?.trim() || ''
    const author = bookInput.author?.trim() || ''
    const category = bookInput.category || 'Other'
    if (!title || !author) return
    const priceRupees = Number(bookInput.priceRupees) || 0
    const rentPerDayRupees = Number(bookInput.rentPerDayRupees) || 0
    const availability = Math.max(0, Math.floor(Number(bookInput.availability) || 0))
    setBooks(prev => ([
      {
        id: crypto.randomUUID(),
        title, author, category,
        priceRupees, rentPerDayRupees, availability,
        status: availability > 0 ? 'available' : 'unavailable',
        createdAt: Date.now(),
      },
      ...prev,
    ]))
  }

  const handleAdminUpdateAvailability = (bookId, availability) => {
    setBooks(prev => prev.map(b => b.id === bookId ? {
      ...b,
      availability: Math.max(0, Math.floor(availability)),
      status: Math.max(0, Math.floor(availability)) > 0 ? 'available' : 'unavailable'
    } : b))
  }

  // Customer actions
  const handleAddToCart = (bookId) => {
    const book = books.find(b => b.id === bookId)
    if (!book || book.availability <= 0) return
    if (cartItems.some(ci => ci.bookId === bookId)) return
    setCartItems(prev => ([...prev, { id: crypto.randomUUID(), bookId, startAt: null, returnAt: null }]))
  }

  const handleUpdateCartItemDates = (cartItemId, startAt, returnAt) => {
    setCartItems(prev => prev.map(ci => ci.id === cartItemId ? { ...ci, startAt, returnAt } : ci))
  }

  const handleRemoveCartItem = (cartItemId) => {
    setCartItems(prev => prev.filter(ci => ci.id !== cartItemId))
  }

  const handleRent = () => {
    // Only rent items with valid dates
    const validItems = cartItems.filter(ci => typeof ci.startAt === 'number' && typeof ci.returnAt === 'number' && ci.returnAt > ci.startAt)
    if (!validItems.length) return
    setBooks(prev => prev.map(b => {
      const count = validItems.filter(ci => ci.bookId === b.id).length
      if (!count) return b
      const newAvail = Math.max(0, (b.availability || 0) - count)
      return { ...b, availability: newAvail, status: newAvail > 0 ? 'available' : 'unavailable' }
    }))
    setCartItems([])
  }

  const stats = useMemo(() => {
    const total = books.length
    const borrowed = books.filter(b => b.status === 'borrowed').length
    const available = total - borrowed
    return { total, borrowed, available }
  }, [books])

  return (
    <div className="app">
      <header className="header">
        <h1>Library Management System</h1>
        <p className="subtitle">Admin and Customer in one responsive, modern UI</p>
      </header>

      <main className="container">
        <div className="tabs">
          <button className={"tab " + (activeTab === 'customer' ? 'active' : '')} onClick={() => setActiveTab('customer')}>Customer</button>
          <button className={"tab " + (activeTab === 'admin' ? 'active' : '')} onClick={() => setActiveTab('admin')}>Admin</button>
        </div>

        {activeTab === 'admin' ? (
          <section className="panel">
            <AdminPanel
              books={books}
              onAddBook={handleAdminAddBook}
              onUpdateAvailability={handleAdminUpdateAvailability}
            />
          </section>
        ) : (
          <section className="panel">
            <CustomerPanel
              books={books}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateCartItemDates={handleUpdateCartItemDates}
              onRemoveCartItem={handleRemoveCartItem}
              onRent={handleRent}
            />
          </section>
        )}
      </main>

      <footer className="footer">
        <span>Done by Aswin</span>
      </footer>
    </div>
  )
}


