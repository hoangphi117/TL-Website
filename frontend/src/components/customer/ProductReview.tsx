import React, { useEffect, useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { reviewService } from "@/services/api/customer/review.service";
import { formatDate } from "@/utils/formatDateCreatedAt";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      try {
        const res: any = await reviewService.getReviewsByProduct(productId);
        if (res && res.data) setReviews(res.data);
      } catch (error) {
        console.log("Failed to fetch reviews", error);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async () => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        productId,
        rating: userRating,
        comment,
      });
      toast.success("Đánh giá đã được gửi và đang chờ duyệt!");
      setComment("");
      setUserRating(5);
    } catch (error: any) {
      toast.error("Gửi đánh giá thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[#151517]/90 backdrop-blur-md border-zinc-800 rounded">
      <CardHeader>
        <CardTitle className="uppercase border-l-4 border-red-600 pl-3 text-white">
          Đánh giá & Nhận xét ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* FORM VIẾT ĐÁNH GIÁ */}
        <div className="mb-8 p-4 bg-zinc-900/50 rounded border border-zinc-800">
          <h3 className="font-bold text-gray-200 mb-4">Gửi đánh giá của bạn</h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-gray-400">Mức độ:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= userRating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-zinc-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
            className="w-full min-h-[100px] rounded bg-zinc-900 border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-600 mb-3"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white rounded"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </div>

        <Separator className="my-6 bg-zinc-800" />

        {/* DANH SÁCH ĐÁNH GIÁ */}
        {reviews.length === 0 ? (
          <div className="text-center py-8 italic text-gray-500">
            Chưa có đánh giá nào
          </div>
        ) : (
          <div className="space-y-8">
            {reviews.map((rv) => (
              <div
                key={rv._id}
                className="border-b border-zinc-800 last:border-0 pb-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 font-bold shrink-0">
                    {rv.userId?.fullName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">
                        {rv.userId?.fullName || "Ẩn danh"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(rv.createdAt)}
                      </span>
                    </div>
                    <div className="flex text-yellow-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rv.rating ? "fill-current" : "text-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed bg-zinc-900/30 p-3 rounded border border-zinc-800/50">
                      {rv.comment}
                    </p>
                  </div>
                </div>

                {/* ADMIN REPLY */}
                {rv.adminReply && (
                  <div className="mt-4 ml-12 p-4 bg-zinc-800/30 rounded border-l-4 border-red-600/50">
                    <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                      <BadgeCheck className="w-4 h-4" /> Admin phản hồi
                    </div>
                    <p className="text-gray-200 text-sm italic">
                      {rv.adminReply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
