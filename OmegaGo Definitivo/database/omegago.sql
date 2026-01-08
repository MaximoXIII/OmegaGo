-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-05-2025 a las 09:07:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `omegago`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `creado_en` datetime DEFAULT current_timestamp(),
  `usuario1_id` int(11) DEFAULT NULL,
  `usuario2_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `chats`
--

INSERT INTO `chats` (`id`, `creado_en`, `usuario1_id`, `usuario2_id`) VALUES
(1, '2025-05-16 09:18:23', 7, 6),
(2, '2025-05-16 11:19:58', 5, 7),
(3, '2025-05-20 23:30:51', 5, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `id` int(11) NOT NULL,
  `emisor_id` int(11) DEFAULT NULL,
  `receptor_id` int(11) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensajes`
--

INSERT INTO `mensajes` (`id`, `emisor_id`, `receptor_id`, `mensaje`, `fecha_envio`) VALUES
(1, 7, 6, 'Hola! Estoy interesado en el producto!', '2025-05-16 07:18:45'),
(2, 7, 6, 'Esa Ram tiene buena pinta!', '2025-05-16 07:31:28'),
(3, 5, 7, 'Querido usuario tenga cuidado con lo que publioca o dice, si nos llegan mas reportes sera usted baneado del sistema', '2025-05-16 09:20:21'),
(4, 7, 5, 'Nooooo', '2025-05-16 09:21:42'),
(5, 6, 7, 'Si! esta practicamente sin usar, son 32 GB DDR5', '2025-05-16 09:22:19'),
(6, 5, 6, 'Es tu primera vez?', '2025-05-20 21:31:02'),
(7, 6, 5, 'Si!', '2025-05-20 21:31:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `imagen` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `categoria`, `descripcion`, `fecha_creacion`, `imagen`, `precio`, `titulo`, `usuario_id`) VALUES
(1, 'tecnologia', 'Pedazo de Ram', '2025-05-10 13:39:01', '1746877141449.jpg', 100.00, 'RAM Corsair', 6),
(4, 'Juguetes', 'kong kong', '2025-05-13 11:30:17', '1747128617098.jpg', 17.00, 'Kong para perro', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id` int(11) NOT NULL,
  `contenido` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`id`, `contenido`, `fecha_creacion`, `usuario_id`) VALUES
(2, 'Este es el primer mensaje en omega go!', '2025-05-13 09:07:02', 7),
(4, 'Vamos!!', '2025-05-16 07:34:30', 6),
(5, 'Ok!', '2025-05-20 21:30:42', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `id` int(11) NOT NULL,
  `fecha_reporte` timestamp NOT NULL DEFAULT current_timestamp(),
  `motivo` text DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `usuario_reportado_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reportes`
--

INSERT INTO `reportes` (`id`, `fecha_reporte`, `motivo`, `producto_id`, `usuario_id`, `usuario_reportado_id`) VALUES
(1, '2025-05-16 08:40:56', 'Este usuario me cae mal', NULL, 6, 7),
(2, '2025-05-16 09:17:37', 'Es una estafa', 4, 6, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `dni` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` enum('usuario','admin') DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `dni`, `email`, `fecha_nacimiento`, `fecha_registro`, `nombre`, `password`, `rol`) VALUES
(5, '12345678A', 'admin@omegago.com', '1980-12-20', '2025-05-09 08:36:57', 'Admin OmegaGo', '$2b$10$GEcH/T0Uwv8xe64KgfZBS.0hef4Q7K0UnYIH2CkMtgwwvq3UcKQAW', 'admin'),
(6, '75168165W', 'Davidmaldont@gmail.com', '1988-09-20', '2025-05-10 11:01:47', 'David Maldonado', '$2b$10$w1SUSehqmQZ8mZiaFgG0k.4LTotxi70cihb/xGWx9sm0pu.I1KwVq', 'usuario'),
(7, '12345678W', 'pepito@gmail.com', '1980-09-10', '2025-05-13 08:48:01', 'Pepito Perez', '$2b$10$LRc3bKfDbR0i4E6uPi0vFux6LvtH2gOH0s1Y9y/dX/GV3C0/2Yvk2', 'usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoraciones`
--

CREATE TABLE `valoraciones` (
  `id` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_valoracion` timestamp NOT NULL DEFAULT current_timestamp(),
  `producto_id` int(11) DEFAULT NULL,
  `puntuacion` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `valoraciones`
--

INSERT INTO `valoraciones` (`id`, `comentario`, `fecha_valoracion`, `producto_id`, `puntuacion`, `usuario_id`) VALUES
(2, 'Buen producto', '2025-05-20 07:18:25', 1, 4, 7),
(3, 'Muy util', '2025-05-20 07:21:43', 4, 5, 6);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario1_id` (`usuario1_id`),
  ADD KEY `usuario2_id` (`usuario2_id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emisor_id` (`emisor_id`),
  ADD KEY `receptor_id` (`receptor_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `usuario_reportado_id` (`usuario_reportado_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`usuario1_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`usuario2_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`emisor_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`receptor_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `reportes_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `reportes_ibfk_3` FOREIGN KEY (`usuario_reportado_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `valoraciones`
--
ALTER TABLE `valoraciones`
  ADD CONSTRAINT `valoraciones_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `valoraciones_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
