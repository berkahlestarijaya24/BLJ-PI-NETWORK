import {
  AppstoreOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Empty, Spin } from "antd"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSettings } from "../Context/SettingsContext"
import axiosInstance from "../services/axiosInstance"

const CategoryPage = () => {
  const { settings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [listCategory, setListCategory] = useState([])

  const loadCategory = (url = "/api/product/category") => {
    setLoading(true)
    axiosInstance
      .get(`${url}`)
      .then((res) => {
        setLoading(false)
        setListCategory(res?.data?.data || [])
      })
      .catch((err) => setLoading(false))
  }

  useEffect(() => {
    loadCategory()
  }, [])

  return (
    <div className="bg-purple-600 pb-20">
      {/* navbar */}
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
      </div>
      {/* end navbar */}

      <div className="mx-4 mt-8">
        {!loading && <h1 className="mb-4 text-white">Daftar Kategori</h1>}

        {listCategory && listCategory.length > 0 ? (
          listCategory.map((item) => (
            <Link key={item?.id} to={`/category/${item.id}`}>
              <div className="border border-white p-3 rounded-lg flex items-center justify-between mb-4">
                <p className=" text-white">{item?.category_name}</p>
                <ArrowRightOutlined className="text-white" />
              </div>
            </Link>
          ))
        ) : (
          <div className="h-[80vh] flex items-center justify-center">
            {loading ? (
              <Spin />
            ) : (
              <Empty description="Tidak ada produk disini" />
            )}
          </div>
        )}
      </div>

      {/* bottom tab */}
      <div class="max-w-lg mx-auto fixed bottom-0 left-0 right-0 bg-purple-600 shadow">
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
              <AppstoreOutlined className="text-white" />
            </span>
            <br />
            <span class="text-sm text-white">Category</span>
          </Link>
          <Link
            to="/profile"
            className="flex-1 text-center py-3 hover:bg-gray-100"
          >
            <span>
              <UserOutlined />
            </span>
            <br />
            <span className="text-sm">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
