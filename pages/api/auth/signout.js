import cookie from "cookie";

export default async function handler(req, res) {
  const { cookies } = req;

  const atoken = cookies.authCookie;
  const stoken = cookies.sessionCookie;

  if (!stoken && !atoken) {
    return res.status(200).json({ error: "not signed in" });
  }

  // Nullify and expire both cookies

  // JWT for auth - hidden from client
  const serializedAuth = cookie.serialize("authCookie", null, {
    httpOnly: true,
    maxAge: -1,
    sameSite: "strict",
    path: "/",
  });

  // JWT for session tracking - visable in client
  const serializedSession = cookie.serialize("sessionCookie", null, {
    httpOnly: false,
    maxAge: -1,
    sameSite: "strict",
    path: "/",
  });

  res.setHeader("Set-Cookie", [serializedAuth, serializedSession]);
  return res.status(200).json({ message: "successfully singed out" });
}
