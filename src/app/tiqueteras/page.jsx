"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
const Tiqueteras = () => {
  const [tiqueteras, setTiqueteras] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const tiqueterasPerPage = 10;
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Función para realizar la búsqueda
  const performSearch = () => {
    return tiqueteras.filter(
      (tiquetera) =>
        tiquetera.usuario.nombres
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tiquetera.usuario.dni.includes(searchTerm)
    );
  };
  const asistenciaGeneral = () => {
    const openModal = () => {
      Swal.fire({
        title: `Registrar Asistencia`,
        html: `
        <style>
        .container{
          background: #33FFC7;
          color: black;
          border-radius: 10px;
          margin-top: 10px;
          padding: 5px
        }
        .user-photo {
          border: 1px solid;
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 50%; /* Hace que la imagen sea circular */
          display: block;
          margin: 0 auto; /* Centra la imagen horizontalmente */
        }
      </style>
          <input type="text" id="buscar" class="swal2-input" placeholder="Digita numero documento">
          <div id="resultado" class="swal2-results"></div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        didOpen: () => {
          const inputElement = document.getElementById("buscar");
          const resultadoDiv = document.getElementById("resultado");

          inputElement.addEventListener("input", async function (event) {
            const inputValue = inputElement.value.trim();

            // Limpiar el div de resultados
            resultadoDiv.innerHTML = "";

            if (inputValue) {
              try {
                // Filtrar las tiqueteras para encontrar el documento ingresado
                const tiqueteraActiva = tiqueteras.find(
                  (tiquetera) => tiquetera.usuario.dni === inputValue
                );

                if (tiqueteraActiva) {
                  const fechaInicio = new Date(
                    tiqueteraActiva.fecha_inicio
                  ).toLocaleDateString();
                  const fechaFin = new Date(
                    tiqueteraActiva.fecha_fin
                  ).toLocaleDateString();

                  // Construir el mensaje con los datos del usuario
                  const mensaje = `
                  <div class="container">
                    <img src="${tiqueteraActiva.usuario.foto}" alt="Foto de ${tiqueteraActiva.usuario.nombres}" class="user-photo">
                    <h2>${tiqueteraActiva.usuario.nombres}</h2>
                    <p>Fecha Inicio: ${fechaInicio}</p>
                    <p>Fecha Fin: ${fechaFin}</p>
                  </div>
                `;
                  // Mostrar el resultado en el div
                  resultadoDiv.innerHTML = mensaje;
                } else {
                  // Mostrar mensaje de usuario no encontrado
                  resultadoDiv.innerHTML =
                    "<p>Usuario no encontrado o sin tiquetera activa.</p>";
                }
              } catch (error) {
                console.error("Hubo un error al realizar la búsqueda:", error);
              }
            }
          });

          inputElement.addEventListener("keydown", async function (event) {
            if (event.key === "Enter") {
              const inputValue = inputElement.value.trim();
              if (inputValue) {
                try {
                  // Filtrar las tiqueteras para encontrar el documento ingresado
                  const tiqueteraActiva = tiqueteras.find(
                    (tiquetera) => tiquetera.usuario.dni === inputValue
                  );

                  if (tiqueteraActiva) {
                    await asistencia(tiqueteraActiva);

                    Swal.close(); // Cierra el modal

                    await setTimeout(async () => {
                      const data = await loadTiqueteras();
                      await setTiqueteras(data);
                      openModal(); // Abre el modal de nuevo
                    }, 2000);
                  } else {
                    // Mostrar mensaje de usuario no encontrado
                    resultadoDiv.innerHTML =
                      "<p>Usuario no encontrado o sin tiquetera activa.</p>";
                  }
                } catch (error) {
                  console.error(
                    "Hubo un error al realizar la búsqueda:",
                    error
                  );
                }
              }
            }
          });
        },
      });
    };

    openModal(); // Abre el modal inicialmente
  };

  const handleUserPagar = () => {
    Swal.fire({
      title: `Pagar Tiquetra`,
      html: `
      <input type="text" id="buscar" class="swal2-input" placeholder="Digita DNI a buscar">
      <div id="resultado"></div>
      <div id="formulario" style="display: none;">
        <input type="date" id="startDate" class="swal2-input" placeholder="Fecha de inicio">
        <input type="date" id="endDate" class="swal2-input" placeholder="Fecha de finalización">
        <select id="planType" class="swal2-input">
          ${planes.map(
            (plan) =>
              `<option value="${plan.id}" data-sesiones="${plan.sesiones}" data-valor="${plan.valor}">${plan.nombre}</option>`
          )}
        </select>
        <input type="text" id="sesiones" class="swal2-input" placeholder="Número de Sesiones" disabled>
        <input type="text" id="valorPlan" class="swal2-input" placeholder="Valor del Plan" disabled>
        <input type="hidden" id="userId" name="userId" value="" />
      </div>
      `,

      showCancelButton: true,
      confirmButtonText: "Pagar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const planType = document.getElementById("planType").value;
        const sesiones = document.getElementById("sesiones").value;
        const valorPlan = document.getElementById("valorPlan").value;
        const userId = document.getElementById("userId").value;
        const fechaStart = new Date(startDate).toISOString();
        const fechaEnd = new Date(endDate).toISOString();
        const data = {
          fecha_inicio: fechaStart,
          fecha_fin: fechaEnd,
          usuarioId: parseInt(userId),
          planId: parseInt(planType),
          num_sesiones: parseInt(sesiones),
        };
        return data;
      },

      didOpen: () => {
        const inputElement = document.getElementById("buscar");
        const resultadoDiv = document.getElementById("resultado");
        const formularioDiv = document.getElementById("formulario");
        // Agregar un listener de evento 'input' al input
        inputElement.addEventListener("input", async function (event) {
          const inputValue = inputElement.value;
          try {
            const response = await fetch(
              `http://localhost:3000/api/usuarios/${inputValue}`
            );
            if (response.ok) {
              const data = await response.json();
              await setUserId(data.id);

              document.getElementById("userId").value = data.id;
              resultadoDiv.textContent = data.nombres;
              if (data.nombres !== undefined) {
                const tiqueteraActiva = await tiqueteras.find(
                  (tiquetera) =>
                    tiquetera.usuarioId === parseInt(data.id) &&
                    tiquetera.estado === "activo"
                );

                if (tiqueteraActiva) {
                  // Construir el mensaje con los datos de la tiquetera
                  const mensaje = `ID: ${tiqueteraActiva.id}<br>
                                  Fecha Inicio: ${tiqueteraActiva.fecha_inicio}<br>
                                  Fecha Fin: ${tiqueteraActiva.fecha_fin}<br>
                                  Número de Sesiones: ${tiqueteraActiva.num_sesiones}<br>
                                  Tiquera: ${tiqueteraActiva.estado}<br>
                                  Plan: ${tiqueteraActiva.plan.nombre}`;
                  // Mostrar el resultado en el div
                  resultadoDiv.innerHTML = mensaje;
                  formularioDiv.style.display = "none";
                } else {
                  const mensaje = `Usuario: ${data.nombres}- Sin tiquetera<br>`;
                  resultadoDiv.innerHTML = mensaje;
                  formularioDiv.style.display = "block";
                }
              }
            } else {
              throw new Error(
                `Error: ${response.status} - ${response.statusText}`
              );
            }
          } catch (error) {
            // Capturar y manejar cualquier error que ocurra durante la consulta
            console.error("Hubo un error al realizar la consulta:", error);
          }
        });
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (result.isConfirmed) {
          await fetch("/api/tiqueteras", {
            method: "POST",
            body: JSON.stringify(result.value),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error en la solicitud de red.");
              }
              return response.json();
            })
            .then(async (data) => {
              Swal.fire(
                "¡Tiquera Creada!",
                `Tiquera se creo correctamente.`,
                "success"
              );
              console.log(data);
            })
            .catch((error) => {
              // Mostrar mensaje de error
              Swal.fire(
                "Error",
                "Ocurrió un error crear la tiquetera",
                "error"
              );
            });
        }
      }
    });
    document
      .getElementById("planType")
      .addEventListener("change", function (event) {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const sesiones = selectedOption.getAttribute("data-sesiones");
        const valorPlan = selectedOption.getAttribute("data-valor");
        document.getElementById("sesiones").value = sesiones;
        document.getElementById("valorPlan").value = valorPlan;
      });
  };
  const handlePagar = (tiquetera) => {
    Swal.fire({
      title: `Pagar para ${tiquetera.usuario.nombres}`,
      html: `
        <input type="date" id="startDate" class="swal2-input" placeholder="Fecha de inicio">
        <input type="date" id="endDate" class="swal2-input" placeholder="Fecha de finalización">
        <select id="planType" class="swal2-input">
          ${planes.map(
            (plan) =>
              `<option value="${plan.id}" data-sesiones="${plan.sesiones}" data-valor="${plan.valor}">${plan.nombre}</option>`
          )}
        </select>
        <input type="text" id="sesiones" class="swal2-input" placeholder="Número de Sesiones" disabled>
        <input type="text" id="valorPlan" class="swal2-input" placeholder="Valor del Plan" disabled>
        <input type="hidden" id="userId" name="userId" value=${
          tiquetera.usuario.id
        } />
        <input type="hidden" id="num_sesiones" name="num_sesiones" value=${
          tiquetera.num_sesiones
        } />
      `,
      showCancelButton: true,
      confirmButtonText: "Pagar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const planType = document.getElementById("planType").value;
        const sesiones = document.getElementById("sesiones").value;
        const valorPlan = document.getElementById("valorPlan").value;
        const userId = document.getElementById("userId").value;
        const num_sesiones_extra =
          document.getElementById("num_sesiones").value;
        const fechaStart = new Date(startDate).toISOString();
        const fechaEnd = new Date(endDate).toISOString();
        const tiqueteraId = tiquetera.id;
        const data = {
          fecha_inicio: fechaStart,
          fecha_fin: fechaEnd,
          usuarioId: parseInt(userId),
          planId: parseInt(planType),
          num_sesiones: parseInt(sesiones),
        };
        return {
          data: data,
          tiquetera: tiquetera,
        };
        // Aquí puedes hacer lo que necesites con los datos del formulario
        // Por ejemplo, enviarlos al servidor para procesar el pago
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch("/api/tiqueteras/" + result.value.tiquetera.id, {
          method: "PUT",
          body: JSON.stringify(result.value.data),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error en la solicitud de red.");
            }
            return response.json();
          })
          .then(async (data) => {
            Swal.fire(
              "¡Tiquera actualizada!",
              `Tiquera ${result.value.tiquetera.id} actualizada correctamente.`,
              "success"
            );
            console.log(data);
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

    document
      .getElementById("planType")
      .addEventListener("change", function (event) {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const sesiones = selectedOption.getAttribute("data-sesiones");
        const valorPlan = selectedOption.getAttribute("data-valor");
        const num_sesiones_extra =
          document.getElementById("num_sesiones").value;
        if (num_sesiones_extra > 0) {
          document.getElementById("sesiones").value =
            parseInt(sesiones) + parseInt(num_sesiones_extra);
          document.getElementById("valorPlan").value = valorPlan;
        } else {
          document.getElementById("sesiones").value = sesiones;
          document.getElementById("valorPlan").value = valorPlan;
        }
      });
  };

  async function loadTiqueteras() {
    const response = await fetch("http://localhost:3000/api/tiqueteras");
    const tiqueteras = await response.json();
    return tiqueteras;
  }
  async function loadPlanes() {
    const response = await fetch("http://localhost:3000/api/planes");
    const planes = await response.json();
    return planes;
  }
  const asistencia = async (tiquetera) => {
    const response = await fetch(
      "http://localhost:3000/api/tiqueteras/" + tiquetera.id
    );
    const tiqueteraUpdate = await response.json();
    await Toast.fire({
      icon: "success",
      title: `Te quedan ${tiqueteraUpdate.num_sesiones} sesiones`,
    });
    const data = await loadTiqueteras();
    setTiqueteras(data);
  };
  const isRedBackground = (tiquetera) => {
    const twoDaysBefore = new Date();
    twoDaysBefore.setDate(twoDaysBefore.getDate() + 2);
    if (
      tiquetera.num_sesiones < 3 ||
      new Date(tiquetera.fecha_fin) <= twoDaysBefore
    ) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await loadTiqueteras();
      const planesData = await loadPlanes();
      setTiqueteras(data);
      setPlanes(planesData);
    };

    fetchData();
  }, [tiqueteras]);

  const handleClickPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClickNext = () => {
    if ((currentPage + 1) * tiqueterasPerPage < tiqueteras.length) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-4">Lista de Tiqueteras</h1>
          </div>
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => asistenciaGeneral()}
            >
              Asistencia General
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar por DNI o nombres de usuario"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border text-black border-gray-300 px-3 py-2 mr-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => handleUserPagar()}
            >
              Agregar Tiquetera
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {performSearch()
            .slice(
              currentPage * tiqueterasPerPage,
              (currentPage + 1) * tiqueterasPerPage
            )
            .map((tiquetera) => (
              <div
                key={tiquetera.id}
                className={`p-4 border rounded-lg hover:bg-white hover:text-gray-600 cursor-pointer ${
                  isRedBackground(tiquetera) ? "bg-red-500" : "bg-green-500"
                }`}
              >
                <img
                  src={
                    tiquetera.usuario.foto
                      ? tiquetera.usuario.foto
                      : "/uploads/avatar.png"
                  }
                  alt={tiquetera.usuario.nombre}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">
                    {tiquetera.usuario.nombres}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Fecha de inicio:{" "}
                    {new Date(tiquetera.fecha_inicio).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fecha finalización:{" "}
                    {new Date(tiquetera.fecha_fin).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Numero de sessiones: {tiquetera.num_sesiones}
                  </p>
                  <div>
                    <button
                      className="bg-blue-500 text-white border-2 mt-2 border-blue-500 rounded-lg shadow-md px-4 py-2 hover:bg-blue-700"
                      onClick={() => asistencia(tiquetera)}
                    >
                      Asistencia
                    </button>
                    {isRedBackground(tiquetera) && (
                      <button
                        className="bg-green-500 ml-3 text-white border-2 mt-2 border-green-500 rounded-lg shadow-md px-4 py-2 hover:bg-green-700"
                        onClick={() => handlePagar(tiquetera)}
                      >
                        Pagar
                      </button>
                    )}
                  </div>
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
    </>
  );
};

export default Tiqueteras;
