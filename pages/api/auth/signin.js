import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { recoverMessageAddress } from "viem";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { signature } = req.body;
  const address = req.body.address.toLowerCase();

  // TODO: santize, very format and lengh of address
  if (address?.length !== 42 || !signature) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (req.method == "POST") {
    const user = await prisma.user.findUnique({ where: { address: address } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Reconsctruct msg that the user has signed
    const messageToVerify = `Signing in using nonce: ${user.nonce}`;

    const recoveredAddress = await recoverMessageAddress({
      message: messageToVerify,
      signature: signature,
    });

    // Owner does not match
    if (recoveredAddress.toLowerCase() !== address) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update nonce
    const newNonce = uuidv4();

    // Write to db
    await prisma.user
      .update({
        where: {
          address: address,
        },
        data: {
          nonce: newNonce,
          verified: true,
        },
      })
      .catch((e) => {
        console.log("Error updating new user: ", e);
        return res.status(500).json({ error: "error signing in" });
      });

    // JWT for auth - hidden from client
    const serializedAuth = cookie.serialize(
      "authCookie",
      jwt.sign(
        { address: address },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 } // 1h
      ),
      {
        httpOnly: true,
        maxAge: 60 * 60, // 1h
        sameSite: "strict",
        path: "/",
      }
    );

    // JWT for session tracking - visable in client
    const serializedSession = cookie.serialize(
      "sessionCookie",
      jwt.sign(
        { address: address },
        "Not so secret",
        { expiresIn: 60 * 60 } // 1h
      ),
      {
        httpOnly: false,
        maxAge: 60 * 60, // 1h
        sameSite: "strict",
        path: "/",
      }
    );

    // Set cookies
    res.setHeader("Set-Cookie", [serializedAuth, serializedSession]);
    return res.status(200).json({});
  }

  res.status(405);
}
