import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  //return NextResponse.json("Tiquera número " + params.id);
  try {
    const tiquetera1 = await prisma.tiquera.findUnique({
      where: { id: Number(params.id) },
    });
    tiquetera1.num_sesiones = tiquetera1.num_sesiones - 1;
    if (tiquetera1.num_sesiones <= 0) {
      tiquetera1.estado = "Deshabilitado";
      const tiquetera = await prisma.tiquera.update({
        where: { id: Number(tiquetera1.id) },
        data: tiquetera1,
      });
      return NextResponse.json(tiquetera);
    }

    const tiquetera = await prisma.tiquera.update({
      where: { id: Number(tiquetera1.id) },
      data: tiquetera1,
    });
    return NextResponse.json(tiquetera);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const tiquetera = await prisma.tiquera.update({
      where: {
        id: Number(params.id),
      },
      data: {
        estado: "Deshabilitado",
      },
    });
    const newTiquetera = await prisma.tiquera.create({ data: data });
    return NextResponse.json(newTiquetera);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
