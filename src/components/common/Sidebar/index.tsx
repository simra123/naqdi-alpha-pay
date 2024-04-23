import React from "react";
import "./sidebar.scss";
import Link from "next/link";
import {
  Home,
  Paid,
  Payments,
  People,
  Receipt,
  Settings,
  ShoppingBasket,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";

const nav_items = [
  { name: "Dashboard", icon: <Home />, path: "/" },
  { name: "Payments", icon: <Payments />, path: "/payments" },
  { name: "Transactions", icon: <Receipt />, path: "/transactions" },
  { name: "Withdrawals", icon: <Paid />, path: "/withdrawals" },
  { name: "Payouts", icon: <ShoppingBasket />, path: "/payouts" },
  { name: "Profiles", icon: <People />, path: "/profiles" },
  { name: "Settings", icon: <Settings />, path: "/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="px-6 py-4 SidebarWrapper h-full">
      <div className="flex flex-col gap-4">
        {nav_items.map(({ icon, name, path }) => (
          <div
            className={`flex gap-2 navLink items-center ${
              pathname == path && "active"
            }`}
          >
            <div>{icon}</div>
            <Link href={path}>{name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
