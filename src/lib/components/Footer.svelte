<footer class="site-footer">
  <div class="footer-divider"></div>

  <div class="footer-grid">
    <div class="footer-column footer-brand">
      <h4>SGPA</h4>
      <p>
        Academic Project Management System focused on tracking, organizing, and
        consulting projects within the institutional environment.
      </p>
    </div>

    <div class="footer-column">
      <h4>CONTACT</h4>
      <p>58th Street #55-24A Barranquilla, Colombia</p>
      <p>Email: promocion@ul.edu.co</p>
      <p>Phone: (+57) 314 8962734</p>
    </div>

    <div class="footer-column">
      <h4>USEFUL LINKS</h4>
      <a href="/">Home</a>
      <a href="/login">System login</a>
      <span class="footer-link-disabled" aria-disabled="true">Data processing policy</span>
      <span class="footer-link-disabled" aria-disabled="true">User support</span>
    </div>

    <div class="footer-column">
      <h4>MODULES</h4>
      <a href="/coordinator">Coordinator</a>
      <a href="/teacher">Teacher</a>
      <a href="/students">Student</a>
    </div>
  </div>

  <div class="footer-divider bottom"></div>

  <div class="footer-social" aria-label="Social media and contact links">
    <span aria-label="Facebook" aria-disabled="true" class="social-link facebook" title="Facebook">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14.18 8.35H17V4.22C16.52 4.15 14.86 4 13.3 4C10.04 4 7.8 5.93 7.8 9.45V12H4.5V16.65H7.8V24H12.55V16.65H16.05L16.65 12H12.55V9.9C12.55 8.82 12.84 8.35 14.18 8.35Z"
        />
      </svg>
    </span>

    <span aria-label="Instagram" aria-disabled="true" class="social-link instagram" title="Instagram">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.55" />
        <circle cx="17" cy="7" r="1.1" />
      </svg>
    </span>

    <a
      href="https://wa.me/573148962734"
      aria-label="WhatsApp"
      class="social-link whatsapp"
      title="WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12.04 2.5A9.45 9.45 0 0 0 3.9 16.75L2.5 21.5L7.39 20.18A9.44 9.44 0 1 0 12.04 2.5ZM12.04 18.86A7.05 7.05 0 0 1 8.45 17.87L8.19 17.72L5.29 18.5L6.07 15.67L5.9 15.38A7.06 7.06 0 1 1 12.04 18.86ZM15.92 13.55C15.71 13.44 14.66 12.93 14.47 12.86C14.27 12.79 14.13 12.75 13.98 12.97C13.83 13.18 13.42 13.66 13.29 13.8C13.16 13.94 13.04 13.96 12.82 13.85C12.61 13.74 11.93 13.52 11.13 12.81C10.5 12.25 10.08 11.56 9.95 11.35C9.82 11.13 9.94 11.01 10.04 10.91C10.14 10.81 10.26 10.65 10.36 10.53C10.47 10.4 10.5 10.31 10.57 10.17C10.64 10.03 10.6 9.9 10.55 9.8C10.5 9.69 10.06 8.64 9.89 8.22C9.71 7.81 9.53 7.86 9.4 7.85H8.98C8.83 7.85 8.6 7.9 8.41 8.11C8.21 8.32 7.66 8.83 7.66 9.88C7.66 10.93 8.43 11.94 8.53 12.08C8.64 12.22 10.04 14.35 12.19 15.27C12.7 15.49 13.1 15.62 13.42 15.73C13.93 15.89 14.4 15.87 14.76 15.81C15.18 15.75 16.04 15.29 16.21 14.8C16.39 14.31 16.39 13.9 16.34 13.8C16.29 13.71 16.13 13.65 15.92 13.55Z"
        />
      </svg>
    </a>

    <a
      href="tel:+573148962734"
      aria-label="Phone"
      class="social-link phone"
      title="Phone"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.69 6.45 9.06 7.57C9.17 7.92 9.09 8.31 8.81 8.59L6.62 10.79Z"
        />
      </svg>
    </a>
  </div>
</footer>

<style>
  .site-footer {
    background: linear-gradient(135deg, var(--sgpa-blue-dark), var(--sgpa-blue));
    color: #ffffff;
    padding: 56px 24px 34px;
    border-top: 5px solid var(--sgpa-yellow);
  }

  .footer-divider {
    max-width: 1280px;
    margin: 0 auto 34px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(242, 183, 5, 0.55),
      transparent
    );
  }

  .footer-divider.bottom {
    margin-top: 34px;
    margin-bottom: 24px;
  }

  .footer-grid {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
    gap: 32px;
  }

  .footer-column h4 {
    margin: 0 0 18px;
    color: #ffffff;
    font-size: 0.92rem;
    letter-spacing: 0.08em;
    font-weight: 950;
  }

  .footer-column p,
  .footer-column a,
  .footer-column .footer-link-disabled {
    display: block;
    margin: 0 0 10px;
    color: rgba(255, 255, 255, 0.78);
    text-decoration: none;
    line-height: 1.65;
    font-size: 0.95rem;
  }

  .footer-column a:hover {
    color: var(--sgpa-yellow);
  }

  .footer-link-disabled {
    cursor: default;
  }

  .footer-brand p {
    max-width: 360px;
  }

  .footer-social {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .social-link {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    text-decoration: none;
    background:
      radial-gradient(circle at top left, rgba(255, 255, 255, 0.14), transparent 60%),
      rgba(255, 255, 255, 0.09);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 10px 24px rgba(0, 0, 0, 0.12);
    transition:
      transform 0.22s ease,
      background 0.22s ease,
      border-color 0.22s ease,
      color 0.22s ease,
      box-shadow 0.22s ease;
  }

  .social-link svg {
    width: 24px;
    height: 24px;
    display: block;
  }

  .social-link svg path {
    fill: currentColor;
  }

  .instagram svg rect,
  .instagram svg circle {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
  }

  .social-link:hover {
    transform: translateY(-3px);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .facebook:hover {
    background: #1877f2;
    box-shadow: 0 14px 28px rgba(24, 119, 242, 0.28);
  }

  .instagram:hover {
    background:
      radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 14%, transparent 26%),
      linear-gradient(135deg, #405de6, #833ab4, #c13584, #e1306c, #fd1d1d, #f77737);
    box-shadow: 0 14px 28px rgba(225, 48, 108, 0.28);
  }

  .whatsapp:hover {
    background: #25d366;
    box-shadow: 0 14px 28px rgba(37, 211, 102, 0.28);
  }

  .phone:hover {
    background: linear-gradient(135deg, var(--sgpa-yellow), var(--sgpa-orange));
    color: var(--sgpa-blue-dark);
    box-shadow: 0 14px 28px rgba(242, 183, 5, 0.28);
  }

  @media (max-width: 1080px) {
    .footer-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 640px) {
    .site-footer {
      padding: 44px 18px 28px;
    }

    .footer-grid {
      grid-template-columns: 1fr;
    }

    .footer-social {
      justify-content: flex-start;
    }
  }
</style>