import PageTitle from "@/components/admin/common/PageTitle";
import { PromotionsTable } from "@/components/admin/promotions/promotions-table";
import promotionApi from "@/services/api/admin/promotionApi";
import type { PromotionQuery } from "@/services/api/admin/query";
import type { IPromotion } from "@/types/promotion";
import { useEffect, useState } from "react";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [status, setStatus] = useState("all");
  const [detailOpen, setDetailOpen] = useState(false);

  const handleDetailOpen = (promotion: IPromotion) => {

  } 

  const handleDelete = (id: string) => {

  }

  const limit = 8;
  
  const loadPromotions = async () => {
    try {
        const query: PromotionQuery = {
            page,
            limit,
        }
        const res = await promotionApi.getAll(query);
        setTotalPages(res.data.pages);
        setPromotions(res.data.data);
        setTotalPromotions(res.data.total);
    }catch(error){
        console.log(error);
    }
  }

  useEffect(() => {
    try {
        const fetchData = async () => {
            loadPromotions();
        }
        fetchData();
    }catch(error) {
        console.log(error);
    }
  }, [page]);

  return (
    <div className="p-2 md:p-4">
      <PageTitle
        title="Quản lí mã giảm giá"
        subTitle="Quản lí các loại mã giảm giá, khuyến mãi"
      />
      <div className="bg-white">
        <PromotionsTable
            promotions={promotions}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            handleDetailOpen={handleDetailOpen}
            status={status}
            setStatus={setStatus}
            onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
