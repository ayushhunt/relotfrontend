"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../redux/reducer/authSlice';

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('accessToken');

   
      router.push('/');
    
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex justify-center items-center h-screen text-xl font-semibold">
      Redirecting after Google Sign-In...
    </div>
  );
};

export default GoogleCallbackPage;
