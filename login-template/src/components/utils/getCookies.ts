const getCookies = () => {
  const pairs: string[] = document.cookie.split(";");
  const cookies: any = {};
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    cookies[(pair[0] + "").trim()] = decodeURI(pair.slice(1).join("="));
  }
  return cookies;
};

export default getCookies;
