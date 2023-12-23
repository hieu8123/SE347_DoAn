import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { backend_url, server } from "../../server";
import axios from "axios";
import { AiFillFileExcel } from "react-icons/ai";
import * as XLSX from "xlsx";

import { useState } from "react";

const AllProducts = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      });
  }, []);

  // Tạo dữ liệu cho danh sách đơn hàng với các cột sản phẩm động
  const allProducts = data?.map((allProduct) => {

    return {
      ["Mã sản phẩm"]: allProduct._id,
      ["Tên sản phẩm"]: allProduct.name,
      ["Loại sản phẩm"]: allProduct.category,
      ["Tên cửa hàng"]: allProduct.shop?.name,
      ["Giá gốc"]:
        allProduct.originalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) + "",
      ["Giá khuyến mãi"]:
        allProduct.discountPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) + "",
      ["Lượt bán"]: allProduct.sold_out,
      ["Kho"]: allProduct.stock,
      ["Đánh giá"]: allProduct.ratings,
    };
  });



  const handleExport = () => {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("vi-VN")
      .replaceAll("/", "-"); // Chuyển ngày thành chuỗi có dạng MM-DD-YYYY

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(allProducts);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const fileName = `all-product-${formattedDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh sản phẩm",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        const product = data.find((product) => product._id === params.id);
        const productImage = product.images[0];
        return (
          <img
            src={`${backend_url}/${productImage}`}
            alt="Product"
            style={{ width: "50px", height: "50px" }}
          />
        );
      },
    },
    { field: "id", headerName: "Mã sản phẩm", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "shopName",
      headerName: "Tên cửa hàng",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Giá",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Kho",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Đã bán",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Đánh giá",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price:
          item.discountPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        Stock: item.stock,
        sold: item?.sold_out,
        shopName: item?.shop?.name,
      });
    });

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={7}
          disableSelectionOnClick
          autoHeight
        />
        <button
          onClick={handleExport}
          className="text-green-500 px-4 py-2 rounded-lg hover:text-red-500 flex items-center ml-auto">
          <AiFillFileExcel className="mr-2" /> {/* Thêm biểu tượng Excel */}
          Export Excel
        </button>
      </div>
    </>
  );
};

export default AllProducts;
