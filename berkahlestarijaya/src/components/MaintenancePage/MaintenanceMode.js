import React from "react"
import { useSettings } from "../../Context/SettingsContext"
import MaintenancePage from "."
import { Spin } from "antd"

const MaintenanceMode = ({ children }) => {
  const { settings, loading } = useSettings()

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4 bg-purple-600">
        <Spin />
      </div>
    )
  }

  if (settings?.maintenance_mode) {
    return (
      <MaintenancePage
        title={settings.maintenance_title || "Site Under Maintenance"}
        message={
          settings.maintenance_message ||
          "We are currently performing maintenance. Please check back soon."
        }
      />
    )
  }

  return children
}

export default MaintenanceMode
