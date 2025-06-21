import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { getItemById, sendEnquiry } from '../services/api'
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

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      fetchItem(id)
    }
  }, [id])

  const fetchItem = async (itemId: string) => {
    try {
      setLoading(true)
      const data = await getItemById(itemId)
      setItem(data)
    } catch (error) {
      console.error('Error fetching item:', error)
      toast.error('Failed to load item details')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleEnquiry = async () => {
    if (!item) return

    try {
      setEnquiryLoading(true)
      await sendEnquiry(item.id)
      toast.success('Enquiry sent successfully! We will get back to you soon.')
    } catch (error) {
      console.error('Error sending enquiry:', error)
      toast.error('Failed to send enquiry. Please try again.')
    } finally {
      setEnquiryLoading(false)
    }
  }

  const allImages = item ? [item.coverImage, ...item.images] : []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Items
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Items</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Carousel */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={allImages[currentImageIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>{item.type}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested in this item?</h3>
              <p className="text-gray-600 mb-4">
                Send an enquiry to get more information about this item. We'll get back to you as soon as possible.
              </p>
              <button
                onClick={handleEnquiry}
                disabled={enquiryLoading}
                className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
              >
                {enquiryLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                <span>{enquiryLoading ? 'Sending Enquiry...' : 'Send Enquiry'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail