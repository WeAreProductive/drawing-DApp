import { API_KEY, URL } from "../config";
export const get = async () => {
  const r = await fetch("https://httpbin.org/get");
  console.log(r);
};

export const storeSvg = async (svgName, svgContent) => {
  try {
    const data = JSON.stringify({
      dataSource: "DrawingDApp",
      database: "drawing",
      collection: "images",
      document: {
        name: svgName,
        content: svgContent,
      },
    });
    const r = await fetch(`${URL}/action/insertOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
        "Access-Control-Request-Headers": "*",
      },
      body: data,
    });
    const json = await r.json();
    console.log(json);
  } catch (e) {
    console.log(e);
  }
};
