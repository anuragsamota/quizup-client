import React from 'react';

function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content">
      <aside>
        <p>© {new Date().getFullYear()} QuizUp. All rights reserved.</p>
      </aside>
    </footer>
  );
}

export default Footer;
