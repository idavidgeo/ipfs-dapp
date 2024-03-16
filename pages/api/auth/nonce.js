import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // TODO: santize, very format and lengh of address
  if (req.query.address.length !== 42) {
    return res.status(400).json({ error: "Not a valid EOA address" });
  }

  if (req.method == "GET") {
    const user = await prisma.user.findUnique({ where: { address: req.query.address.toLowerCase() } });
    if (user?.nonce) {
      return res.status(200).json({ nonce: user.nonce, newUser: !user.verified });
    } else {
      console.log("Generating new user nonce");
      const newNonce = uuidv4();
      await prisma.user
        .create({
          data: {
            address: req.query.address.toLowerCase(),
            nonce: newNonce,
            verified: false,
          },
        })
        .then(() => {
          return res.status(200).json({ nonce: newNonce, newUser: true });
        })
        .catch((e) => {
          console.log("Error saving new user: ", e);
          return res.status(500).json({ error: "error saving new user" });
        });
    }
  }

  res.status(405);
}
