// Importaciones necesarias
import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { v4 as uuidv4 } from "uuid";
import fs from "fs"; // Importar fs para manejar el sistema de archivos

// Manejador de la ruta GET para obtener todos los usuarios
export async function GET(request) {
  try {
    const usuarios = await prisma.usuario.findMany();
    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

// Manejador de la ruta POST para recibir datos enviados por FormData
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Obtener los datos del formulario
    const dni = formData.get("dni");
    const nombres = formData.get("nombres");
    const celular = formData.get("celular");
    const correo = formData.get("correo");
    const peso = parseInt(formData.get("peso"));
    const estatura = parseInt(formData.get("estatura"));
    const fecha_nacimiento = formData.get("fecha_nacimiento");

    // Obtener la foto
    const fotoFile = formData.get("foto");
    const foto = fotoFile ? `/uploads/${uuidv4()}-${fotoFile.name}` : null;

    // Guardar la foto en el servidor
    if (fotoFile) {
      const reader = fotoFile.stream().getReader();
      const writer = fs.createWriteStream(`public${foto}`);
      const pump = async () => {
        const { value, done } = await reader.read();
        if (done) {
          writer.close();
          return;
        }
        writer.write(value);
        return pump();
      };
      await pump();
    }

    // Guardar el usuario en la base de datos
    const usuario = await prisma.usuario.create({
      data: {
        dni,
        nombres,
        celular,
        correo,
        peso,
        estatura,
        foto,
        fecha_nacimiento,
      },
    });

    return NextResponse.json({ success: true, usuario });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
