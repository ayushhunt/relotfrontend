'use client';

import './globals.css';
import Navbar from '../app/components/Navbar/Navbar';
import Footer from './components/footer/Footer';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Raleway } from 'next/font/google';
// import localFont from 'next/font/local';

// Configure Raleway font from Google Fonts
const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

// Commented out custom local font
// const customFont = localFont({
//   src: '../app/font/fonnts.com-244192/fonts/fonnts.com-Newbery_Sans_Pro_Light.otf',
//   display: 'swap',
//   variable: '--font-custom' // This creates a CSS variable
// });

function LayoutContent({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const noLayoutRoutes = ['/login', '/register', '/signup', '/admin'];
  const showLayout = !noLayoutRoutes.includes(pathname) && !isAdminRoute;

  return (
    <>
      {showLayout && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}
      <main className={`${
  showLayout ? 'pt-[144px] md:pt-[160px]' : ''
} min-h-screen w-full overflow-x-hidden`}>
        {children}
      </main>
      <Toaster position="bottom-right" />
      {showLayout && <Footer />}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={raleway.variable}>
      <body className={`${raleway.className} antialiased`}>
        <Provider store={store}>
            <AuthProvider>
              <LayoutContent>{children}</LayoutContent>
            </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
