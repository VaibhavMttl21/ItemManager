import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AddItem from './pages/AddItem'
import ViewItems from './pages/ViewItems'
import ItemDetail from './pages/ItemDetail'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ViewItems />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </Layout>
  )
}

export default App