import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'


// Cross-fade route changes via the View Transitions API where supported
// (motion.css styles ::view-transition-*; unsupported browsers just swap).
const router = createRouter({ routeTree, defaultViewTransition: true })

function App() {
  return <RouterProvider router={router} />
}

declare module '@tanstack/react-router' {
  interface Register {
    routes: typeof router
  }
}

export default App


