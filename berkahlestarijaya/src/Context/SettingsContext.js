import React, { createContext, useContext, useEffect, useState } from "react"
import axiosInstance from "../services/axiosInstance"

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get("/api/settings")
      setSettings(response.data.data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SettingsContext.Provider
      value={{ settings, loading, reloadSettings: fetchSettings }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
