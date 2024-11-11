import {
  AppstoreOutlined,
  HomeOutlined,
  RightCircleOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Button, message } from "antd"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setToken, setUser } from "../config/redux/reducer/generalReducer"
import {
  createLog,
  onIncompletePaymentFound,
  removeItem,
  setItem,
} from "../utils/helper"
import { ModalPembayaran } from "../components/ProductItem"
import { useLoginMutation } from "../config/redux/services/apiService"
import { useSettings } from "../Context/SettingsContext"

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [loadingAuth, setLoadingAuth] = useState(false)
  const { user: userData } = useSelector((state) => state.general)

  const [login] = useLoginMutation()
  const loginBE = (body) => {
    setLoadingAuth(true)
    login(body)
      .then(({ error, data }) => {
        if (error) {
          setLoadingAuth(false)
          message.error("Login Gagal")
          return
        }
        setLoadingAuth(false)
        const user = data?.data?.data?.user
        if (user) {
          dispatch(setToken(data?.data?.data?.access_token))
          dispatch(setUser({ ...user, uid: body?.uid }))
          setItem("access_token", data?.data?.data?.access_token)
          setItem("userDataBe", JSON.stringify({ ...user, uid: body?.uid }))
        }
      })
      .catch((err) => {})
  }

  const signIn = async () => {
    setLoadingAuth(true)
    const scopes = ["username", "payments", "wallet_address"]
    const authResult = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    )
    // const authResult = { user: { username: "Asepsuharman" } }
    setLoadingAuth(false)
    if (authResult) {
      loginBE(authResult?.user)
      createLog({ value: "Log Signin", body: JSON.stringify(authResult) })
      setItem("username", authResult?.user?.username || null)
    }
  }
  return (
    <div>
      <div className="p-4 sticky top-0 bg-purple-600">
        <div className="text-center font-bold text-lg">
          <img
            src={settings?.logo || require("../assets/img/logo.jpeg")}
            alt=""
            className="w-10 h-10 rounded-full mx-auto"
          />
          <p className="ml-3 text-white">
            {settings?.app_name || "Berkah Lestari Jaya"}
          </p>
        </div>

        {/* <ModalPembayaran
          isLogin={userData ? true : false}
          user={userData}
          isNew={userData?.profile_complete == 0}
          // loading={loadingAuth}
          onKlikOk={() => {
            if (userData) {
              removeItem("access_token")
              removeItem("userDataBe")
              dispatch(setToken(null))
              return dispatch(setUser(null))
            }
          }}
        /> */}
      </div>

      {userData && (
        <div className="px-4 mt-16">
          {/* item update card profile */}
          <Link to="/update-profile">
            <div className="mt-8 flex items-center justify-between border border-white rounded-lg p-4 shadow-lg">
              <p className="text-white">Ubah Profil</p>
              <span>
                <RightCircleOutlined className="text-white" />
              </span>
            </div>
          </Link>

          {/* item transaction history */}
          <Link to="/daftar-transaksi">
            <div className="mt-4 flex items-center justify-between border border-white rounded-lg p-4 shadow-lg">
              <p className="text-white">Daftar Transaksi</p>
              <span>
                <RightCircleOutlined className="text-white" />
              </span>
            </div>
          </Link>
        </div>
      )}

      <div class="max-w-lg mx-auto fixed bottom-0 left-0 right-0 bg-purple-600 shadow">
        <div className="p-4 mb-8">
          <ModalPembayaran
            isLogin={userData ? true : false}
            user={userData}
            isNew={userData?.profile_complete == 0}
            loading={loadingAuth}
            onKlikOk={() => {
              if (userData) {
                removeItem("access_token")
                removeItem("userDataBe")
                dispatch(setToken(null))
                return dispatch(setUser(null))
              }
              return signIn()
            }}
          />
        </div>
        <div class="flex justify-between">
          <Link to="/" class="flex-1 text-center py-3 hover:bg-gray-100">
            <span>
              <HomeOutlined />
            </span>
            <br />
            <span class="text-sm">Home</span>
          </Link>
          <Link
            to="/category"
            class="flex-1 text-center py-3 hover:bg-gray-100"
          >
            <span>
              <AppstoreOutlined />
            </span>
            <br />
            <span class="text-sm ">Category</span>
          </Link>
          <Link
            to="/profile"
            className="flex-1 text-center py-3 hover:bg-gray-100"
          >
            <span>
              <UserOutlined className="text-white" />
            </span>
            <br />
            <span className="text-sm text-white">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
