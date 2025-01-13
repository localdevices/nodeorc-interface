# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

In case reproductivity is required, the template was set up as follows:

```shell
# Create new Vite project
npm create vite@latest portal

# Navigate to project directory
cd portal

# Install dependencies
npm install

# Get axios dependency
npm install axios
npm install react-router-dom
# Start dev server
npm run dev
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh