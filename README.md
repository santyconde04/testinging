# ÓRBITA

Visualización de un sistema multiagente como grafo: nodos de color simple, aristas y paquetes de datos que viajan entre agentes.

La demo simula un **planificador de viajes a Lisboa** con seis agentes en español: orquestador, vuelos, hoteles, actividades, traslados y presupuesto.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

## Controles

- **Iniciar simulación** — reproduce el flujo completo
- **Pausar / Continuar** — congela proyectiles y el stream de terminal
- **Reiniciar** — vuelve al reposo
- Haz clic en un nodo para abrir su terminal

## Build

```bash
npm run build
npm run preview
```

## Stack

Vite + React + TypeScript. Grafo y proyectiles en SVG; fondo HUD en Canvas. Sin librerías de UI.
