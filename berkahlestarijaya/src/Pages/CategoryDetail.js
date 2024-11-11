import {
  ArrowLeftOutlined,
  CloseCircleFilled,
  SearchOutlined,
} from "@ant-design/icons"
import { Empty, Input, message, Pagination, Spin } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import ProductItem from "../components/ProductItem"
import axiosInstance from "../services/axiosInstance"
import {
  createLog,
  getItem,
  onCancel,
  onError,
  onReadyForServerApproval,
  onReadyForServerCompletion,
} from "../utils/helper"

function CategoryDetail() {
  const { user: userData } = useSelector((state) => state.general)
  const param = useParams()
  const [loading, setLoading] = useState(false)
  const [categoryName, setCategoryName] = useState(null)
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // const createUserBe = (body) => {
  //   axios
  //     .post("https://prodmainet.berkahlestarijaya.com/api/auth/createUser", body)
  //     .then((res) => {
  //       // alert("success register")
  //     })
  //     .catch((err) => {
  //       // alert("error register" + JSON.stringify(err.response))
  //     })
  // }

  const loadProduct = (
    url = "/api/product/list/category/" + param?.category_id,
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
        setProducts(res?.data?.data?.products?.data || [])
        setCategoryName(res?.data?.data?.category_name || [])
      })
      .catch((err) => setLoading(false))
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadProduct(`/api/product/list/category`, 25, { search })
  }

  const handleChange = (page, pageSize = 25) => {
    loadProduct(`/api/product/list/category/?page=${page}`, pageSize, {
      search,
      page,
    })
  }

  // order
  const orderProduct = async (memo, amount, paymentMetadata) => {
    if (!userData) {
      return message.error("Anda Belum Login")
    }
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
    loadProduct()
  }, [])

  // return (
  //   <div className="max-w-lg mx-auto border-x h-screen flex justify-center items-center">
  //     <div className=" bg-white p-4">
  //       {/* <div className="flex items-center font-bold text-lg mx-auto">
  //         <img
  //           src="https://i.ibb.co/ZcB9pKt/logo.jpg"
  //           alt=""
  //           className="w-10 h-10 rounded-full"
  //         />
  //         <p className="ml-3">Berkah Lestari Jaya</p>
  //       </div> */}
  //       <div className="mt-8">
  //         <h1 className="font-bold">
  //           Dimohon untuk segera menyelesaikan pembayaran DP 50% Yang telah
  //           disepakati sebelumnya, untuk melanjutkan proses development.
  //         </h1>
  //       </div>
  //     </div>
  //   </div>
  // )

  return (
    <div className="bg-purple-600">
      <div className="p-4 sticky top-0 bg-purple-600 z-10">
        <Link to="/category">
          <div className="flex items-center font-bold text-lg">
            <ArrowLeftOutlined className=" text-white" />
            <p className="ml-3 text-white">
              {categoryName || "Berkah Lestari Jaya"}
            </p>
          </div>
        </Link>

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
        <div>
          <div className="grid grid-cols-2 gap-4 mt-4 p-4">
            {products &&
              products.map((item) => (
                <ProductItem
                  key={item.id}
                  item={item}
                  onOrder={(value) => {
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
      {/* <div class="max-w-lg mx-auto fixed bottom-0 left-0 right-0 bg-white shadow">
        <div class="flex justify-between">
          <a href="/" class="flex-1 text-center py-3 hover:bg-gray-100">
            <span>
              <HomeOutlined />
            </span>
            <br />
            <span class="text-sm">Home</span>
          </a>
          <a href="/category" class="flex-1 text-center py-3 hover:bg-gray-100">
            <span>
              <AppstoreOutlined />
            </span>
            <br />
            <span class="text-sm">Category</span>
          </a>
          <a href="/profile" class="flex-1 text-center py-3 hover:bg-gray-100">
            <span>
              <UserOutlined />
            </span>
            <br />
            <span class="text-sm">Profile</span>
          </a>
        </div>
      </div> */}
    </div>
  )
}

export default CategoryDetail
