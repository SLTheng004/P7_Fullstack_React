import React from 'react'
import { NavLink } from 'react-router-dom';


function PageNotFound() {
  return (
    <div>
        <h1> ERROR: Page not found!</h1>
        <h3> Try: <NavLink to="/">Home Page</NavLink></h3>
    </div>
  )
}

export default PageNotFound