import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import multer from "multer";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        dni: params.dni,
      },
    });
    return NextResponse.json(usuario);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

/* Configuración de multer para manejar la carga de archivos
const upload = multer({ dest: "uploads/" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log(req.method);
  if (req.method === "POST") {
    // Manejar la creación de usuarios y la carga de imágenes
    upload.single("image")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Error al cargar la imagen" });
      } else if (err) {
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      // Guardar la ruta de la imagen en el campo 'foto' del usuario
      const { dni, nombres, celular, correo, peso, estatura } = req.body;
      const imagePath = path.join("uploads", req.file.filename);

      try {
        const usuario = await prisma.usuarios.create({
          data: {
            dni,
            nombres,
            celular,
            correo,
            peso,
            estatura,
            foto: imagePath, // Guardar la ruta de la imagen en la base de datos
          },
        });
        console.log(usuario);
        return res.status(201).json(usuario);
      } catch (error) {
        return res.status(500).json({ error: "Error al crear el usuario" });
      }
    });
  }
  if (req.method === "GET") {
    const usuario = await prisma.usuarios.findUnique({
      where: {
        id: Number(params.id),
      },
    });
    return NextResponse.json(usuario);
  }
}
*/
