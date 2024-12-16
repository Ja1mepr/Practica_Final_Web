"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/app/Components/Navbar";
import Header from "../Components/Header";
import GestorProyectos from "../Components/GestorProyectos";
import Client from "../Components/Client";
import Project from "../Components/Project"; // Nuevo componente integrado
import ProjectFormik from "../Components/ProjectsFormik";
import Footer from "../Components/Footer";

export default function ProjectsPage() {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [loading, setLoading] = useState(true);  // Estado de carga
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, clientsResponse] = await Promise.all([
          axios.get("https://bildy-rpmaya.koyeb.app/api/project", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://bildy-rpmaya.koyeb.app/api/client", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProjects(projectsResponse.data);
        setClients(clientsResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);  // Marcar como cargado
      }
    };

    fetchData();
  }, [token]);

  const handleCreateProject = async (newProject) => {
    try {
      const response = await axios.post(
        "https://bildy-rpmaya.koyeb.app/api/project",
        newProject,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects((prevProjects) => [...prevProjects, response.data]);
      setIsCreating(false);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    }
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setIsEditingProject(true);
  };

  const handleUpdateProject = async (updatedProject) => {
    try {
      const response = await axios.put(
        `https://bildy-rpmaya.koyeb.app/api/project/${updatedProject._id}`,
        updatedProject,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === updatedProject._id ? response.data : project
        )
      );
      setIsEditingProject(false);
      setProjectToEdit(null);
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    }
  };

  const deleteProyecto = async (id) => {
    try {
      await axios.delete(`https://bildy-rpmaya.koyeb.app/api/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== id));
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
    }
  };

  const handleSelectProjectClientId = (clientId) => {
    setSelectedClientId(clientId);
    setIsCreating(false);
  };

  const handleEditClient = async (updatedClient) => {
    try {
      const response = await axios.put(
        `https://bildy-rpmaya.koyeb.app/api/client/${updatedClient._id}`,
        updatedClient,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === updatedClient._id ? response.data : client
        )
      );
      setIsEditingClient(false);
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  const selectedClient = clients.find((client) => client._id === selectedClientId);

  return (
    <div className="h-screen flex flex-col p-4">
      <div>
        <Header />
      </div>
      <div className="flex flex-1">
        <div>
          <Navbar />
        </div>
        <div className="flex flex-1 gap-4">
          <div className="w-1/2 h-full">
            {/* Mostrar mensaje de carga o lista de proyectos */}
            {loading ? (
              <div className="flex justify-center items-center w-full h-full text-xl font-semibold">
                Cargando proyectos...
              </div>
            ) : projects.length === 0 ? (
              <div className="flex justify-center items-center flex-col w-full p-4 bg-white text-center">
                <p className="text-xl font-semibold mb-4">¡Crea tu primer proyecto!</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Crear Proyecto
                </button>
              </div>
            ) : (
              <GestorProyectos
                proyectos={projects}
                onSelectProjectClientId={handleSelectProjectClientId}
                deleteProyecto={deleteProyecto}
                onCreateProject={() => setIsCreating(true)}
                onEditProject={handleEditProject}
              />
            )}
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            {isCreating ? (
              <div className="p-4 bg-white rounded shadow">
                <h3 className="text-center text-xl font-bold mb-4">Crear Nuevo Proyecto</h3>
                <ProjectFormik
                  onSubmit={handleCreateProject}
                  clients={clients}
                  clienteId={selectedClientId}
                  onCancel={() => setIsCreating(false)}
                />
              </div>
            ) : isEditingProject ? (
              <div className="p-4 bg-white rounded shadow">
                <h3 className="text-center text-xl font-bold mb-4">Editar Proyecto</h3>
                <Project
                  proyecto={projectToEdit}
                  isEditing={true}
                  onSave={handleUpdateProject}
                  onCancel={() => {
                    setIsEditingProject(false);
                    setProjectToEdit(null);
                  }}
                />
              </div>
            ) : (
              selectedClient && (
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-center text-xl font-bold mb-4">Cliente Asociado</h3>
                  <Client
                    cliente={selectedClient}
                    onEdit={() => setIsEditingClient(true)}
                    onSave={handleEditClient}
                    isEditing={isEditingClient}
                    onCancel={() => setIsEditingClient(false)}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}