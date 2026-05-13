import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'


const router = createRouter({routeTree})

function App() {
  return <RouterProvider router={router} />
}

declare module '@tanstack/react-router' {
  interface Register {
    routes: typeof router
  }
}

export default App


