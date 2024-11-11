import { ArrowLeftOutlined } from "@ant-design/icons"
import { Empty, Pagination, Spin } from "antd"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useGetListTransactionMutation } from "../config/redux/services/apiService"
import { maskString } from "../utils/helper"

function TransactionHistory() {
  // const dispatch = useDispatch()
  // const navigate = useNavigate()
  const [getListTransaction, { isLoading }] = useGetListTransactionMutation()

  const [transactions, setTransactionLists] = useState([])
  const [total, setTotal] = useState(0)
  // const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const loadProduct = (perpage = 20, params = { page: currentPage }) => {
    getListTransaction({
      perpage,
      ...params,
    })
      .then((res) => {
        setTotal(res?.data?.data?.total)
        setCurrentPage(res?.data?.data?.current_page)
        setTransactionLists(res?.data?.data?.data || [])
      })
      .catch((err) => {})
  }

  // const handleChangeSearch = () => {
  //   loadProduct(20, { search })
  // }

  const handleChange = (page, pageSize = 20) => {
    loadProduct(pageSize, {
      page,
    })
  }

  useEffect(() => {
    loadProduct()
  }, [])

  return (
    <div className="bg-burple-600 h-screen">
      <div className="p-4 border-b border-white sticky top-0 bg-purple-600">
        <Link to="/profile">
          <div className="flex items-center font-bold text-lg">
            <ArrowLeftOutlined className=" text-white" />
            <p className="ml-3 text-white">Daftar Transaksi</p>
          </div>
        </Link>
      </div>

      <div className="my-8 px-4 bg-purple-600">
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-purple-600 border border-white mb-4 rounded-lg"
            >
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm text-white">TRX ID</p>
                      <p className="font-mono text-white">
                        {maskString(transaction.trx_id)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-white">Tanggal</p>
                      <p className="text-white">{transaction.created_at}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm text-white">Jumlah</p>
                      <p className="font-semibold text-white">
                        {transaction.amount} &#960;
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-white">Deskripsi</p>
                      <p className="text-white">{transaction.product?.name}</p>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          transaction.status === "complete"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-[80vh] flex items-center justify-center">
            {isLoading ? (
              <Spin />
            ) : (
              <Empty description="Tidak ada transaksi disini" />
            )}
          </div>
        )}

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
    </div>
  )
}

export default TransactionHistory
