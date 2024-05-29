"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

const Usuarios = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 10;
  async function loadUsers() {
    const response = await fetch("http://localhost:3000/api/usuarios");
    const users = await response.json();
    return users.filter(
      (usuario) =>
        usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.dni.includes(searchTerm)
    );
  }
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log(searchTerm);
  };
  const showAddModal = () => {
    Swal.fire({
      title: "Agregar Usuario",
      html: `
        <input id="dni" class="swal2-input mb-1" placeholder="Dni">
        <input id="nombres" class="swal2-input mb-1" placeholder="Nombres">
        <input id="correo" class="swal2-input mb-1" placeholder="Correo">
        <input id="peso" class="swal2-input mb-1" placeholder="Peso">
        <input id="estatura" class="swal2-input mb-1" placeholder="Estatura">
        <input id="celular" class="swal2-input mb-1" placeholder="Celular">
        <input id="fecha_nacimiento" type="date" class="swal2-input mb-1" placeholder="Celular">
        <input id="foto" type="file" class="swal2-file mb-1" accept="image/*" placeholder="Foto">
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const dni = Swal.getPopup().querySelector("#dni").value;
        const nombres = Swal.getPopup().querySelector("#nombres").value;
        const correo = Swal.getPopup().querySelector("#correo").value;
        const peso = Swal.getPopup().querySelector("#peso").value;
        const estatura = Swal.getPopup().querySelector("#estatura").value;
        const celular = Swal.getPopup().querySelector("#celular").value;
        const fecha_nacimiento =
          Swal.getPopup().querySelector("#fecha_nacimiento").value;
        const foto = Swal.getPopup().querySelector("#foto").files[0];

        // Convertir la fecha de nacimiento a un formato compatible con DATETIME
        const fechaNacimientoFormatted = new Date(
          fecha_nacimiento
        ).toISOString();

        // Crear FormData y agregar los campos y la foto
        const formData = new FormData();
        formData.append("dni", dni);
        formData.append("nombres", nombres);
        formData.append("correo", correo);
        formData.append("peso", peso);
        formData.append("estatura", estatura);
        formData.append("celular", celular);
        formData.append("fecha_nacimiento", fechaNacimientoFormatted);
        formData.append("foto", foto);

        return formData;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizar la solicitud POST con los datos del formulario
        fetch("http://localhost:3000/api/usuarios", {
          method: "POST",
          body: result.value,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error en la solicitud de red.");
            }
            return response.json();
          })
          .then(async (data) => {
            console.log("Nuevo usuario creado:", data);
            const dataUsers = await loadUsers();
            setUsuarios(dataUsers);
            Swal.fire(
              "¡Usuario creado!",
              "El usuario ha sido agregado correctamente.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error al agregar usuario:", error);
            // Mostrar mensaje de error
            Swal.fire(
              "Error",
              "Ocurrió un error al agregar el usuario.",
              "error"
            );
          });
      }
    });
  };
  const showEditModal = (usuario) => {
    Swal.fire({
      title: "Editar Usuario",
      html: `
      <div class="grid grid-cols-3 gap-2">
      <div class="col-span-1">
        <!-- Primera columna: imagen -->
        <img src="${
          usuario.foto ? usuario.foto : "/uploads/avatar.png"
        }" alt="${usuario.nombre}" class="w-full h-auto mb-4 rounded-lg">
      </div>
      <div class="col-span-1">
        <!-- Segunda columna: primeros tres inputs -->
        <div class="text-center">
          <input id="nombre" class="swal2-input mb-1" value="${
            usuario.nombre
          }" disabled>
          <input id="correo" class="swal2-input mb-1" value="${
            usuario.correo
          }" disabled>
          <input id="peso" class="swal2-input mb-1" value="${
            usuario.peso
          }" disabled>
        </div>
      </div>
      <div class="col-span-1">
        <!-- Tercera columna: últimos dos inputs -->
        <input id="estatura" class="swal2-input mb-1" value="${
          usuario.estatura
        }" disabled>
        <input id="celular" class="swal2-input mb-1" value="${
          usuario.celular
        }" disabled>
        <br>
        <input type="checkbox" id="checkbox"> Habilitar Edición
      </div>
    </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup().querySelector("#nombre").value;
        const correo = Swal.getPopup().querySelector("#correo").value;
        const peso = Swal.getPopup().querySelector("#peso").value;
        const estatura = Swal.getPopup().querySelector("#estatura").value;
        const celular = Swal.getPopup().querySelector("#celular").value;
        const checkbox = Swal.getPopup().querySelector("#checkbox").checked;

        return { nombre, correo, peso, estatura, celular, checkbox };
      },
      // Configurar ancho del modal
      customClass: {
        popup: "custom-popup-class",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Usuario guardado:", result.value);
      }
    });

    // Habilitar/deshabilitar campos según el estado del checkbox
    const checkbox = Swal.getPopup().querySelector("#checkbox");
    const inputs = Swal.getPopup().querySelectorAll(".swal2-input");

    checkbox.addEventListener("change", () => {
      inputs.forEach((input) => {
        input.disabled = !checkbox.checked;
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const dataUsers = await loadUsers();
      setUsuarios(dataUsers);
    };

    fetchData();
  }, [searchTerm]);
  const handleClickPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClickNext = () => {
    if ((currentPage + 1) * usersPerPage < usuarios.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Lista de Usuarios del Gym</h1>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            className="border text-black border-gray-300 px-3 py-2 mr-2"
            placeholder="Buscar usuario por DNI o nombres..."
            value={searchTerm}
            onChange={() => handleSearchChange(event)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => showAddModal()}
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {usuarios
          .slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage)
          .map((usuario) => (
            <div
              key={usuario.id}
              className="p-4 border rounded-lg hover:bg-white hover:text-gray-600 cursor-pointer"
              onClick={() => showEditModal(usuario)}
            >
              <img
                src={usuario.foto ? usuario.foto : "/uploads/avatar.png"}
                alt={usuario.nombre}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">
                  {usuario.nombres}
                </h2>
                <p className="text-sm text-gray-600">{usuario.correo}</p>
                <p className="text-sm text-gray-600">
                  documento: {usuario.dni}
                </p>
                <p className="text-sm text-gray-600">Peso: {usuario.peso}</p>
                <p className="text-sm text-gray-600">
                  Estatura: {usuario.estatura}
                </p>
                <p className="text-sm text-gray-600">
                  Teléfono: {usuario.celular}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleClickPrev}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Anterior
        </button>
        <button
          onClick={handleClickNext}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Usuarios;
