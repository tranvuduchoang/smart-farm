import { NextRequest } from "next/server";
import { Readable } from "stream";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "upload");
    fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 5,
      filename: (formName, file) => {
        const typedFile = file as unknown as File;
        const ext = path.extname(typedFile.originalFilename || "");
        return `${Date.now()}-${typedFile.newFilename}${ext}`;
      },
    });

    // 🧠 chuyển NextRequest thành stream buffer
    const buffer = await req.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));

    return await new Promise<Response>((resolve, reject) => {
      form.parse(
        Object.assign(stream, { headers: req.headers }) as any,
        (err, fields, files) => {
          if (err) {
            console.error("formidable error:", err);
            resolve(
              new Response(JSON.stringify({ error: "Upload failed" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              })
            );
            return;
          }

          const uploadedFiles = Array.isArray(files.images)
            ? files.images
            : [files.images];

          const urls = uploadedFiles.map((file: any) => ({
            url: `/upload/${path.basename(file.filepath)}`,
          }));

          resolve(
            new Response(JSON.stringify({ urls }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            })
          );
        }
      );
    });
  } catch (err) {
    console.error("Fatal upload error:", err);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
