import { Button, Form, Input, message, Modal, Select, Spin } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { getItem, setItem } from "../../utils/helper"
import { useDispatch, useSelector } from "react-redux"
import { useUpdateProfileMutation } from "../../config/redux/services/apiService"
import { setUser } from "../../config/redux/reducer/generalReducer"

const ProductItem = ({ onOrder, item, user }) => {
  return (
    <div class=" border rounded-lg">
      <img
        src={
          item.product_image_url ||
          "https://www.southernliving.com/thmb/_Msu9OCpvE-OUTRvfYxCIJyPbhE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/27196_AdaptiveCottage00006-2000-7702094217044ce4830a8adb0a69b6da.jpg"
        }
        alt=""
        className="h-52 w-full object-cover rounded-lg "
      />
      <div className=" p-4">
        <p className="font-bold mt-2 text-white">{item.product_name}</p>
        <ModalDetail onOrder={onOrder} item={item} user={user} />
      </div>
    </div>
  )
}

const ModalDetail = ({ onOrder, item, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <Button
        type="primary"
        className="bg-white text-purple-600  mt-4 w-full"
        onClick={() => showModal()}
      >
        {item.product_price} &#960;
      </Button>
      <Modal
        title={item.product_name}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <img
            src={
              item.product_image_url ||
              "https://www.southernliving.com/thmb/_Msu9OCpvE-OUTRvfYxCIJyPbhE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/27196_AdaptiveCottage00006-2000-7702094217044ce4830a8adb0a69b6da.jpg"
            }
            alt=""
            className="h-50 w-full object-cover rounded-lg "
          />

          {/* detail */}
          <div className="mt-4">
            <div className="">
              <p className="text-lg font-bold ">Deskripsi</p>
              <div
                className=" "
                dangerouslySetInnerHTML={{ __html: item.product_description }}
              ></div>
            </div>
          </div>
          <Button
            type="primary"
            className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white mt-4 w-full"
            onClick={() => {
              setIsModalOpen(false)
              onOrder(user)
            }}
          >
            Beli Sekarang
          </Button>
        </div>
      </Modal>
    </>
  )
}

export const ModalPembayaran = ({
  isLogin = false,
  loading = false,
  isNew = false,
  user,
  onKlikOk,
}) => {
  const dispatch = useDispatch()
  const { user: userData, token } = useSelector((state) => state.general)
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [provinsiData, setProvinsiData] = useState([])
  const [kabupatenData, setKabupatenData] = useState([])
  const [kecamatanData, setKecamatanData] = useState([])
  const [kelurahanData, setKelurahanData] = useState([])

  const [provinsiLoading, setProvinsiLoading] = useState(false)
  const [kabupatenLoading, setKabupatenLoading] = useState(false)
  const [kecamatanLoading, setKecamatanLoading] = useState(false)
  const [kelurahanLoading, setKelurahanLoading] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = (value) => {
    updateProfile({ ...userData, ...value })
      .then((res) => {
        if (res?.error) {
          return message.error("Profile Gagal Disimpan")
        }
        setIsModalOpen(false)
        message.success("Profile Berhasil Disimpan")
        dispatch(setUser({ ...userData, ...res?.data?.data }))
      })
      .catch((err) => {
        message.error("Profile Gagal Disimpan")
      })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const getProvinsi = () => {
    setProvinsiLoading(true)
    axios
      .get(
        "https://prodmainet.berkahlestarijaya.com/api/address/master/provinsi"
      )
      .then((res) => {
        setProvinsiLoading(false)
        setProvinsiData(res.data.data)
      })
      .catch((err) => {
        setProvinsiLoading(false)
      })
  }

  const getKabupaten = (prov_id) => {
    setKabupatenLoading(true)
    axios
      .get(
        "https://prodmainet.berkahlestarijaya.com/api/address/master/kabupaten/" +
          prov_id
      )
      .then((res) => {
        setKabupatenLoading(false)
        setKabupatenData(res.data.data)
      })
      .catch((err) => {
        setKabupatenLoading(false)
      })
  }

  const getKecamatan = (kab_id) => {
    setKecamatanLoading(true)
    axios
      .get(
        "https://prodmainet.berkahlestarijaya.com/api/address/master/kecamatan/" +
          kab_id
      )
      .then((res) => {
        setKecamatanLoading(false)
        setKecamatanData(res.data.data)
      })
      .catch((err) => {
        setKecamatanLoading(false)
      })
  }

  const getKelurahan = (kec_id) => {
    setKelurahanLoading(true)
    axios
      .get(
        "https://prodmainet.berkahlestarijaya.com/api/address/master/kelurahan/" +
          kec_id
      )
      .then((res) => {
        setKelurahanLoading(false)
        setKelurahanData(res.data.data)
      })
      .catch((err) => {
        setKelurahanLoading(false)
      })
  }

  useEffect(() => {
    if (isNew) {
      showModal()
      form.setFieldsValue(getItem("userDataBe"))
    }
  }, [isNew])

  useEffect(() => {
    getProvinsi()
  }, [])

  useEffect(() => {
    if (user) {
      getKabupaten(user?.provinsi_id)
      getKecamatan(user?.kabupaten_id)
      getKelurahan(user?.kecamatan_id)
      form.setFieldsValue(user)
    }
  }, [user])

  return (
    <>
      {!isLogin ? (
        <div className="flex items-center justify-between border border-white rounded-lg mt-8 p-4">
          <p className="font-bold text-white text-md">
            Silahkan Login Terlebih Dahulu
          </p>
          <Button
            type="primary"
            className="bg-white text-purple-600"
            onClick={() => {
              if (loading) return null
              onKlikOk()
            }}
          >
            {loading ? <Spin className="text-purple-600" /> : "Login"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between border border-white rounded-lg mt-8 p-4">
          <p className="font-bold text-white text-md">{userData?.username}</p>
          <Button
            type="primary"
            className="bg-white text-purple-600"
            onClick={() => onKlikOk()}
          >
            Logout
          </Button>
        </div>
      )}

      <Modal
        title={"Detail Pembelian"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <div className="mt-4">
            <span className="text-sm font-bold">Informasi Pengguna</span>
            <Form
              form={form}
              layout="vertical"
              // initialValues={user}
              className="mt-4"
              onFinish={(value) => handleOk(value)}
            >
              <Form.Item label="Username" name={"username"}>
                <Input placeholder="Input username" readOnly />
              </Form.Item>
              <Form.Item
                label="Nama Lengkap"
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Nama Lengkap Tidak Boleh Kosong",
                  },
                ]}
              >
                <Input placeholder="Input Nama Lengkap" />
              </Form.Item>
              <Form.Item
                label="Telepon/No. hp"
                name={"telepon"}
                rules={[
                  {
                    required: true,
                    message: "Telepon Tidak Boleh Kosong",
                  },
                ]}
              >
                <Input placeholder="Input Telepon/No. hp" />
              </Form.Item>
              <Form.Item
                label="Email"
                name={"email"}
                rules={[
                  {
                    required: true,
                    message: "Email Tidak Boleh Kosong",
                  },
                ]}
              >
                <Input placeholder="Input email" />
              </Form.Item>
              <Form.Item
                label="Alamat"
                name={"alamat"}
                rules={[
                  {
                    required: true,
                    message: "Alamat Tidak Boleh Kosong",
                  },
                ]}
              >
                <Input placeholder="Input alamat" />
              </Form.Item>
              <Form.Item
                label="Provinsi"
                name={"provinsi_id"}
                rules={[
                  {
                    required: true,
                    message: "Provinsi Tidak Boleh Kosong",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Provinsi"
                  loading={provinsiLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                  onChange={(val) => getKabupaten(val)}
                >
                  {provinsiData &&
                    provinsiData.map((item) => (
                      <Select.Option key={item.pid} value={item.pid}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Kota/Kabupaten"
                name={"kabupaten_id"}
                rules={[
                  {
                    required: true,
                    message: "Kota/Kabupaten Tidak Boleh Kosong",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Kota/Kabupaten"
                  loading={kabupatenLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                  onChange={(val) => getKecamatan(val)}
                >
                  {kabupatenData &&
                    kabupatenData.map((item) => (
                      <Select.Option key={item.pid} value={item.pid}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Kecamatan"
                name={"kecamatan_id"}
                rules={[
                  {
                    required: true,
                    message: "Kecamatan Tidak Boleh Kosong",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Kecamatan"
                  loading={kecamatanLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                  onChange={(val) => getKelurahan(val)}
                >
                  {kecamatanData &&
                    kecamatanData.map((item) => (
                      <Select.Option key={item.pid} value={item.pid}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Kelurahan"
                name={"kelurahan_id"}
                rules={[
                  {
                    required: true,
                    message: "Kelurahan Tidak Boleh Kosong",
                  },
                ]}
              >
                <Select
                  placeholder="Pilih Kelurahan"
                  loading={kelurahanLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children?.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                >
                  {kelurahanData &&
                    kelurahanData.map((item) => (
                      <Select.Option key={item.pid} value={item.pid}>
                        {item.nama}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Form>
          </div>

          <Button
            type="primary"
            className="bg-purple-600 text-white  mt-4 w-full"
            onClick={() => form.submit()}
            loading={isLoading}
          >
            Simpan Profile
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default ProductItem
