import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useContext, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { Shield } from 'lucide-react';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount } = useContext(ShopContext);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-36" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {['HOME', 'COLLECTION', 'ABOUT', 'CONTACT', 'CHAT', 'ADMIN'].map((item) => (
          <NavLink
            key={item}
            to={`/${item.toLowerCase()}`}
            className="flex flex-col items-center gap-1"
          >
            <p>{item}</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          alt="Search"
          className="w-5 cursor-pointer"
        />

        <div className="group relative">
          <Link to="/login">
            <img src={assets.profile_icon} alt="Profile" className="w-5 cursor-pointer" />
          </Link>
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="Cart" className="w-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <img
          src={assets.menu_icon}
          alt="Menu"
          className="w-5 cursor-pointer sm:hidden"
          onClick={() => setVisible(!visible)}
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 z-50 bg-white ease-in duration-300 overflow-hidden ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} alt="Back" className="h-4 rotate-180" />
            <p className="font-semibold">Back</p>
          </div>

          {['HOME', 'COLLECTION', 'ABOUT', 'CONTACT', 'CHAT', 'ADMIN'].map((item) => (
            <NavLink
              key={item}
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to={`/${item.toLowerCase()}`}
            >
              {item}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
