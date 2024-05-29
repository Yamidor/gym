import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { v4 as uuidv4 } from "uuid";
import fs from "fs"; // Importar fs para manejar el sistema de archivos

export async function GET() {
  try {
    const planes = await prisma.plan.findMany();
    return NextResponse.json(planes);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
