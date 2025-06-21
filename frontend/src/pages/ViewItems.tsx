import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllItems } from '../services/api'
import ItemCard from '../components/ItemCard'
import LoadingSpinner from '../components/LoadingSpinner'

interface Item {
  id: string
  name: string
  type: string
  description: string
  coverImage: string
  images: string[]
  createdAt: string
}

const ViewItems = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const itemTypes = ['All', 'Shirt', 'Pant', 'Shoes', 'Sports Gear', 'Accessories', 'Electronics', 'Books', 'Home & Garden', 'Other']

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const data = await getAllItems()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === '' || selectedType === 'All' || item.type === selectedType
    return matchesSearch && matchesType
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Items Inventory</h1>
          <p className="mt-2 text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your inventory
          </p>
        </div>
        <Link
          to="/add-item"
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0 w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Item</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field"
              >
                {itemTypes.map(type => (
                  <option key={type} value={type === 'All' ? '' : type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {items.length === 0 ? 'No items yet' : 'No items found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {items.length === 0 
              ? 'Get started by adding your first item to the inventory.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {items.length === 0 && (
            <Link to="/add-item" className="btn-primary">
              Add Your First Item
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewItems