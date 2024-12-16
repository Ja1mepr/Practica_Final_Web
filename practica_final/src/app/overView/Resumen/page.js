"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/app/Components/Navbar";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";

export default function SummaryPage() {
    const [clientsCount, setClientsCount] = useState(0);
    const [projectsCount, setProjectsCount] = useState(0);
    const [albaranesCount, setAlbaranesCount] = useState(0);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [albaranes, setAlbaranes] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filteredAlbaranes, setFilteredAlbaranes] = useState([]);
    const token = localStorage.getItem("jwt");

    // Obtener datos desde la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsResponse, projectsResponse, albaranesResponse] = await Promise.all([
                    axios.get("https://bildy-rpmaya.koyeb.app/api/client", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("https://bildy-rpmaya.koyeb.app/api/project", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setClients(clientsResponse.data);
                setProjects(projectsResponse.data);
                setAlbaranes(albaranesResponse.data);

                setClientsCount(clientsResponse.data.length);
                setProjectsCount(projectsResponse.data.length);
                setAlbaranesCount(albaranesResponse.data.length);

                setFilteredClients(clientsResponse.data);
                setFilteredProjects(projectsResponse.data);
                setFilteredAlbaranes(albaranesResponse.data);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }, [token]);

    const handleSearch = (term) => {
        const lowerTerm = term.toLowerCase();

        const filteredClientsList = clients.filter((client) =>
            client.name.toLowerCase().includes(lowerTerm)
        );
        setFilteredClients(filteredClientsList);

        const filteredProjectsList = projects.filter((project) =>
            project.name.toLowerCase().includes(lowerTerm)
        );
        setFilteredProjects(filteredProjectsList);

        const filteredAlbaranesList = albaranes.filter((albaran) =>
            albaran.description.toLowerCase().includes(lowerTerm)
        );
        setFilteredAlbaranes(filteredAlbaranesList);
    };

    const firstFiveClients = filteredClients.slice(0, 5);
    const firstFiveProjects = filteredProjects.slice(0, 5);
    const firstFiveAlbaranes = filteredAlbaranes.slice(0, 5);

    return (
        <div className="h-screen flex flex-col p-4">
            <Header onSearch={handleSearch} />
            <div className="flex flex-1">
                <div className="flex-none">
                    <Navbar />
                </div>
                <div className="flex-grow flex flex-col gap-4">
                    <section className="p-4 bg-white rounded shadow-md mb-8">
                        <h2 className="text-2xl font-bold mb-2">Bienvenido a Bildy</h2>
                        <p className="text-lg">
                            Bildy permite gestionar la información de tus clientes, proyectos y albaranes.
                            A continuación, podrás ver un resumen de los datos más importantes, incluyendo el número total
                            de elementos y los primeros 5 registros de cada categoría.
                        </p>
                    </section>
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="p-4 bg-white rounded shadow-md">
                            <h2 className="text-xl font-bold mb-2">Clientes</h2>
                            <p className="text-lg">Total de Clientes: {clientsCount}</p>
                            <ul className="list-disc pl-5">
                                {firstFiveClients.map((client) => (
                                    <li key={client._id}>{client.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-4">
                        <div className="p-4 bg-white rounded shadow-md">
                            <h2 className="text-xl font-bold mb-2">Proyectos</h2>
                            <p className="text-lg">Total de Proyectos: {projectsCount}</p>
                            <ul className="list-disc pl-5">
                                {firstFiveProjects.map((project) => (
                                    <li key={project._id}>{project.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-4">
                        <div className="p-4 bg-white rounded shadow-md">
                            <h2 className="text-xl font-bold mb-2">Albaranes</h2>
                            <p className="text-lg">Total de Albaranes: {albaranesCount}</p>
                            <ul className="list-disc pl-5">
                                {firstFiveAlbaranes.map((albaran) => (
                                    <li key={albaran._id}>{albaran.description}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}