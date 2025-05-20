//authenticate.ts
//TODO: replace with the real authentication
//IMPORTANT: need checks also on backend because it is easy to modify frontend source in browser

const fakeAuth = (): Promise<string> =>
  new Promise((resolve) => {
    console.log("fakeauth")
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
    console.log("fakeauthed")
  });
  export default fakeAuth;