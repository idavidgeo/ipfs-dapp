import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { cookies, body } = req;
  const token = cookies.authCookie;

  // TODO: sanitize data

  if (!token) {
    return res.status(401).json({ message: "not authorized" });
  }

  if (!body.ipfsHash || !body.fileName) {
    return res.status(401).json({ message: "invalid data" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return res.status(401).json({ message: "not authorized" });
  }

  const address = jwt.decode(token)?.address.toLowerCase();

  try {
    // Add file to prisma
    const saveHash = await prisma.ipfsFile.create({ data: { hash: req.body.ipfsHash, name: req.body.fileName, userAddress: address } });
    // console.log("File uploaded: ", saveHash);

    // Relate to user/uploader
    await prisma.user.update({
      where: { address: address },
      data: {
        ipfsFiles: {
          connect: {
            id: saveHash.id,
          },
        },
      },
    });
  } catch (e) {
    // console.log("Failed uploading file: ", e);
    if (e.code == "P2002") {
      return res.status(409).json({ error: "file already exists" });
    }
    return res.status(500).json({ error: "error" });
  }

  return res.status(200).json({ message: "file uploaded" });
}
