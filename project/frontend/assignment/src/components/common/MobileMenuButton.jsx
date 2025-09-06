import { Bars3Icon } from '@heroicons/react/24/outline'

const MobileMenuButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
      onClick={onClick}
    >
      <Bars3Icon className="h-6 w-6" />
    </button>
  )
}

export default MobileMenuButton
