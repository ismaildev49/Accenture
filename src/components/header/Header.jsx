const Header = () => {
  return (
    <>
      <div className="header">
        <div className="container">
          <div className="header__left">
            <div className="logo_creer">
              <i className="fa-solid fa-location-dot"></i>
              <span className="logo_creer_big_test protest-strike-regular">FMB <span>app</span></span>
              <span className="logo_creer_big_subtest protest-strike-regular">by accenture</span>
            </div>
            {/* <a href="/" className="logo"><img src="/assets/logo.png" alt="logo" /></a> */}
          </div>
          <div className="header__right">
            <div className="header__right__item">
              {/* <a className="btn"href="/login">LOGIN</a> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
