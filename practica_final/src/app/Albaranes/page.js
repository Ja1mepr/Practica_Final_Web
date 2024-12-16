"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/app/Components/Navbar";
import Header from "../Components/Header";
import GestorAlbaranes from "../Components/GestorAlbaranes";
import AlbaranesFormik from "../Components/AlbaranesFormik";
import Footer from "../Components/Footer";

export default function AlbaranesPage() {
  const [selectedAlbaranId, setSelectedAlbaranId] = useState(null);
  const [albaranes, setAlbaranes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albaranesResponse, projectsResponse, clientsResponse] = await Promise.all([
          axios.get("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://bildy-rpmaya.koyeb.app/api/project", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://bildy-rpmaya.koyeb.app/api/client", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAlbaranes(albaranesResponse.data);
        setProjects(projectsResponse.data);
        setClients(clientsResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false); // Marcar como cargado
      }
    };

    fetchData();
  }, [token]);

  const handleCreateAlbaran = async (newAlbaran) => {
    try {
      const response = await axios.post(
        "https://bildy-rpmaya.koyeb.app/api/deliverynote",
        newAlbaran,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlbaranes((prevAlbaranes) => [...prevAlbaranes, response.data]);
      setIsCreating(false);
    } catch (error) {
      console.error("Error al crear albarán:", error);
    }
  };

  const deleteAlbaran = async (id) => {
    try {
      await axios.delete(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlbaranes((prevAlbaranes) => prevAlbaranes.filter((albaran) => albaran._id !== id));
    } catch (error) {
      console.error("Error al eliminar albarán:", error);
    }
  };

  const handleSelectAlbaranId = (albaranId) => {
    setSelectedAlbaranId(albaranId);
    setIsCreating(false);
  };

  const initialValues = {
    clientId: "",
    projectId: "",
    format: "",
    material: "",
    hours: "",
    description: "",
    workdate: "",
  };

  return (
    <div className="h-screen flex flex-col p-4">
      <Header />
      <div className="flex flex-1">
        <div className="flex-none">
          <Navbar />
        </div>
        <div className="flex-grow flex flex-col gap-4">
          <div className="flex-1">
            {/* Mostrar mensaje de carga o lista de albaranes */}
            {loading ? (
              <div className="flex justify-center items-center w-full h-full text-xl font-semibold">
                Cargando albaranes...
              </div>
            ) : albaranes.length === 0 ? (
              <div className="flex justify-center items-center flex-col w-full p-4 bg-white text-center">
                <p className="text-xl font-semibold mb-4">¡Crea tu primer albarán!</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Crear Albarán
                </button>
              </div>
            ) : (
              <GestorAlbaranes
                albaranes={albaranes}
                onSelectAlbaranId={handleSelectAlbaranId}
                deleteAlbaran={deleteAlbaran}
                onCreateAlbaran={() => setIsCreating(true)}
              />
            )}
          </div>
          {isCreating ? (
            <div className="p-4 bg-white rounded shadow">
              <AlbaranesFormik
                onSubmit={handleCreateAlbaran}
                initialValues={initialValues}
                clients={clients}
                projects={projects}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          ) : (
            selectedAlbaranId && (
              <div className="p-4 bg-white rounded shadow">
                <h3 className="text-center text-xl font-bold mb-4">Albarán Seleccionado</h3>
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}