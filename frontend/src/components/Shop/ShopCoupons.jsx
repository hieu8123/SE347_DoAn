import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineCopy } from "react-icons/ai";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";
import { server } from "../../server";

const ShopCoupons = ({ shopId }) => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon-show/${shopId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupons(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
        // Xử lý lỗi nếu cần
      });
  }, [shopId]);
  console.log("coupons", coupons);

  const handleCopy = (name) => {
    const textArea = document.createElement("textarea");
    textArea.value = name;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      toast.success("Mã giảm giá đã được sao chép!");
    } catch (err) {
      console.error("Lỗi khi sao chép mã giảm giá:", err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Mã giảm giá",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Tỉ lệ ",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Copy",
      flex: 0.8,
      minWidth: 120,
      headerName: "Sao chép",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleCopy(params.row.name)}>
            <AiOutlineCopy size={20} />
          </Button>
        );
      },
    },
  ];

  const rows = coupons.map((coupon) => ({
    id: coupon._id,
    name: coupon.name,
    price: coupon.value + " %",
    sold: 10, // Bạn có thể điều chỉnh trường này theo nhu cầu.
  }));

  return (
    <div>
      {isLoading ? (
        // Hiển thị một biểu tượng hoặc thông báo đang tải trong khi dữ liệu đang được lấy.
        <div>Đang tải...</div>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          autoHeight
        />
      )}
    </div>
  );
};

export default ShopCoupons;
