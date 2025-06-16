const isLocalhost = window.location.hostname === "localhost";

const BASE = isLocalhost
  ? "http://localhost:7777"
  : "https://lnmcms-backend.onrender.com";

export const BASE_URL = BASE;
export const ADMIN_BASE_URL = `${BASE}/admin`;
export const SUPERADMIN_BASE_URL = `${BASE}/superadmin`;
export const STUDENT_BASE_URL = `${BASE}/student`;

export const Department_List = [
  "BH1",
  "BH2",
  "BH3",
  "BH4",
  "BH5",
  "GH",
  "MESS-A",
  "MESS-B",
  "MESS-C",
  "ELECTRICITY",
  "WATER",
  "INFRASTRUCTURE",
  "FURNITURE",
  "AC",
  "AC-DUCT",
  "PLUMBING",
  "FOOD",
  "COMMON",
];

export const Department_Wise_List = [
  "ELECTRICITY",
  "WATER",
  "INFRASTRUCTURE",
  "FURNITURE",
  "AC",
  "AC-DUCT",
  "PLUMBING",
  "FOOD",
  "COMMON",
];

export const Location_Wise_List = [
  "BH1",
  "BH2",
  "BH3",
  "BH4",
  "BH5",
  "GH",
  "MESS-A",
  "MESS-B",
  "MESS-C",
];
