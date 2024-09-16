/**
 * Sends request to Rollups Inspect service
 * @param queryStr
 * @return notices OutputPayload[]
 */
const inspectCall = async (queryStr: string) => {
  const url = `${network?.inspect}/${queryStr}`;
  console.log(`Network inspect url: ${url}`);
  const response = await fetch(url);
  if (response.status == 200) {
    const result = await response.json();
    for (const i in result.reports) {
      let output = result.reports[i].payload;
      try {
        output = ethers.utils.toUtf8String(output);
        return JSON.parse(output);
      } catch (e) {
        // cannot decode hex payload as a UTF-8 string
        console.log(e);
      }
    }
  } else {
    const errMessage = JSON.stringify(await response.text());
    console.log(errMessage);
    dispatch(onGameError({ error: errMessage }));
  }
};
