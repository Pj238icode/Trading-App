import TreadingHistory from '../Portfilio/TreadingHistory'

const Activity = () => {
  return (
    <div className="px-6 md:px-20 py-10 bg-white min-h-screen rounded-xl shadow-sm">
      <p className="pb-10 text-3xl font-semibold text-gray-900">Trading History</p>
      <div className="bg-white rounded-lg shadow-md p-4">
        <TreadingHistory />
      </div>
    </div>
  )
}

export default Activity
