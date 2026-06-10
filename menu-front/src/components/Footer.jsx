import React from "react";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-left">© Lo de Fer</div>
        <div className="footer-links">
          <a className="footer-link" href="#" aria-label="Instagram" title="Instagram">
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" fill="none" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" />
            </svg>
            <span>Instagram</span>
          </a>

          <a className="footer-link" href="#" aria-label="WhatsApp" title="WhatsApp">
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M20.5 3.5C18.9 2 16.8 1 14.5 1 8.8 1 4 5.8 4 11.5c0 2 0.5 3.9 1.4 5.6L3 21l4.1-1.3c1.6 0.9 3.4 1.4 5.4 1.4 5.7 0 10.5-4.8 10.5-10.5 0-2.3-1-4.4-2.9-6z" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M7.8 10.8c0.2 0.6 0.9 1.2 1.9 1.7 1 0.5 1.7 0.7 2.3 0.9 0.6 0.2 1 0.2 1.4 0.1s0.8-0.4 1-0.7c0.2-0.3 0.2-0.6 0.1-0.8-0.1-0.2-0.4-0.5-0.8-0.8-0.4-0.3-0.9-0.6-1.2-0.8-0.4-0.2-0.7-0.1-1 0.1s-0.7 0.5-1.2 0.9c-0.4 0.3-0.8 0.5-1.2 0.4-0.4-0.1-0.9-0.5-1.2-1s-0.4-0.9-0.3-1.2c0.1-0.3 0.6-0.3 1.2-0.1 0.6 0.2 1.1 0.4 1.5 0.6 0.4 0.2 0.7 0.1 0.9-0.1 0.2-0.2 0.4-0.5 0.6-0.7" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
