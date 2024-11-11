import {
  AppstoreOutlined,
  CloseCircleFilled,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Empty, Input, message, Pagination, Spin } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import ProductItem from "../components/ProductItem"
import { useSettings } from "../Context/SettingsContext"
import {
  createLog,
  getItem,
  onCancel,
  onError,
  onReadyForServerApproval,
  onReadyForServerCompletion,
} from "../utils/helper"
import axiosInstance from "../services/axiosInstance"

function HomePage() {
  const dispatch = useDispatch()
  const { user: userData, token } = useSelector((state) => state.general)
  const { settings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const loadProduct = (
    url = "/api/product/list",
    perpage = 25,
    params = { page: currentPage }
  ) => {
    setLoading(true)
    axiosInstance
      .post(`${url}`, {
        perpage,
        ...params,
      })
      .then((res) => {
        console.log(res, "res")
        setLoading(false)
        setTotal(res?.data?.data?.total)
        setCurrentPage(res?.data?.data?.current_page)
        setProducts(res?.data?.data?.data || [])
      })
      .catch((err) => setLoading(false))
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadProduct(`/api/product/list`, 25, { search })
  }

  const handleChange = (page, pageSize = 25) => {
    loadProduct(`/api/product/list?page=${page}`, pageSize, {
      search,
      page,
    })
  }

  const orderProduct = async (memo, amount, paymentMetadata) => {
    const paymentData = { amount, memo, metadata: paymentMetadata }
    const callbacks = {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError,
    }
    const payment = await window.Pi.createPayment(paymentData, callbacks)
    createLog({ value: "Create Order Payment", body: JSON.stringify(payment) })
  }

  useEffect(() => {
    // if (!window.Pi) {
    //   return alert("Please open this app in the Pi Browser.")
    // }

    loadProduct()
  }, [])

  return (
    <div className="bg-purple-600 pb-20">
      <div className="p-4 sticky top-0 bg-purple-600 z-10">
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

        <div className="mt-8">
          <Input
            onPressEnter={() => handleChangeSearch()}
            suffix={
              isSearch ? (
                <CloseCircleFilled
                  onClick={() => {
                    loadProduct()
                    setSearch(null)
                    setIsSearch(false)
                  }}
                />
              ) : (
                <SearchOutlined onClick={() => handleChangeSearch()} />
              )
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="cari disini"
          />
        </div>
      </div>
      {/* {userData && <p>{JSON.stringify(userData)}</p>} */}
      {products && products.length > 0 ? (
        <div className="mb-20">
          <div className="grid grid-cols-2 gap-4 mt-4 p-4">
            {products &&
              products.map((item) => (
                <ProductItem
                  key={item.id}
                  item={item}
                  onOrder={(value) => {
                    if (!userData) {
                      return message.error("Anda Belum Login")
                    }

                    orderProduct(item.product_name, item?.product_price || 1, {
                      productId: item.id,
                    })
                  }}
                  user={userData || getItem("userDataBe")}
                />
              ))}
          </div>
          {total > 25 && (
            <div className="mt-6 w-full mx-auto text-center">
              <Pagination
                align="center"
                current={currentPage}
                total={total}
                pageSize={25}
                onChange={handleChange}
                className="text-purple-200"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="h-[80vh] flex items-center justify-center">
          {loading ? <Spin /> : <Empty description="Tidak ada produk disini" />}
        </div>
      )}

      {/* bottom tab */}
      <div className="max-w-lg mx-auto fixed bottom-0 left-0 right-0 bg-white shadow bg-purple-600">
        <div className="flex justify-between  bg-purple-600">
          <Link to="/" className="flex-1 text-center py-3 hover:bg-gray-100">
            <span>
              <HomeOutlined className="text-white" />
            </span>
            <br />
            <span className="text-sm text-white">Home</span>
          </Link>
          <Link
            to="/category"
            className="flex-1 text-center py-3 hover:bg-gray-100"
          >
            <span>
              <AppstoreOutlined />
            </span>
            <br />
            <span className="text-sm">Category</span>
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

export default HomePage
