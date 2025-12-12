import ReviewDetailDialog from "@/components/admin/reviews/ReviewDetailDialog";
import { ReviewsTable } from "@/components/admin/reviews/reviews-table";
import type { IReviewQuery } from "@/services/api/admin/query";
import reviewApi from "@/services/api/admin/reviewApi";
import type { IReview } from "@/types/review"
import { Grid2X2 } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<IReview[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [status, setStatus] = useState("all");
    const [totalPages, setTotalPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(1);
    const [detailedReview, setDetailedReview] = useState<IReview | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [replyReview, setReplyReview] = useState<string>("");
    const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
    const limit = 5;

    const handleDetailOpen = (review: IReview) => {
        setDetailedReview(review);
        setReplyReview(review.adminReply);
        setDetailOpen(true);
    }

    const handleSaveReply = (review: IReview) => {
        if(review.adminReply !== replyReview){
            replyReviewApi(review._id, replyReview);
        }
        setDetailOpen(false);
    }

    const replyReviewApi = async (id: string, reply: string) => {
        try {
            await reviewApi.adminReply(id, reply);
            loadReviews();
        }catch(error){
            console.log(error);
        }
    }

    const handleApprove = async () => {
        if (!detailedReview) return;

        if (detailedReview.status === "approved") return;

        try {
            const res = await reviewApi.approveReview(detailedReview._id);

            // cập nhật lại list
            setReviews((prev) =>
            prev.map((r) =>
                r._id === detailedReview._id ? res.data.data : r
            )
            );

            toast.success("Review đã được duyệt");
            setDetailOpen(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Approve thất bại");
        }
    };

    const handleReject = async () => {
        if (!detailedReview) return;

        if (!replyReview.trim()) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }

        try {
            const res = await reviewApi.rejectReview(
                detailedReview._id,
                replyReview
            );

            setReviews((prev) =>
            prev.map((r) =>
                r._id === detailedReview._id ? res.data.data : r
            )
            );

            toast.success("Review đã bị từ chối");
            setDetailOpen(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Reject thất bại");
        } 
    };
    
    const loadReviews = async () => {
        try {
            const params: IReviewQuery = {
                page,
                rating,
                limit,
                search,
            }

            if(status !== "all") params.status = status;

            const res = await reviewApi.getAll(params);
            setReviews(res.data.data);
            setTotalPages(res.data.pages);
            setTotalReviews(res.data.total);
        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        try {
            const fetchData = async () => {
                loadReviews();
            }
            fetchData();
        }catch(error){
            console.log(error)
        }
    }, [page, status, rating, search]);
    return (
        <div className="p-5">
            {isLoading && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
            )}
            <div className="flex flex-col bg-white shadow-sm gap-3 p-4">
                <div className="flex flex-col bg-white mt-4 px-8 gap-3 border-b border-gray-300 pb-3 pt-3">
                    <p className="text-2xl lg:text-3xl font-bold">Quản lí đánh giá và bình luận</p>
                    <p className="text-md md:text-lg text-gray-600">Theo dõi và xử lí các đánh giá và bình luận về sản phẩm</p>
                </div>
                <div className="border border-gray-200 p-3 shadow-lg rounded-lg">
                    <p className="flex flex-row gap-2 items-center font-bold text-lg">
                        <Grid2X2 size={24} color="#3f6cf3"/>
                        Tổng Đánh giá: {totalReviews}
                    </p>
                    <ReviewsTable
                        reviews={reviews}
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        search={search}
                        setSearch={setSearch}
                        handleDetailOpen={handleDetailOpen}
                        status={status}
                        setStatus={setStatus}
                        rating={rating}
                        setRating={setRating}
                    />
                </div>
                    <ReviewDetailDialog
                        open={detailOpen}
                        onOpenChange={setDetailOpen}
                        review={detailedReview}
                        replyReview={replyReview}
                        setReplyReview={setReplyReview}
                        handleSaveReply={handleSaveReply}
                        handleApprove={handleApprove}
                        handleReject={handleReject}
                    />
            </div>
        </div>
    )
}
