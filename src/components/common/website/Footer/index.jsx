import React from "react";
import Link from "next/link";
import { FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import "./footer.scss";
import { Button } from "@mui/material";

const Footer = () => {
  return (
    <footer className="footer_main_wrapper">
      <div className="content_wrapper">
        <div className="flex footer_items_wrapper">
          <div className="footer-logo footer_item">
            <span>Alphas</span>
          </div>
          <div className="footer_item">
            <Link href="#">Our Company</Link>
            <Link href="#">Alphay Newsroom</Link>
            <Link href="#">Research</Link>
            <Link href="#">Security</Link>
            <Link href="#">Careers</Link>
          </div>
          <div className="footer_item">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">User Agreement</Link>
            <Link href="#">Custody Agreement</Link>
            <Link href="#">Terms and Conditions</Link>
            <Link href="#">Virtual Asset Standards</Link>
          </div>
          <div className="footer_item">
            <h5 className="footer-item-header">Our Services</h5>
            <Link href="#">Trading</Link>
            <Link href="#">Custody</Link>
            <Link href="#">Asset Management</Link>
            <Link href="#">Alphaspay</Link>
          </div>
          <div className="footer_item">
            <div className="social_container">
              <Link href="#" target="_blank">
                <FaTwitter />
              </Link>
              <Link href="#" target="_blank">
                <FaLinkedin />
              </Link>
              <Link href="#" target="_blank">
                <FaInstagram />
              </Link>
              <Link href="#" target="_blank">
                <FaYoutube />
              </Link>
            </div>
            <Link href="#">info@alphaspay.com</Link>
            <Button className="btn-secondary footer_btn" color="inherit">
              Contact Us
            </Button>
            <span className="footer-item-caption">Copyright 2024.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
