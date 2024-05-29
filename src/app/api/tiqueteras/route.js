// Importaciones necesarias
import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { v4 as uuidv4 } from "uuid";
import fs from "fs"; // Importar fs para manejar el sistema de archivos
import { data } from "autoprefixer";

export async function GET() {
  try {
    const tiqueteras = await prisma.tiquera.findMany({
      include: {
        usuario: true,
        plan: true,
      },
      where: {
        estado: "activo",
      },
    });
    return NextResponse.json(tiqueteras);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
export async function POST(request) {
  const data = await request.json();

  try {
    const tiquetera = await prisma.tiquera.create({ data: data });
    return NextResponse.json(tiquetera);
  } catch (error) {
    return NextResponse.json(error);
  }
}
