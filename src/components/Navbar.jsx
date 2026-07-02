import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/LogoText.svg'; // Import the logo image
import AllTest from "./AllTest";

const Navbar = () => {
  return (
    <nav className="bg-white p-4 relative top-0 w-full shadow-md min-h-[70px]">
      <div className="container mx-auto flex justify-between items-center fixed ">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="MindMeld Logo" className="h-10 mr-2" /> 
        </Link>
        <div>
        <Link to="/leaderboard" className="text-black mr-4">
            LeaderBoard
          </Link>
          <Link to="/all" className="text-black mr-4">
            All Tests
          </Link>
          <Link to="/login" className="text-black mr-4">
            Login
          </Link>
          <Link to="/register" className="text-black mr-4">
            Register
          </Link>
          <Link to="/dashboard" className="text-black mr-4">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
