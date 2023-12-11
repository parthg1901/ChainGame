const bytesData = args[0];
const apiResponse = await Functions.makeHttpRequest({
  url: `https://8787-test1883-chaingametest-a5cf7nc0mlr.ws-us106.gitpod.io/0xb1Bce02506dA4010a77E788C21655A5B36AE8A41/${bytesData}.json`,
});
if (apiResponse.error) {
  throw Error("Request failed");
}
// data fetched from cloudflare worker in form of bytes
const { data } = apiResponse;
return Functions.encodeString(data);