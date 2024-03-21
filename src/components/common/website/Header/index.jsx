"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./header.scss";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="main_header">
      <nav className="main_header__navbar">
        <div className="main_header__logo__wrapper">
          <div className="logo">Alphas</div>
        </div>
        <div className="main_header__navbar__items">
          <div className="nav_item">
            <Link href="/" className={pathname == "/" ? "active" : ""}>
              Home
            </Link>
          </div>
          <div className="nav_item">
            <span href="#">
              WhyAlphaspay
              <div className="menu">
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
              </div>
            </span>
          </div>
          <div className="nav_item">
            <span>
              OurServices
              <div className="menu">
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
              </div>
            </span>
          </div>
          <div className="nav_item">
            <span>
              Research
              <div className="menu">
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
                <Link className="menu-item" href="#">
                  Our Company
                </Link>
              </div>
            </span>
          </div>
          <div className="nav_item">
            <Link href="/login" target="_blank">
              Login/Register
            </Link>
          </div>
          <div className="nav-item">
            <Link href="/" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
