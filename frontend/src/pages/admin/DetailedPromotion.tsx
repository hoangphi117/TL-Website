import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IPromotion } from "@/types/promotion";
import { useParams } from "react-router-dom";
import promotionApi from "@/services/api/admin/promotionApi";
import PageTitle from "@/components/admin/common/PageTitle";
import { Eye, PenSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";


export default function DetailedPromotion() {
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<Partial<IPromotion>>({});
  const [promotion, setPromotion] = useState<IPromotion | null>(null);
  const { id } = useParams<{ id: string }>();

  const loadPromotion = async () => {
    try {
        if(!id) return;
        const res = await promotionApi.getById(id);
        setPromotion(res.data.data);
        setForm(res.data.data);
    }catch(error) {
        console.log(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            loadPromotion();
        }catch(error) {
            console.log(error)
        }
    }
    fetchData();
  },[id]);

  const handleChange = (key: keyof IPromotion, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
   
  };

  const handleCancel = () => {
    setForm(promotion);
    setIsEdit(false);
  };
  
  if (!promotion) {
    return <div>Không tìm thấy mã giảm giá</div>;
  }

  return (
    <div className="space-y-6 p-2 md:p-4">
      <PageTitle
        title="Thông tin mã giảm giá"
        subTitle="Kiểm tra và cập nhật thông tin mã giảm giá"
      />
      {/* HEADER */}
      <div className="flex items-center justify-end gap-">

          {!isEdit ? (
            <Button 
                className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                variant="outline" onClick={() => setIsEdit(true)}>
              <PenSquare/>
              Chỉnh sửa
            </Button>
          ) : (
            <Button 
                className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                variant="outline" onClick={() => setIsEdit(false)}>
              <Eye/>
              Xem
            </Button>
          )}
      </div>

      {/* THÔNG TIN CƠ BẢN */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thông tin cơ bản</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-x-2 flex items-center">
            <span className="text-md font-medium">
                {promotion.isActive ? "Đang hoạt động" : "Đã tắt"}
            </span>       
            <Switch
                disabled={!isEdit}
                checked={form.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-md">Mô tả</Label>
            <Textarea
              disabled={!isEdit}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-md">Giá trị giảm</Label>
            <Input
              type="number"
              disabled={!isEdit}
              value={form.discountValue ?? 0}
              onChange={(e) =>
                handleChange("discountValue", Number(e.target.value))
              }
            />
          </div>

          <div className="space-y-1">
            <Label className="text-md">Đơn tối thiểu</Label>
            <Input
              type="number"
              disabled={!isEdit}
              value={form.minOrderAmount ?? 0}
              onChange={(e) =>
                handleChange("minOrderAmount", Number(e.target.value))
              }
            />
          </div>

          <div className="space-y-1">
            <Label className="text-md">Giảm tối đa</Label>
            <Input
              type="number"
              disabled={!isEdit}
              value={form.maxDiscountAmount ?? 0}
              onChange={(e) =>
                handleChange("maxDiscountAmount", Number(e.target.value))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* THỐNG KÊ */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê sử dụng</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-3 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Đã dùng</p>
            <p className="text-xl font-bold">{promotion.usedCount}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-md">Số lượng</Label>
            <Input
                className="max-w-20"
                type="number"
                disabled={!isEdit}
                value={form.usageLimit ?? 0}
                onChange={(e) => 
                    handleChange("usageLimit", Number(e.target.value))
                }
            >
            </Input>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Còn lại</p>
            <p className="text-xl font-bold">
              {(promotion.usageLimit ?? 0) - (promotion.usedCount ?? 0)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        {isEdit && (
          <>
            <Button variant="outline" onClick={handleCancel}>
              Huỷ
            </Button>
            <Button 
                className="bg-green-500 text-white text-md hover:bg-green-600"
                onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </>
        )} 
      </div>
    </div>
  );
}
