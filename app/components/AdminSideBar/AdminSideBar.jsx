"use client";

import { useState, useEffect } from "react";
import "./style.css";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { LiaUserSolid } from "react-icons/lia";
import { LuMessageSquareText } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";
import { LuFiles } from "react-icons/lu";
import { IoStatsChartOutline } from "react-icons/io5";
import { PiSignOutFill } from "react-icons/pi";
import Products from "./products";
import { useDispatch, useSelector } from "react-redux";
import { setsideNav } from "../../redux/reducer/sideNavSlice";
import Link from "next/link";

export default function AdminSideBar() {
  //const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [activeLink, setActiveLink] = useState("dashboard");
  const isNavExpanded = useSelector((state) => state.sideNav.navOpen);
  const dispatch = useDispatch();

  const toggleNav = () => {
    dispatch(setsideNav(!isNavExpanded));
  };

  return (
    <div>
      <div
        className={`header ${isNavExpanded ? "body-pd-header" : ""}`}
        id="header"
      >
        <div className="header_toggle">
          <button
            className={`bx bx-menu ${isNavExpanded ? "bx-x" : ""}`}
            id="header-toggle"
            onClick={toggleNav}
          >
            ClickMe
          </button>
        </div>
        <div className="header_img">
          <img src="https://i.imgur.com/hczKIze.jpg" alt="" />
        </div>
      </div>
      <div className={`l-navbar ${isNavExpanded ? "show" : ""}`} id="nav-bar">
        <nav className="nav">
          <div>
            <div>
              <Link href="/admin/dashboard" className="nav_logo">
                <MdOutlineSpaceDashboard />
                <span className="nav_logo-name">Relot</span>
              </Link>
            </div>

            <div className="nav_list">
              <Link
                href="/admin/dashboard"
                className={`nav_link ${
                  activeLink === "dashboard" ? "active" : ""
                }`}
                onClick={() => setActiveLink("dashboard")}
              >
                <MdOutlineSpaceDashboard />
                <span className="nav_name">Dashboard</span>
              </Link>

              <Link
                href="#"
                className={`nav_link ${activeLink === "users" ? "active" : ""}`}
                onClick={() => setActiveLink("users")}
              >
                <LiaUserSolid />
                <span className="nav_name">Users</span>
              </Link>

              <Link
                href="#"
                className={`nav_link ${
                  activeLink === "messages" ? "active" : ""
                }`}
                onClick={() => setActiveLink("messages")}
              >
                <LuMessageSquareText />
                <span className="nav_name">Messages</span>
              </Link>

              <Link
                href="#"
                className={`nav_link ${
                  activeLink === "bookmark" ? "active" : ""
                }`}
                onClick={() => setActiveLink("bookmark")}
              >
                <CiBookmark />
                <span className="nav_name">Bookmark</span>
              </Link>

              <Link
                href="#"
                className={`nav_link ${activeLink === "files" ? "active" : ""}`}
                onClick={() => setActiveLink("files")}
              >
                <LuFiles />
                <span className="nav_name">Files</span>
              </Link>

              <Link
                href="#"
                className={`nav_link ${activeLink === "stats" ? "active" : ""}`}
                onClick={() => setActiveLink("stats")}
              >
                <IoStatsChartOutline />
                <span className="nav_name">Stats</span>
              </Link>
            </div>
          </div>

          <Link
            href="#"
            className="nav_link"
            onClick={() => setActiveLink("signout")}
          >
            <PiSignOutFill />
            <span className="nav_name">SignOut</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
