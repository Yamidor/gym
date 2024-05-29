-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dni" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "peso" INTEGER NOT NULL,
    "estatura" INTEGER NOT NULL,
    "foto" TEXT,
    "fecha_nacimiento" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tiquera" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha_inicio" DATETIME NOT NULL,
    "fecha_fin" DATETIME NOT NULL,
    "num_sesiones" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    CONSTRAINT "Tiquera_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tiquera_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "sesiones" INTEGER NOT NULL
);
