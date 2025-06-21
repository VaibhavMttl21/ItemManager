import { Link } from 'react-router-dom'
import { Calendar, Tag } from 'lucide-react'

interface Item {
  id: string
  name: string
  type: string
  description: string
  coverImage: string
  images: string[]
  createdAt: string
}

interface ItemCardProps {
  item: Item
}

const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <Link to={`/items/${item.id}`} className="block group">
      <div className="card group-hover:shadow-lg transition-all duration-200 transform group-hover:-translate-y-1">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={item.coverImage}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {item.name}
          </h3>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
            <Tag className="h-3 w-3" />
            <span>{item.type}</span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            {item.images.length > 0 && (
              <span>{item.images.length + 1} images</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ItemCard