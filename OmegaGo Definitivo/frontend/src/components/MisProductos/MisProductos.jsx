import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Menu/Menu.css";
import MostrarValoraciones from "../Menu/MostrarValoraciones";


const MisProductos = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [productoAEditar, setProductoAEditar] = useState(null);

    useEffect(() => {
        cargarMisProductos();
    }, []);

    const openEditModal = (producto) => {
        setProductoAEditar(producto);
        setEditModalOpen(true);
    };

    const cargarMisProductos = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/productos/usuario/mis-productos", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setProductos(res.data);
        } catch (error) {
            console.error("Error al cargar tus productos:", error);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/productos/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            cargarMisProductos();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/productos/${productoAEditar.id}`, productoAEditar, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setEditModalOpen(false);
            cargarMisProductos();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    };

    return (
        <div className="menu-page">
            <button onClick={() => navigate("/menu")} style={{ margin: "1rem" }}>
                ← Volver al menú
            </button>
            <h2 style={{ textAlign: "center" }}>Mis Productos</h2>
            <div className="productos-grid">
                {productos.length === 0 && <p style={{ textAlign: "center" }}>No has publicado ningún producto aún.</p>}
                {productos.map(p => (
                    <div key={p.id} className="producto-card">
                        <img src={`http://localhost:5000/uploads/${p.imagen}`} alt={p.titulo} />
                        <h3>{p.titulo}</h3>
                        <p className="precio">{p.precio}€</p>
                        <p className="descripcion">{p.descripcion}</p>
                        <p className="categoria">Categoría: {p.categoria}</p>
                        <MostrarValoraciones productoId={p.id} />
                        <div className="admin-actions">
                            <button onClick={() => openEditModal(p)}>Editar</button>
                            <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
            {editModalOpen && productoAEditar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Editar Producto</h3>
                        <form onSubmit={handleUpdateProduct}>
                            <input
                                type="text"
                                placeholder="Título"
                                value={productoAEditar.titulo}
                                onChange={(e) =>
                                    setProductoAEditar({ ...productoAEditar, titulo: e.target.value })
                                }
                            />
                            <textarea
                                placeholder="Descripción"
                                value={productoAEditar.descripcion}
                                onChange={(e) =>
                                    setProductoAEditar({ ...productoAEditar, descripcion: e.target.value })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Precio"
                                value={productoAEditar.precio}
                                onChange={(e) =>
                                    setProductoAEditar({ ...productoAEditar, precio: e.target.value })
                                }
                            />
                            <select
                                value={productoAEditar.categoria}
                                onChange={(e) =>
                                    setProductoAEditar({ ...productoAEditar, categoria: e.target.value })
                                }
                            >
                                <option value="">Selecciona una categoría</option>
                                <option value="Tecnología">Tecnología</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Hogar">Hogar</option>
                                <option value="Juguetes">Juguetes</option>
                                <option value="Otros">Otros</option>
                            </select>

                            <button type="submit" className="guardar-btn" onClick={handleUpdateProduct}> Guardar </button>
                            <button type="button" onClick={() => setEditModalOpen(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MisProductos;
