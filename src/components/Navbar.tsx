import "./style/Navbar.css";
export default function Navbar() {
  return (
    <>
      <header className="navbarParent">
        <>
          <a href="/">
            <button>Home</button>
          </a>
          <a href="/availableDate">
            <button>Add Date</button>
          </a>
          <a href="/book">
            <button>Book a Meeting</button>
          </a>
        </>
      </header>
    </>
  );
}
