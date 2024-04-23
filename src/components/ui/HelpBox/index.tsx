import React from "react";
import "./helpbox.scss";
const HelpBox = () => {
  return (
    <div className="help_box">
      <div className="content_box flex flex-col gap-3">
        <h3 className="font-bold">Need Help?</h3>
        <a href="#">Submit a request</a>
      </div>
    </div>
  );
};

export default HelpBox;
