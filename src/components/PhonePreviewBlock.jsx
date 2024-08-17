import React from "react";

export default function (props) {
  return (
    <div className={`block ${props.platform}`}>
      <img src={`./svg/${props.platform}-white-logo.svg`} alt="logo" />
      <p>{props.title}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M0.666626 5.3333V6.66664H8.66663L4.99996 10.3333L5.94663 11.28L11.2266 5.99997L5.94663 0.719971L4.99996 1.66664L8.66663 5.3333H0.666626Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
