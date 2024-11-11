import React from "react"
import { WrenchIcon, ClockIcon } from "lucide-react"

const MaintenancePage = ({ title, message }) => {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <WrenchIcon className="w-16 h-16 text-purple-500 animate-spin-slow" />
            <ClockIcon className="w-8 h-8 text-purple-300 absolute -top-2 -right-2" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-purple-900 mb-4">{title}</h1>

        <p className="text-purple-700 mb-6">{message}</p>

        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-md">
            <h2 className="font-semibold text-purple-700 mb-2">
              Estimasi Waktu
            </h2>
            <p className="text-purple-600">
              Sistem akan kembali normal dalam waktu 24 jam
            </p>
          </div>

          <div className="bg-purple-50/50 p-4 rounded-md">
            <h2 className="font-semibold text-purple-700 mb-2">
              Butuh Bantuan?
            </h2>
            <p className="text-purple-600">
              Hubungi tim support kami
              {/* <a
                href="mailto:support@example.com"
                className="text-purple-500 hover:text-purple-600 underline"
              >
                support@example.com
              </a> */}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaintenancePage
