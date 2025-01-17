import React from "react";

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1>AI Text Summarizer</h1>
    </header>
  );
};

const headerStyle = {
  background: "#282c34",
  color: "white",
  padding: "10px 0",
  textAlign: "center",
};

export default Header;
