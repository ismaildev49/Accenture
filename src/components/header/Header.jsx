const Header = () => {
  return (
    <>
      <div className="header">
        <div className="container">
          <div className="header__left">
            <a href="/" className="logo"><img src="/assets/logo.png" alt="logo" /></a>
          </div>
          <div className="header__right">
            <div className="header__right__item">
              <a className="btn"href="/login">LOGIN</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
