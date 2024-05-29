// Navigation.js

// Navigation.js

import Link from "next/link";

const Navbar = ({ children }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-between">
        <li className="mr-6">
          <Link
            className="text-white hover:text-black hover:bg-white p-3 rounded-lg"
            href="/"
          >
            Home
          </Link>
        </li>
        <li className="mr-6">
          <Link
            className="text-white hover:text-black hover:bg-white p-3 rounded-lg"
            href="/usuarios"
          >
            Usuarios
          </Link>
        </li>
        <li className="mr-6">
          <Link
            className="text-white hover:text-black hover:bg-white p-3 rounded-lg"
            href="/tiqueteras"
          >
            Tiqueteras
          </Link>
        </li>
        <li>
          <Link
            className="text-white hover:text-black hover:bg-white p-3 rounded-lg"
            href="/planes"
          >
            Planes
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
