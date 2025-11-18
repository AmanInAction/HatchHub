import NavbarComponent from "@/components/Navbar";
import React from "react";
function UserLayout({ children }) {
  return (
    <>
      <NavbarComponent></NavbarComponent>
      <div>{children}</div>
    </>
  );
}

export default UserLayout;
