import './output.css'

import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import Router from "./Route.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={Router}/>
)
