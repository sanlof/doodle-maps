import React, { useState } from "react";
import "./Toolbar.css";

export default function Toolbar({
  lineWidthRef,
  ctxRef,
  canvasRef,
  lineColorRef,
}) {
  const [activeTool, setActiveTool] = useState("brush");

  const onToolbarChange = (e) => {
    if (!e.target) return;

    const ctx = ctxRef.current;

    if (e.target.name === "lineColor") {
      ctx.globalCompositeOperation = "source-over";
      lineColorRef.current = e.target.value;
      setActiveTool("brush");
    }

    if (e.target.id === "rubber") {
      ctx.globalCompositeOperation = "destination-out";
      setActiveTool("rubber");
    }

    if (e.target.name === "lineWidth") {
      lineWidthRef.current = Number(e.target.value);
    }
  };

  const onToolbarClick = (e) => {
    if (e.target.id === "clear") {
      if (window.confirm("Do you really want to clear the canvas?")) {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  return (
    <form
      onClick={onToolbarClick}
      onChange={onToolbarChange}
      className="toolbar"
    >
      <fieldset className="line-width">
        <legend>Line Width</legend>
        <input
          id="lineWidthThin"
          name="lineWidth"
          type="radio"
          value="2"
          defaultChecked
        />
        <label htmlFor="lineWidthThin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="27"
            viewBox="0 0 28 27"
            fill="none"
          >
            <path
              d="M21.7097 1C21.7097 1 3.91721 4.125 1.63611 8.42188C-0.644976 12.7188 26.5 8.22656 26.5 12.9141C26.5 17.6016 6.1983 18.5781 3.91721 20.7266C1.63611 22.875 18.2881 26 18.2881 26"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </label>
        <input id="lineWidthMedium" name="lineWidth" type="radio" value="5" />
        <label htmlFor="lineWidthMedium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
          >
            <path
              d="M21.9097 2C21.9097 2 4.11716 5.125 1.83607 9.42188C-0.445024 13.7188 26.7 9.22656 26.7 13.9141C26.7 18.6016 6.39825 19.5781 4.11716 21.7266C1.83607 23.875 18.488 27 18.488 27"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </label>
        <input id="lineWidthFat" name="lineWidth" type="radio" value="8" />
        <label htmlFor="lineWidthFat">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="29"
            viewBox="0 0 30 29"
            fill="none"
          >
            <path
              d="M23.1097 2C23.1097 2 5.31723 5.125 3.03614 9.42188C0.755049 13.7188 27.9 9.22656 27.9 13.9141C27.9 18.6016 7.59832 19.5781 5.31723 21.7266C3.03614 23.875 19.6881 27 19.6881 27"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </label>
      </fieldset>

      <fieldset className="tools">
        <legend>Tools</legend>
        <input id="rubber" name="lineColor" type="radio" value="rubber" />
        <label htmlFor="rubber">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="25"
            viewBox="0 0 26 25"
            fill="none"
          >
            <path
              d="M18.0221 0.781082L24.352 7.37689C25.3495 8.43169 25.3495 10.114 24.352 11.1688L12.6001 23.4392C11.639 24.4388 10.3377 25 8.98117 25C7.62462 25 6.32333 24.4388 5.36225 23.4392L0.848179 18.726C-0.149263 17.6712 -0.149263 15.9888 0.848179 14.934L14.4032 0.781082C15.4134 -0.260361 17.0246 -0.260361 18.0221 0.781082ZM2.65125 16.83L7.1781 21.5432C8.17555 22.598 9.7868 22.598 10.797 21.5432L15.3111 16.83L8.98117 10.2208L2.65125 16.83Z"
              fill="black"
            />
          </svg>
        </label>

        <input id="undo" name="undo-redo" type="hidden" value="#" />
        <label htmlFor="undo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              opacity="0.3"
              d="M0.392063 9.55942C0.141012 9.27816 0 8.8969 0 8.49938C0 8.10187 0.141012 7.72061 0.392063 7.43934L6.64819 0.439083C6.7726 0.299876 6.92029 0.189452 7.08284 0.114114C7.24539 0.0387758 7.41961 1.46678e-09 7.59555 0C7.77149 -1.46678e-09 7.9457 0.0387758 8.10825 0.114114C8.2708 0.189452 8.41849 0.299876 8.5429 0.439083C8.66731 0.578289 8.766 0.743551 8.83333 0.925433C8.90066 1.10732 8.93531 1.30225 8.93531 1.49912C8.93531 1.69599 8.90066 1.89093 8.83333 2.07281C8.766 2.25469 8.66731 2.41996 8.5429 2.55916L4.57652 6.99933H17.4248C17.5297 6.99933 17.6316 7.012 17.7305 7.03733C19.7852 7.26009 21.6848 8.35809 23.0363 10.1042C24.3877 11.8503 25.0876 14.1109 24.9912 16.4182C24.8948 18.7256 24.0094 20.9032 22.5182 22.5006C21.027 24.0979 19.0441 24.9928 16.9797 25H13.9339C13.5783 25 13.2374 24.842 12.9859 24.5606C12.7345 24.2793 12.5933 23.8978 12.5933 23.4999C12.5933 23.1021 12.7345 22.7206 12.9859 22.4392C13.2374 22.1579 13.5783 21.9999 13.9339 21.9999H16.9797C17.6839 21.9999 18.3812 21.8447 19.0318 21.5431C19.6824 21.2416 20.2736 20.7996 20.7715 20.2425C21.2695 19.6853 21.6645 19.0238 21.9339 18.2958C22.2034 17.5679 22.3421 16.7876 22.3421 15.9997C22.3421 15.2117 22.2034 14.4315 21.9339 13.7035C21.6645 12.9755 21.2695 12.314 20.7715 11.7569C20.2736 11.1997 19.6824 10.7577 19.0318 10.4562C18.3812 10.1546 17.6839 9.99944 16.9797 9.99944H4.57652L8.5429 14.4396C8.66731 14.5788 8.766 14.7441 8.83333 14.926C8.90066 15.1078 8.93531 15.3028 8.93531 15.4996C8.93531 15.6965 8.90066 15.8915 8.83333 16.0733C8.766 16.2552 8.66731 16.4205 8.5429 16.5597C8.41849 16.6989 8.2708 16.8093 8.10825 16.8847C7.9457 16.96 7.77149 16.9988 7.59555 16.9988C7.41961 16.9988 7.24539 16.96 7.08284 16.8847C6.92029 16.8093 6.7726 16.6989 6.64819 16.5597L0.392063 9.55942Z"
              fill="black"
            />
          </svg>
        </label>

        <input id="redo" name="undo-redo" type="hidden" value="#" />
        <label htmlFor="redo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M24.6079 9.55942C24.859 9.27816 25 8.8969 25 8.49938C25 8.10187 24.859 7.72061 24.6079 7.43934L18.3518 0.439083C18.2274 0.299876 18.0797 0.189452 17.9172 0.114114C17.7546 0.0387758 17.5804 1.46678e-09 17.4045 0C17.2285 -1.46678e-09 17.0543 0.0387758 16.8917 0.114114C16.7292 0.189452 16.5815 0.299876 16.4571 0.439083C16.3327 0.578289 16.234 0.743551 16.1667 0.925433C16.0993 1.10732 16.0647 1.30225 16.0647 1.49912C16.0647 1.69599 16.0993 1.89093 16.1667 2.07281C16.234 2.25469 16.3327 2.41996 16.4571 2.55916L20.4235 6.99933H7.57519C7.47032 6.99933 7.36843 7.012 7.26953 7.03733C5.21479 7.26009 3.3152 8.35809 1.96373 10.1042C0.61227 11.8503 -0.0876442 14.1109 0.00879097 16.4182C0.105226 18.7256 0.99063 20.9032 2.48183 22.5006C3.97303 24.0979 5.95592 24.9928 8.02026 25H11.0661C11.4217 25 11.7626 24.842 12.0141 24.5606C12.2655 24.2793 12.4067 23.8978 12.4067 23.4999C12.4067 23.1021 12.2655 22.7206 12.0141 22.4392C11.7626 22.1579 11.4217 21.9999 11.0661 21.9999H8.02026C7.31606 21.9999 6.61876 21.8447 5.96816 21.5431C5.31757 21.2416 4.72642 20.7996 4.22848 20.2425C3.73053 19.6853 3.33554 19.0238 3.06606 18.2958C2.79657 17.5679 2.65787 16.7876 2.65787 15.9997C2.65787 15.2117 2.79657 14.4315 3.06606 13.7035C3.33554 12.9755 3.73053 12.314 4.22848 11.7569C4.72642 11.1997 5.31757 10.7577 5.96816 10.4562C6.61876 10.1546 7.31606 9.99944 8.02026 9.99944H20.4235L16.4571 14.4396C16.3327 14.5788 16.234 14.7441 16.1667 14.926C16.0993 15.1078 16.0647 15.3028 16.0647 15.4996C16.0647 15.6965 16.0993 15.8915 16.1667 16.0733C16.234 16.2552 16.3327 16.4205 16.4571 16.5597C16.5815 16.6989 16.7292 16.8093 16.8917 16.8847C17.0543 16.96 17.2285 16.9988 17.4045 16.9988C17.5804 16.9988 17.7546 16.96 17.9172 16.8847C18.0797 16.8093 18.2274 16.6989 18.3518 16.5597L24.6079 9.55942Z"
              fill="#B2B2B2"
            />
          </svg>
        </label>
      </fieldset>

      <fieldset className="colors">
        <legend>Colors</legend>

        <input
          id="lineColorBlack"
          name="lineColor"
          type="radio"
          value="#000000"
          defaultChecked
        />
        <label htmlFor="lineColorBlack">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#000000" />
          </svg>
        </label>

        <input
          id="lineColorWhite"
          name="lineColor"
          type="radio"
          value="#ffffff"
        />
        <label htmlFor="lineColorWhite">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#ffffff" />
          </svg>
        </label>

        <input
          id="lineColorRed"
          name="lineColor"
          type="radio"
          value="#EA4335"
        />
        <label htmlFor="lineColorRed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#EA4335" />
          </svg>
        </label>

        <input
          id="lineColorYellow"
          name="lineColor"
          type="radio"
          value="#FBBC05"
        />
        <label htmlFor="lineColorYellow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#FBBC05" />
          </svg>
        </label>

        <input
          id="lineColorGreen"
          name="lineColor"
          type="radio"
          value="#35A402"
        />
        <label htmlFor="lineColorGreen">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#35A402" />
          </svg>
        </label>
        <input
          id="lineColorBlue"
          name="lineColor"
          type="radio"
          value="#4285F4"
        />
        <label htmlFor="lineColorBlue">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#4285F4" />
          </svg>
        </label>

        <input
          id="lineColorPicker"
          name="lineColor"
          type="color"
          defaultValue={lineColorRef.current}
        />
        <label htmlFor="lineColorPicker">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="transparent" />
          </svg>
        </label>
      </fieldset>

      <button id="clear" type="button">
        Clear canvas
      </button>
    </form>
  );
}
