import React from 'react';

function Navbar() {
  return (
    <nav className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost normal-case text-xl">QuizUp</a>
      </div>
      <div className="flex-none">
        <a href="/dashboard" className="btn btn-secondary">Dashboard</a>
      </div>
    </nav>
  );
}

export default Navbar;
