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
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
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

        <input id="undo" name="undo-redo" type="radio" value="#" />
        <label htmlFor="undo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="25"
            viewBox="0 0 26 25"
            fill="none"
          >
            <path
              opacity="0.3"
              d="M0.692112 9.55942C0.441061 9.27816 0.300049 8.8969 0.300049 8.49938C0.300049 8.10187 0.441061 7.72061 0.692112 7.43934L6.94824 0.439083C7.07265 0.299876 7.22034 0.189452 7.38289 0.114114C7.54544 0.0387758 7.71965 1.46678e-09 7.8956 0C8.07154 -1.46678e-09 8.24575 0.0387758 8.4083 0.114114C8.57085 0.189452 8.71854 0.299876 8.84295 0.439083C8.96736 0.578289 9.06605 0.743551 9.13338 0.925433C9.2007 1.10732 9.23536 1.30225 9.23536 1.49912C9.23536 1.69599 9.2007 1.89093 9.13338 2.07281C9.06605 2.25469 8.96736 2.41996 8.84295 2.55916L4.87657 6.99933H17.7249C17.8297 6.99933 17.9316 7.012 18.0305 7.03733C20.0853 7.26009 21.9849 8.35809 23.3363 10.1042C24.6878 11.8503 25.3877 14.1109 25.2913 16.4182C25.1948 18.7256 24.3094 20.9032 22.8182 22.5006C21.327 24.0979 19.3441 24.9928 17.2798 25H14.2339C13.8784 25 13.5374 24.842 13.286 24.5606C13.0346 24.2793 12.8933 23.8978 12.8933 23.4999C12.8933 23.1021 13.0346 22.7206 13.286 22.4392C13.5374 22.1579 13.8784 21.9999 14.2339 21.9999H17.2798C17.984 21.9999 18.6813 21.8447 19.3319 21.5431C19.9825 21.2416 20.5736 20.7996 21.0716 20.2425C21.5695 19.6853 21.9645 19.0238 22.234 18.2958C22.5035 17.5679 22.6422 16.7876 22.6422 15.9997C22.6422 15.2117 22.5035 14.4315 22.234 13.7035C21.9645 12.9755 21.5695 12.314 21.0716 11.7569C20.5736 11.1997 19.9825 10.7577 19.3319 10.4562C18.6813 10.1546 17.984 9.99944 17.2798 9.99944H4.87657L8.84295 14.4396C8.96736 14.5788 9.06605 14.7441 9.13338 14.926C9.2007 15.1078 9.23536 15.3028 9.23536 15.4996C9.23536 15.6965 9.2007 15.8915 9.13338 16.0733C9.06605 16.2552 8.96736 16.4205 8.84295 16.5597C8.71854 16.6989 8.57085 16.8093 8.4083 16.8847C8.24575 16.96 8.07154 16.9988 7.8956 16.9988C7.71965 16.9988 7.54544 16.96 7.38289 16.8847C7.22034 16.8093 7.07265 16.6989 6.94824 16.5597L0.692112 9.55942Z"
              fill="black"
            />
          </svg>
        </label>

        <input id="redo" name="undo-redo" type="radio" value="#" />
        <label htmlFor="redo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="25"
            viewBox="0 0 26 25"
            fill="none"
          >
            <path
              d="M25.1079 9.55942C25.359 9.27816 25.5 8.8969 25.5 8.49938C25.5 8.10187 25.359 7.72061 25.1079 7.43934L18.8518 0.439083C18.7274 0.299876 18.5797 0.189452 18.4172 0.114114C18.2546 0.0387758 18.0804 1.46678e-09 17.9045 0C17.7285 -1.46678e-09 17.5543 0.0387758 17.3917 0.114114C17.2292 0.189452 17.0815 0.299876 16.9571 0.439083C16.8327 0.578289 16.734 0.743551 16.6667 0.925433C16.5993 1.10732 16.5647 1.30225 16.5647 1.49912C16.5647 1.69599 16.5993 1.89093 16.6667 2.07281C16.734 2.25469 16.8327 2.41996 16.9571 2.55916L20.9235 6.99933H8.07519C7.97032 6.99933 7.86843 7.012 7.76953 7.03733C5.71479 7.26009 3.8152 8.35809 2.46373 10.1042C1.11227 11.8503 0.412355 14.1109 0.508791 16.4182C0.605227 18.7256 1.49063 20.9032 2.98183 22.5006C4.47303 24.0979 6.45592 24.9928 8.52026 25H11.5661C11.9217 25 12.2626 24.842 12.5141 24.5606C12.7655 24.2793 12.9067 23.8978 12.9067 23.4999C12.9067 23.1021 12.7655 22.7206 12.5141 22.4392C12.2626 22.1579 11.9217 21.9999 11.5661 21.9999H8.52026C7.81606 21.9999 7.11876 21.8447 6.46816 21.5431C5.81757 21.2416 5.22642 20.7996 4.72848 20.2425C4.23053 19.6853 3.83554 19.0238 3.56606 18.2958C3.29657 17.5679 3.15787 16.7876 3.15787 15.9997C3.15787 15.2117 3.29657 14.4315 3.56606 13.7035C3.83554 12.9755 4.23053 12.314 4.72848 11.7569C5.22642 11.1997 5.81757 10.7577 6.46816 10.4562C7.11876 10.1546 7.81606 9.99944 8.52026 9.99944H20.9235L16.9571 14.4396C16.8327 14.5788 16.734 14.7441 16.6667 14.926C16.5993 15.1078 16.5647 15.3028 16.5647 15.4996C16.5647 15.6965 16.5993 15.8915 16.6667 16.0733C16.734 16.2552 16.8327 16.4205 16.9571 16.5597C17.0815 16.6989 17.2292 16.8093 17.3917 16.8847C17.5543 16.96 17.7285 16.9988 17.9045 16.9988C18.0804 16.9988 18.2546 16.96 18.4172 16.8847C18.5797 16.8093 18.7274 16.6989 18.8518 16.5597L25.1079 9.55942Z"
              fill="black"
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
          id="lineColorBlue"
          name="lineColor"
          type="radio"
          value="#0D00FF"
        />
        <label htmlFor="lineColorBlue">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#0D00FF" />
          </svg>
        </label>

        <input
          id="lineColorRed"
          name="lineColor"
          type="radio"
          value="#FF0000"
        />
        <label htmlFor="lineColorRed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#FF0000" />
          </svg>
        </label>

        <input
          id="lineColorYellow"
          name="lineColor"
          type="radio"
          value="#F2FF00"
        />
        <label htmlFor="lineColorYellow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#F2FF00" />
          </svg>
        </label>

        <input
          id="lineColorGreen"
          name="lineColor"
          type="radio"
          value="#51CF28"
        />
        <label htmlFor="lineColorGreen">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle cx="10" cy="10" r="10" fill="#51CF28" />
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
