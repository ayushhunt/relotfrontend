"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from 'next/navigation';
import { Provider, useDispatch } from 'react-redux';
import store from "./redux/store";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import { fetchUserCart } from "./redux/actions/cartActions"; // Make sure this path is correct

function LayoutContent({ children }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/login', '/register', '/signup', '/checkout'];
  const showLayout = !noLayoutRoutes.includes(pathname);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  return (
    <>
      {showLayout && <Navbar />}
      <main>{children}</main>
      <Toaster position="bottom-right" />
      {showLayout && <Footer />}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Provider store={store}>
          <LayoutContent children={children} />
        </Provider>
      </body>
    </html>
  );
}
