import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="nav">
      <button onClick={() => handleScrollToSection("home-s")}>HOME</button>
      <Link to="/how">e</Link>
      <button onClick={() => handleScrollToSection("about-s")}>ABOUT US</button>
    </div>
  );
};

export default Nav;
