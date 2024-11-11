import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Select } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useUpdateProfileMutation } from "../config/redux/services/apiService"
import { setUser } from "../config/redux/reducer/generalReducer"
import axiosInstance from "../services/axiosInstance"

function UpdateProfile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user: userData } = useSelector((state) => state.general)

  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const [form] = Form.useForm()
  const [provinsiData, setProvinsiData] = useState([])
  const [kabupatenData, setKabupatenData] = useState([])
  const [kecamatanData, setKecamatanData] = useState([])
  const [kelurahanData, setKelurahanData] = useState([])

  const [provinsiLoading, setProvinsiLoading] = useState(false)
  const [kabupatenLoading, setKabupatenLoading] = useState(false)
  const [kecamatanLoading, setKecamatanLoading] = useState(false)
  const [kelurahanLoading, setKelurahanLoading] = useState(false)

  const handleOk = (value) => {
    updateProfile({ ...userData, ...value })
      .then((res) => {
        if (res?.error) {
          return message.error("Profile Gagal Disimpan")
        }
        message.success("Profile Berhasil Disimpan")
        dispatch(setUser({ ...userData, ...res?.data?.data }))
        return navigate("/profile")
      })
      .catch((err) => {
        message.error("Profile Gagal Disimpan")
      })
  }

  const getProvinsi = () => {
    setProvinsiLoading(true)
    axiosInstance
      .get("/api/address/master/provinsi")
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
      .get("/api/address/master/kabupaten/" + prov_id)
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
      .get("/api/address/master/kecamatan/" + kab_id)
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
      .get("/api/address/master/kelurahan/" + kec_id)
      .then((res) => {
        setKelurahanLoading(false)
        setKelurahanData(res.data.data)
      })
      .catch((err) => {
        setKelurahanLoading(false)
      })
  }

  useEffect(() => {
    getProvinsi()
  }, [])

  useEffect(() => {
    if (userData) {
      getKabupaten(userData?.provinsi_id)
      getKecamatan(userData?.kabupaten_id)
      getKelurahan(userData?.kecamatan_id)
      form.setFieldsValue(userData)
    }
  }, [userData])

  return (
    <div className="bg-white">
      <div className="p-4 sticky top-0 bg-purple-600">
        <Link to="/profile">
          <div className="flex items-center font-bold text-lg">
            <ArrowLeftOutlined className=" text-purple-600" />
            <p className="ml-3 text-purple-600">Ubah Profil</p>
          </div>
        </Link>

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
      </div>
    </div>
  )
}

export default UpdateProfile
