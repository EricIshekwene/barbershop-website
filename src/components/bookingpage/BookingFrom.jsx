import React from 'react'

function BookingFrom() {
  return (
    <div>
      <form action="">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" />
        </div>
      </form>
    </div>
  )
}

export default BookingFrom