import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { backend_url } from "../../server";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { AiFillFileExcel } from "react-icons/ai";
import * as XLSX from "xlsx";
import ChartComponentShop from "./ChartComponentShop";

const AllProducts = () => {
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const [statistic, setStatistic] = useState(false);
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  console.log("valEndDay", valEndDay);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };
  //
  const handleStartDayChange = (e) => {
    setValStartDay(e.target.value);
  };
  const handleEndDayChange = (e) => {
    setValEndDay(e.target.value);
  };
  const handleStartDayClick = () => {
    setValEndDay("");
    setValStartDay("");
    setStatistic(false);
  };

  const handleStatistic = () => {
    setStatistic(true);
  };

  //export excel

  // Tạo dữ liệu cho danh sách đơn hàng với các cột sản phẩm động
  const allProducts = products?.map((allProduct) => {
    return {
      ["Mã sản phẩm"]: allProduct._id,
      ["Tên sản phẩm"]: allProduct.name,
      ["Loại sản phẩm"]: allProduct.category,
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

  const getAllProducts = products?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) && orderDate <= new Date(valEndDay)
    );
  });

  const totalOrders = getAllProducts?.length;
  //chart;
  const deliveredOrdersInfo = getAllProducts?.map((product) => {
    return {
      day: product.createdAt.slice(0, 10),
      total: 1,
    };
  });
  console.log("deliveredOrdersInfo", deliveredOrdersInfo);
  console.log("getAllOrders", getAllProducts);

  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh sản phẩm", // Tiêu đề cột hình ảnh
      minWidth: 100, // Độ rộng tối thiểu của cột
      flex: 0.7, // Tỷ lệ co và mở rộng của cột
      sortable: false, // Không cho phép sắp xếp cột này
      renderCell: (params) => {
        const product = products.find((product) => product._id === params.id);
        const ProductImage = product.images[0];
        return (
          <img
            src={`${backend_url}/${ProductImage}`}
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
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Xóa",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  const row1 = [];

  products &&
    products.forEach((item) => {
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
      });
    });
  products &&
    getAllProducts.forEach((item) => {
      row1.push({
        id: item._id,
        name: item.name,
        price:
          item.discountPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    // <>
    //   {isLoading ? (
    //     <Loader />
    //   ) : (
    //     <div className="w-full mx-8 pt-1 mt-10 bg-white">
    //       <DataGrid
    //         rows={row}
    //         columns={columns}
    //         pageSize={10}
    //         disableSelectionOnClick
    //         autoHeight
    //       />
    //     </div>
    //   )}
    // </>
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={4}
            disableSelectionOnClick
            autoHeight
          />
          <button
            onClick={handleExport}
            className="text-green-500 px-4 py-2 rounded-lg hover:text-red-500 flex items-center ml-auto">
            <AiFillFileExcel className="mr-2" /> {/* Thêm biểu tượng Excel */}
            Export Excel
          </button>
          <div
            style={{
              padding: "20px",
              background: "#ccc",
            }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}>
              <h1 style={{ fontSize: "20px", fontWeight: "700" }}>
                Thống kê sản phẩm ----
              </h1>
              <div>
                <label>Ngày bắt đầu: </label>
                <input
                  style={{ border: "1px solid black" }}
                  value={valStartDay}
                  type="date"
                  onChange={handleStartDayChange}></input>
                <label style={{ marginLeft: "50px" }}>Ngày kết thúc: </label>
                <input
                  style={{ border: "1px solid black" }}
                  className="border border-solid border-red-500"
                  type="date"
                  value={valEndDay}
                  onChange={handleEndDayChange}></input>
                {/* <button onClick={handleSubmit}>Thống kê</button> */}
              </div>
            </div>
            {statistic ? (
              <button
                onClick={handleStartDayClick}
                style={{
                  color: "#294fff",
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}>
                Tiếp tục thống kê
              </button>
            ) : (
              <></>
            )}
            {valEndDay ? (
              <button
                onClick={handleStatistic}
                style={{
                  color: "#294fff",
                  fontSize: "20px",
                  display: statistic ? "none" : "flex",
                  justifyContent: "center",
                  width: "100%",
                }}>
                Thống kê
              </button>
            ) : (
              <></>
            )}
          </div>

          {row1 && statistic && (
            <>
              <DataGrid
                rows={row1}
                columns={columns}
                pageSize={4}
                disableSelectionOnClick
                autoHeight
              />
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  padding: "50px",
                  float: "right",
                }}>
                <span>Tổng sản phẩm: </span>
                <span style={{ color: "#294fff" }}>{totalOrders}</span>
              </div>
            </>
          )}
          {statistic && (
            <ChartComponentShop
              arrData={deliveredOrdersInfo && deliveredOrdersInfo}
              name="sản phẩm"></ChartComponentShop>
          )}
        </div>
      )}
    </>
  );
};

export default AllProducts;
