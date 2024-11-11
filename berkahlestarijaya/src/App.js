import { ConfigProvider } from "antd"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import CategoryPage from "./Pages/Category"
import CategoryDetail from "./Pages/CategoryDetail"
import HomePage from "./Pages/Home"
import ProfilePage from "./Pages/Profile"
import { useEffect } from "react"
import UpdateProfile from "./Pages/UpdateProfile"
import TransactionHistory from "./Pages/TransactionHistory"
import { SettingsProvider } from "./Context/SettingsContext"
import MetaTags from "./components/MetaTags"
import MaintenanceMode from "./components/MaintenancePage/MaintenanceMode"

function App() {
  // const createLog = (body) => {
  //   axios
  //     .post("https://prodmainet.berkahlestarijaya.com/api/log/create", body)
  //     .then((res) => {
  //       console.log("ok")
  //     })
  // }

  // const loginBE = (body) => {
  //   axios
  //     .post("https://prodmainet.berkahlestarijaya.com/api/auth/login", body)
  //     .then((res) => {
  //       setItem("userDataBe", JSON.stringify(res.data?.data?.data?.user || {}))
  //     })
  //     .catch((err) => {})
  // }

  // const signIn = async () => {
  //   const scopes = ["username", "payments", "wallet_address"]
  //   const authResult = await window.Pi.authenticate(
  //     scopes,
  //     onIncompletePaymentFound,
  //     { forceNew: true }
  //   )
  //   createLog({ value: "Log Signin", body: JSON.stringify(authResult) })
  //   setItem("username", authResult?.user?.username || null)
  //   loginBE(authResult.user)
  // }

  // const onIncompletePaymentFound = (payment) => {
  //   createLog({
  //     value: "onIncompletePaymentFound",
  //     body: JSON.stringify(payment),
  //   })
  //   // return axiosClient.post('/payments/incomplete', {payment});
  // }

  // useEffect(() => {
  //   signIn()
  // }, [])

  return (
    <div className="max-w-lg mx-auto border-x h-screen bg-purple-600">
      <SettingsProvider>
        <MetaTags />
        <MaintenanceMode>
          <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: "#FFFFFF",
              },
            }}
          >
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route
                  path="/category/:category_id"
                  element={<CategoryDetail />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route
                  path="/daftar-transaksi"
                  element={<TransactionHistory />}
                />
              </Routes>
            </Router>
          </ConfigProvider>
        </MaintenanceMode>
      </SettingsProvider>
    </div>
  )
}

export default App
