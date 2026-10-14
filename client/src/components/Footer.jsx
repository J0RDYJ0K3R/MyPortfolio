function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {currentYear} Benjamin Shlamovsky-Koroz. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;