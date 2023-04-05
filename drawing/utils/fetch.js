import { URL, API_ENDPOINTS, API_HEADERS, API_CONFIG } from "../config";
export const get = async () => {
  const r = await fetch("https://httpbin.org/get");
  console.log(r);
};

export const storeSvg = async (svgName, svgContent) => {
  try {
    const data = JSON.stringify({
      ...API_CONFIG,
      document: {
        name: svgName,
        content: svgContent,
      },
    });
    const r = await fetch(`${URL}${API_ENDPOINTS.insertOne}`, {
      method: "POST",
      headers: API_HEADERS,
      body: data,
    });
    const json = await r.json();
    //@TODO return smth meaningful ...
    console.log(json);
  } catch (e) {
    console.log(e);
  }
};
