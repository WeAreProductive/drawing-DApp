export const API_ENDPOINTS = {
  getAllSvgs: "/action/find",
};

export const API_CONFIG = {
  dataSource: "DrawingDApp",
  database: "drawing",
  collection: "images",
  filter: {},
};

export const API_HEADERS = {
  "Content-Type": "application/ejson",
  "api-key": process.env.API_KEY,
};
