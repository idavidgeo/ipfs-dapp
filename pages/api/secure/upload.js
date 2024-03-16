import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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

  console.log("uplading...", req.query.fileName);

  const ipfshash = uuidv4(); // TODO: should be the ipfshash
  const address = jwt.decode(token)?.address.toLowerCase();

  try {
    // Add file to prisma
    const fileUpload = await prisma.ipfsFile.create({ data: { hash: ipfshash, name: req.query.fileName, userAddress: address } });
    console.log("File uploaded: ", fileUpload);

    // Relate to user/uploader
    const relateFileToUser = await prisma.user.update({
      where: { address: address },
      data: {
        ipfsFiles: {
          connect: {
            hash: fileUpload.hash,
          },
        },
      },
    });
  } catch (e) {
    console.log("Failed uploading file: ", e);
    return res.status(500).json({ error: "error" });
  }

  return res.status(200).json({ message: "file uploaded" });
}
