"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/app/Components/Navbar";
import Header from "../Components/Header";
import GestorClientes from "../Components/GestorClientes";
import Client from "../Components/Client";
import ClientProjects from "../Components/ClientProjects";
import ClientFormik from "../Components/ClientsFormik";
import Footer from "../Components/Footer";

export default function ClientsPage() {
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]); // Filtered clients state
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true); // Estado para controlar la carga
    const token = localStorage.getItem("jwt");

    // Obtener clientes
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/client", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClients(response.data);
                setFilteredClients(response.data); // Set filteredClients when clients are fetched
            } catch (error) {
                console.error("Error al obtener clientes:", error);
            } finally {
                setLoading(false); // Dejar de mostrar el mensaje de carga después de obtener los clientes
            }
        };

        fetchClientes();
    }, [token]);

    // Obtener proyectos
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/project", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProjects(response.data);
            } catch (error) {
                console.error("Error al obtener proyectos:", error);
            }
        };

        fetchProjects();
    }, [token]);

    // Eliminar cliente
    const deleteCliente = async (id) => {
        try {
            await axios.delete(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Actualizar el estado de clientes
            setClients((prevClients) => prevClients.filter((client) => client._id !== id));
            setFilteredClients((prevFilteredClients) => prevFilteredClients.filter((client) => client._id !== id));
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
        }
    };

    // Editar cliente
    const handleEdit = async (updatedClient) => {
        try {
            const response = await axios.put(
                `https://bildy-rpmaya.koyeb.app/api/client/${updatedClient._id}`,
                updatedClient,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Actualizar el cliente editado en la lista de clientes
            setClients((prevClients) =>
                prevClients.map((client) =>
                    client._id === updatedClient._id ? response.data : client
                )
            );

            setFilteredClients((prevFilteredClients) =>
                prevFilteredClients.map((client) =>
                    client._id === updatedClient._id ? response.data : client
                )
            );

            // Salir del modo edición
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar cliente:", error.response?.data || error);
        }
    };

    // Crear cliente
    const handleCreateClient = async (newClient) => {
        try {
            const response = await axios.post("https://bildy-rpmaya.koyeb.app/api/client", newClient, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setClients((prevClients) => [...prevClients, response.data]);
            setFilteredClients((prevFilteredClients) => [...prevFilteredClients, response.data]);
            setIsCreating(false); // Cerrar el formulario de creación
        } catch (error) {
            console.error("Error al crear cliente:", error);
        }
    };

    const client = clients.find((client) => client._id === selectedClientId);

    const handleSelectClient = (id) => {
        setSelectedClientId(id);
        setIsCreating(false);
        setIsEditing(false);
    };

    const handleCreateProject = async (newProject) => {
        const projectWithClient = { ...newProject, clientId: selectedClientId };

        try {
            const response = await axios.post(
                "https://bildy-rpmaya.koyeb.app/api/project",
                projectWithClient,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            setProjects((prevProjects) => [...prevProjects, response.data]);
            setIsCreating(false);
        } catch (error) {
            console.error("Error al crear el proyecto:", error.response?.data || error);
        }
    };

    // Handle search input
    const handleSearch = (term) => {
        const lowerTerm = term.toLowerCase();

        const filtered = clients.filter((client) =>
            client.name.toLowerCase().includes(lowerTerm)
        );
        setFilteredClients(filtered);
    };

    return (
        <div className="h-screen flex flex-col p-4">
            <div>
                <Header onSearch={handleSearch} />
            </div>
            <div className="flex flex-1">
                <div>
                    <Navbar />
                </div>
                <div className="w-1/4 h-full">
                    {/* Verificar si estamos cargando o si no hay clientes */}
                    {loading ? (
                        <div className="flex justify-center items-center w-full h-full text-xl font-semibold">
                            Cargando clientes...
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="flex justify-center items-center flex-col w-full p-4 bg-white text-center">
                            <p className="text-xl font-semibold mb-4">¡Crea tu primer cliente!</p>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Crear Cliente
                            </button>
                        </div>
                    ) : (
                        <GestorClientes
                            clientes={filteredClients} // Use filtered clients here
                            onSelectClientId={handleSelectClient}
                            deleteCliente={deleteCliente}
                            onCreateClient={() => setIsCreating(true)}
                        />
                    )}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    {isCreating ? (
                        <div className="p-4 bg-white rounded shadow">
                            <h3 className="text-center text-xl font-bold mb-4">Crear Nuevo Cliente</h3>
                            <ClientFormik
                                onSubmit={handleCreateClient}
                                onCancel={() => setIsCreating(false)}
                            />
                        </div>
                    ) : (
                        <>
                            {client && (
                                <>
                                    <div className="p-4 bg-white rounded shadow">
                                        <Client
                                            cliente={client}
                                            onEdit={() => setIsEditing(true)}
                                            onSave={handleEdit}
                                            isEditing={isEditing}
                                            onCancel={() => setIsEditing(false)}
                                        />
                                    </div>
                                    <div className="p-4 bg-white rounded shadow">
                                        <ClientProjects clients={clients} clientId={selectedClientId} proyectos={projects} handleCreateProject={handleCreateProject} />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}