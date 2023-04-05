export const API_KEY = `n3xCRxOgEhZsOcrBGYsepjSFP1DXec1qlvjsoSdW9nk7KdyxHlXyc7OUIC4rGKPA`;
export const URL =
  "https://eu-central-1.aws.data.mongodb-api.com/app/data-jhpfj/endpoint/data/v1";
export const API_ENDPOINTS = {
  insertOne: "/action/insertOne",
};
export const API_CONFIG = {
  dataSource: "DrawingDApp",
  database: "drawing",
  collection: "images",
};

export const API_HEADERS = {
  "Content-Type": "application/json",
  "api-key": API_KEY,
  "Access-Control-Request-Headers": "*",
};