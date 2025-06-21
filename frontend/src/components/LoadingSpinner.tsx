const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }} />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner