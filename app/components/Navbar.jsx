"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import engFlag from "./images/eng.jpg";
import franceFlag from "./images/france.png";
import germanFlag from "./images/german.avif";
import { Search, Heart, User, ShoppingBag, ChevronDown } from "lucide-react";
import { connect, useSelector } from "react-redux";
import CartDailog from "../components/Cart/CartDailog";
import WishlistDailog from "../components/WishlistDailog";

const Navbar = ({ cartTotalQuantity }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const items = useSelector((state) => state.cart.items);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleWishlist = () => {
    // Implement wishlist functionality
    console.log("Wishlist clicked");
  };
  return (
    <header className="w-full border-b border-gray-200 ">
      {/* Top navbar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="relative h-14 w-32">
            <div className="font-bold text-3xl flex items-center">
              <span>RE</span>
              <span className="bg-red-600 text-white px-2">LOT</span>
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="w-full flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Store"
                className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 rounded-r-full hover:bg-red-700 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* <Link href="/wishlist" className="hidden sm:block">
            <Heart className="h-6 w-6" />
          </Link> */}
          <WishlistDailog />
          <Link href="/login">
            <User className="h-6 w-6" />
          </Link>

          <div className="relative">
            <CartDailog />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="container mx-auto px-4 py-2">
        <ul className="flex items-center space-x-6">
          <li className="relative group">
            <Link
              href="/products/?category=women"
              className="flex items-center py-2 hover:text-red-600"
            >
              Women <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-1 z-10 hidden group-hover:block">
              <Link
                href="/products/?category=women/?search=handbags"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Handbags
              </Link>
              <Link
                href="/products/?category=women/?search=wallets-and-small-leather-goods"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Wallets and Small Leather Goods
              </Link>
              <div className="relative group/submenu">
                <Link
                  href="/products/?category=women/?search=accessories"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Accessories
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </Link>
                <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 hidden group-hover/submenu:block">
                  <Link
                    href="products/?category=women/?search=jewelry"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Jewelry
                  </Link>
                  <Link
                    href="products/?category=women/?search=scarves"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Scarves
                  </Link>
                  <Link
                    href="products/?category=women/?search=belts"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Belts
                  </Link>
                </div>
              </div>
              <div className="relative group/submenu">
                <Link
                  href="products/?category=women/?search=travel"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Travel
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </Link>
                <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 hidden group-hover/submenu:block">
                  <Link
                    href="products/?category=women/?search=luggage"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Luggage
                  </Link>
                  <Link
                    href="products/?category=women/?search=travel-accessories"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Travel Accessories
                  </Link>
                  <Link
                    href="products/?category=women/?search=travel-bags"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Travel Bags
                  </Link>
                </div>
              </div>
            </div>
          </li>
          <li className="relative group">
            <Link
              href="products/?category=men"
              className="flex items-center py-2 hover:text-red-600"
            >
              Men <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-1 z-10 hidden group-hover:block">
              <Link
                href="products/?category=men/?search=bags"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Bags
              </Link>
              <Link
                href="products/?category=men/?search=wallets-and-small-leather-goods"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Wallets and Small Leather Goods
              </Link>
              <div className="relative group/submenu">
                <Link
                  href="products/?category=men/?search=accessories"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Accessories
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </Link>
                <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 hidden group-hover/submenu:block">
                  <Link
                    href="products/?category=men/?search=belts"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Belts
                  </Link>
                  <Link
                    href="products/?category=men/?search=cardholders"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Card Holders
                  </Link>
                  <Link
                    href="products/?category=men/?search=keyholders"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Key Holders
                  </Link>
                </div>
              </div>
              <div className="relative group/submenu">
                <Link
                  href="products/?category=men/?search=travel"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Travel
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </Link>
                <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-md py-1 z-20 hidden group-hover/submenu:block">
                  <Link
                    href="products/?category=men/?search=luggage"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Luggage
                  </Link>
                  <Link
                    href="products/?category=men/?search=travel-accessories"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Travel Accessories
                  </Link>
                  <Link
                    href="products/?category=men/?search=travel-bags"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Travel Bags
                  </Link>
                  <Link
                    href="products/?category=men/?search=shaving-kit-bags"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Shaving Kit Bags
                  </Link>
                </div>
              </div>
            </div>
          </li>
          <li className="relative group">
            <Link
              href="/products/?category=fragrances"
              className="flex items-center py-2 hover:text-red-600"
            >
              FRAGRANCES <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            {/* Dropdown would go here */}
            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-1 z-10 hidden group-hover:block">
              <Link
                href="products/?category=fragrances/?search=perfume"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Perfume
              </Link>
              <Link
                href="products/?category=fragrances/?search=body-mist"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Body Mist
              </Link>
              <Link
                href="products/?category=fragrances/?search=roll-on"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Roll-on
              </Link>
              <Link
                href="products/?category=fragrances/?search=fragrances-of-india"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Fragrances of India
              </Link>
            </div>
          </li>
          <li className="relative group">
            <Link
              href="products/?category=bags"
              className="flex items-center py-2 hover:text-red-600"
            >
              BAGS AND SMALL LEATHER GOODS{" "}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            {/* Dropdown would go here */}
            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-1 z-10 hidden group-hover:block">
              <Link
                href="products/?category=bags/?search=relot-colourmania"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Relot Colourmania
              </Link>
              <Link
                href="products/?category=bags/?search=men-bags"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Men Bags
              </Link>
              <Link
                href="products/?category=bags/?search=women-small-leather-bags"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Women small Leather Goods
              </Link>
              <Link
                href="products/?category=bags/?search=men-small-leather-bags"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Men small Leather Goods
              </Link>
            </div>
          </li>
          <li className="relative group">
            <Link
              href="products/?category=services"
              className="flex items-center py-2 hover:text-red-600"
            >
              SERVICES <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            {/* Dropdown would go here */}
            <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-1 z-10 hidden group-hover:block">
              <Link
                href="products/?category=services/?search=personalisation"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Personalisation
              </Link>
              <Link
                href="products/?category=services/?search=relot-repairs"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Relot Repairs
              </Link>
              <Link
                href="products/?category=services/?search=art-of-gifting"
                className="block px-4 py-3 text-sm hover:bg-gray-100"
              >
                Art og Gifting
              </Link>
            </div>
          </li>

          {/* Language Selector */}
          <li className="relative ml-auto">
            <button
              className="flex items-center space-x-2 py-2"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <span className="flex items-center">
                <Image
                  src={engFlag}
                  alt="UK Flag"
                  width={30}
                  height={20}
                  className="mr-2"
                />
                EN
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10">
                <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                  <Image
                    src={engFlag}
                    alt="UK Flag"
                    width={30}
                    height={20}
                    className="mr-2"
                  />
                  English
                </button>
                <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                  <Image
                    src={franceFlag}
                    alt="France Flag"
                    width={30}
                    height={20}
                    className="mr-2"
                  />
                  Français
                </button>
                <button className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                  <Image
                    src={germanFlag}
                    alt="Germany Flag"
                    width={30}
                    height={20}
                    className="mr-2"
                  />
                  Deutsch
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile Search - Only visible on mobile */}
      <div className="md:hidden container mx-auto px-4 py-2">
        <form onSubmit={handleSearch} className="w-full flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Store"
              className="w-full px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 rounded-r-full hover:bg-red-700 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  );
};
const mapStateToProps = (state) => ({
  cartTotalQuantity: state.cart.totalQuantity,
});

export default Navbar;
