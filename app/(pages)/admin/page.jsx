// components/layouts/AdminLayout.tsx
'use client'
import AdminSideBar from "../../components/AdminSideBar/AdminSideBar";
import { useSelector } from "react-redux";

export default function AdminLayout({ children }) {
  const isNavExpanded = useSelector((state) => state.sideNav.navOpen);

  return (
    <div className="flex w-full">
      <div
        className={`transition-all duration-300 ${
          isNavExpanded ? "w-32" : "w-4"
        }`}
      >
        <AdminSideBar />
      </div>
      <div className="flex-1 overflow-auto  p-4">{children}</div>
    </div>
  );
}
