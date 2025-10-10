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

import WhatsAppButton from './components/WhatsappButton';
// import localFont from 'next/font/local';


import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});



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
      <main className={`${showLayout ? 'lining-nums relative top-209px' : ''
        } min-h-screen w-[90vw] max-w-[90vw] mx-auto overflow-x-hidden `}
        style={{top: '213px'}}>
        {children}
      </main>
      <WhatsAppButton />
      <Toaster position="bottom-right" />
      {showLayout && <Footer />}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className={`${playfair.className} antialiased bg-gray-100`}>
        <Provider store={store}>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
