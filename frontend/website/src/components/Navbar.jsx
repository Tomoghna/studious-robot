import React, { useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import {link} from "react-router-dom";

const routes = [
  { name: "Home", href: "#", isActive: true },
  { name: "Products", href: "#", isActive: false },
  { name: "About", href: "/about", isActive: false },
  { name: "Contact", href: "#", isActive: false },
  { name: "Features", href: "#", isActive: false },
  { name: "Testimonials", href: "#", isActive: false },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <div className="ezy_nav2 light py-6 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative">
        <nav className="container px-4 flex justify-between items-center">
          <a className="font-black text-3xl" href="#!">
            {" "}MAYUR HAMSA{" "}
          </a>
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-md">
            <select className="bg-transparent text-gray-600 text-sm focus:outline-none" defaultValue="All Categories">
              <option value="All Categories">All Categories</option>
              <option value="Paintings">Paintings</option>
              <option value="Inscense Boxes">Inscense Boxes</option>
              <option value="Inscense Holders">Inscense Holders</option>
              <option value="Pots">Pots</option>
              <option value="Wall Alters">Wall Alters</option>
            </select>
            <input type="text" placeholder="Search Products..." className="bg-transparent text-sm text-gray-600 focus:outline-none px-4 w-64" />
            <button className="text-black bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-600 flex items-center justify-center"><FaSearch /></button>
          </div>
          <div className="flex items-center gap-4">
            <a href="/cart" className="text-black dark:text-white hover:text-gray-600"><FaShoppingCart size={24} /></a>
            <button className="block lg:hidden cursor-pointer h-10 z-20" type="button" onClick={toggleMenu}>
              <div className="h-0.5 w-7 bg-black dark:bg-white mb-1" />
              <div className="h-0.5 w-7 bg-black dark:bg-white mb-1" />
              <div className="h-0.5 w-7 bg-black dark:bg-white" />
            </button>
          </div>
          <ul className="hidden lg:flex flex-row justify-center items-center text-base gap-6">
            {routes.map((route, i) => (
              <li key={i}>
                <a className={`px-4 ${route.isActive ? "opacity-100" : "opacity-50 hover:opacity-100"}`} href={route.href}>{route.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={closeMenu}>
          <div className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-[#0b1727] shadow-lg z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-2xl font-bold" onClick={closeMenu}>&times;</button>
            <ul className="flex flex-col mt-16 space-y-4 px-6">
              {routes.map((route, i) => (
                <li key={i}>
                  <a className="block text-lg text-zinc-900 dark:text-white hover:opacity-75" href={route.href} onClick={closeMenu}>{route.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}