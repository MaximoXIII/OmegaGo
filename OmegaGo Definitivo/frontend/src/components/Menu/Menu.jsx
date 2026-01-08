import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Menu.css";
import ValorarProducto from "./ValorarProducto";
import MostrarValoraciones from "./MostrarValoraciones";



const Menu = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [filters, setFilters] = useState({ category: "all", priceRange: [0, 1000] });
    const [applyFilters, setApplyFilters] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [productoAEditar, setProductoAEditar] = useState(null);
    const [categoriaEdit, setCategoriaEdit] = useState('');


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        if (!storedUser) return navigate("/");
        setUser(storedUser);
        fetchProducts();
        fetchPosts();
    }, [navigate]);

    const openEditModal = (producto) => {
        setProductoAEditar(producto);
        setEditModalOpen(true);
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/productos");
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/publicaciones");
            setPosts(res.data);
        } catch (error) {
            console.error("Error fetching posts", error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleContact = async (sellerId, sellerNombre) => {
        try {
            const res = await axios.post("http://localhost:5000/api/chats",
                { usuario2_id: sellerId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            const chatId = res.data.chat?.id || res.data.id; // manejar ambas respuestas posibles
            navigate(`/chats/${chatId}`);
        } catch (error) {
            console.error("❌ Error al iniciar chat:", error);
            alert("No se pudo iniciar el chat.");
        }
    };


    const handleDeleteProduct = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/productos/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product", error);
        }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/publicaciones/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const handlePublicarProducto = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            await axios.post("http://localhost:5000/api/productos", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            alert("Producto publicado correctamente.");
            e.target.reset();
            fetchProducts();
        } catch (error) {
            console.error("Error al publicar producto:", error);
            alert("Error al publicar producto.");
        }
    };

    const handlePublicar = async (e) => {
        e.preventDefault();
        const contenido = e.target.contenido.value;

        try {
            await axios.post("http://localhost:5000/api/publicaciones", { contenido }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("¡Publicación creada!");
            e.target.reset();
            fetchPosts();
        } catch (error) {
            console.error("Error al publicar:", error);
            alert("Error al crear la publicación.");
        }
    };

    const filteredProducts = applyFilters
        ? products.filter(p => {
            if (filters.category !== "all" && p.categoria !== filters.category) return false;
            return p.precio >= filters.priceRange[0] && p.precio <= filters.priceRange[1];
        })
        : products;

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/productos/${productoAEditar.id}`, productoAEditar, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setEditModalOpen(false);
            fetchMisProductos(); 
            fetchProducts();     
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    };

    return (
        <div className="menu-page">
            <header className="menu-header">
                <img src="/omega-logo.png" alt="OmegaGo" className="menu-logo" />
            </header>
            <div className="menu-container">

                <aside className="menu-sidebar-left">
                    <div className="user-info">
                        <p>{user?.nombre}</p>
                    </div>
                    <div className="menu-nav">
                        <button onClick={() => navigate("/perfil")}>Mi Perfil</button>
                        <button onClick={() => navigate("/mis-productos")}>Mis Productos</button>
                        <button onClick={() => navigate("/chats")}>Chats</button>
                        <button onClick={() => navigate("/publicaciones")}>Publicaciones</button>
                        {user?.rol === "admin" && <button onClick={() => navigate("/reportes")}>Reportes</button>}
                        <button onClick={handleLogout}>Cerrar sesión</button>
                    </div>
                </aside>

                <main className="menu-main">

                    {/* Publicar nuevo producto */}
                    <section className="publicar-producto-section">
                        <h2>Publicar Nuevo Producto</h2>
                        <form onSubmit={handlePublicarProducto} encType="multipart/form-data" className="publicar-producto-form">
                            <input type="text" name="titulo" placeholder="Título" required />
                            <textarea name="descripcion" placeholder="Descripción" required></textarea>
                            <input type="number" name="precio" placeholder="Precio" required />
                            <select name="categoria" required>
                                <option value="">Selecciona una categoría</option>                                
                                <option value="Tecnología">Tecnología</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Hogar">Hogar</option>
                                <option value="Juguetes">Juguetes</option>
                                <option value="Libros">Libros</option>
                                <option value="Otros">Otros</option>
                            </select>
                            <input type="file" name="imagen" accept="image/*" required />
                            <button type="submit">Publicar Producto</button>
                        </form>
                    </section>

                    {/* Productos */}
                    <section className="productos-section">
                        <h2>Productos</h2>
                        <div className="productos-grid">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="producto-card">
                                    <img src={`http://localhost:5000/uploads/${p.imagen}`} alt={p.titulo} />
                                    <h3>{p.titulo}</h3>
                                    <p className="precio">{p.precio}€</p>
                                    <p className="descripcion">{p.descripcion}</p>
                                    <p className="autor">Publicado por: {p.nombre_usuario}</p>
                                    <ValorarProducto productoId={p.id} usuarioProductoId={p.usuario_id} />
                                    <MostrarValoraciones productoId={p.id} />
                                    <div className="admin-actions">
                                        {/* Si NO es el usuario dueño, muestra botón contactar */}
                                        {user?.id !== p.usuario_id && (
                                            <>
                                                <button onClick={() => handleContact(p.usuario_id, p.nombre_usuario)}>Contactar</button>
                                                <button className="reportar-btn" onClick={() => navigate(`/reportar-producto/${p.id}`)}>
                                                    Reportar
                                                </button>
                                            </>
                                        )}

                                        {/* Si es el usuario dueño, muestra botón editar */}
                                        {user?.id === p.usuario_id && (
                                            <button onClick={() => openEditModal(p)}>Editar</button>
                                        )}

                                        {/* Si es admin, muestra botón eliminar */}
                                        {user?.rol === "admin" && (
                                            <button onClick={() => handleDeleteProduct(p.id)}>Eliminar</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Publicar nueva publicación */}
                    <section className="publicar-publicacion-section">
                        <h2>Crear nueva publicación</h2>
                        <form onSubmit={handlePublicar} className="publicar-publicacion-form">
                            <textarea
                                name="contenido"
                                placeholder="¿Qué estás pensando?"
                                required
                            />
                            <button type="submit">Publicar</button>
                        </form>
                    </section>

                    {/* Tablón de publicaciones */}
                    <section className="publicaciones-section">
                        <h2>Publicaciones</h2>
                        <div className="publicaciones-list">
                            {posts.map(post => (
                                <div key={post.id} className="publicacion-card">
                                    <h3>{post.titulo}</h3>
                                    <p>{post.contenido}</p>
                                    <span className="autor">{post.usuario_nombre}</span>
                                    {user?.rol === "admin" && (
                                        <button onClick={() => handleDeletePost(post.id)}>Eliminar</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                </main>

                <aside className="menu-sidebar-right">
                    <h3>Filtros</h3>
                    <div className="filtros-group">
                        <label>Categoría:</label>
                        <select
                            value={filters.category}
                            onChange={e => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="all">Todas</option>
                            <option value="Tecnología">Tecnología</option>
                            <option value="Ropa">Ropa</option>
                            <option value="Hogar">Hogar</option>
                            <option value="Juguetes">Juguetes</option>
                            <option value="Libros">Libros</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                    <div className="filtros-group">
                        <label>Precio hasta:</label>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={filters.priceRange[1]}
                            onChange={e => setFilters({ ...filters, priceRange: [0, +e.target.value] })}
                        />
                        <span>{filters.priceRange[1]}€</span>
                    </div>
                    <div className="filtros-group">
                        <button onClick={() => setApplyFilters(true)}>Aplicar Filtros</button>
                        <button onClick={() => {
                            setFilters({ category: "all", priceRange: [0, 1000] });
                            setApplyFilters(false);
                        }}>Eliminar Filtros</button>
                    </div>
                </aside>
            </div>
            {
                editModalOpen && productoAEditar && (
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
                                    value={productoAEditar.categroria}
                                    onChange={(e) => setProductoAEditar({ ...productoAEditar, categoria: e.target.value })}
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    <option value="Tecnología">Tecnología</option>
                                    <option value="Ropa">Ropa</option>
                                    <option value="Hogar">Hogar</option>
                                    <option value="Juguetes">Juguetes</option>
                                    <option value="Libros">Libros</option>
                                    <option value="Otros">Otros</option>
                                </select>
                                <button type="submit" className="guardar-btn" onClick={handleUpdateProduct}> Guardar </button>
                                <button type="button" onClick={() => setEditModalOpen(false)}>Cancelar</button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
};
export default Menu;
