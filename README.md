# ÓRBITA

Visualización de un sistema multiagente como constelación: cada agente es un planeta, cada mensaje es un proyectil ámbar que cruza el vacío.

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
- Haz clic en un planeta para abrir su terminal

## Build

```bash
npm run build
npm run preview
```

## Stack

Vite + React + TypeScript. El grafo y los proyectiles son SVG; el fondo de estrellas es Canvas. Sin librerías de UI.
