import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { cookies } = req;
  const token = cookies.authCookie;

  if (!token) {
    return res.status(401).json({ message: "not authorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return res.status(401).json({ message: "not authorized" });
  }

  const address = jwt.decode(token)?.address.toLowerCase();

  try {
    // Pull all files from user
    const userWithIpfsFiles = await prisma.user.findUnique({
      where: {
        address: address,
      },
      include: {
        ipfsFiles: true,
      },
    });

    // console.log("userWithIpfsFiles: ", userWithIpfsFiles.ipfsFiles);
    return res.status(200).json({ files: userWithIpfsFiles.ipfsFiles });
  } catch (e) {
    // console.log("Failed retrieving file: ", e);
    return res.status(500).json({ error: "error" });
  }
}
