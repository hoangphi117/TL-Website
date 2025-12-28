import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  Truck,
  ChevronRight,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services/api/customer/product.service";
import { cartService } from "@/services/api/customer/cart.service";
import { wishlistService } from "@/services/api/customer/wishlist.service";
import { useCart } from "@/context/CartContext";
import type { IProduct } from "@/types/product";
import ProductSpecsTable from "@/components/product/ProductSpecTable";
import ProductListCarousel from "@/components/product/carousel/ProductListCarousel";
import ProductReviews from "@/components/customer/ProductReview";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { formatVND } from "@/utils/admin/formatMoney";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateCartCount } = useCart();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useDocumentTitle(product?.name || "Chi tiết sản phẩm");

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getProductDetail(id);
        if (data) {
          setProduct(data);
          setActiveImage(data.images?.[0] || "");
          const categoryName =
            typeof data.category === "object" ? data.category?.name : "";
          if (categoryName) fetchRelatedProducts(categoryName, data._id);
        }
      } catch (error) {
        toast.error("Lỗi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  // fetch wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!product) return;

      try {
        const res: any = await wishlistService.getWishlist();

        const list =
          res.wishlist?.products || res.wishlist || res.data?.wishlist || [];

        const exists = list.some((item: any) => item._id === product._id);

        setIsWishlisted(exists);
      } catch (error) {
        setIsWishlisted(false);
      }
    };

    checkWishlistStatus();
  }, [product]);

  const fetchRelatedProducts = async (
    categoryName: string,
    currentId: string
  ) => {
    try {
      const res = await productService.getProducts({
        category: categoryName,
        limit: 11,
      });
      const related = (res.data?.products || [])
        .filter((p: any) => p._id !== currentId)
        .slice(0, 10);
      setRelatedProducts(related);
    } catch (e) {}
  };

  const handleAddToCart = async () => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập!");
      navigate("/auth/login/customer");
      return;
    }
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await cartService.addToCart(product._id, 1);
      await updateCartCount();
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (e) {
      toast.error("Thêm thất bại");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await wishlistService.addToWishlist(product._id);
        setIsWishlisted(true);
        toast.success("Đã thêm vào yêu thích");
      }
    } catch (e) {
      toast.error("Thao tác thất bại");
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    {
      label:
        typeof product?.category === "object"
          ? product.category.name
          : "Danh mục",
      path:
        typeof product?.category === "object"
          ? `/category/${product?.category.name}`
          : "/",
    },
    { label: product?.name },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Card className="w-[280px] bg-[#151517] border-zinc-800 rounded">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Skeleton className="h-12 w-12 rounded bg-zinc-800" />
            <Skeleton className="h-4 w-40 bg-zinc-800" />
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="bg-transparent min-h-screen py-6">
      <div className="container mx-auto max-w-7xl px-4 space-y-3">
        {/* BREADCRUMB */}
        <div className="flex items-center text-sm text-white gap-2">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              {item.path ? (
                <span
                  onClick={() => navigate(item.path)}
                  className="hover:text-red-600 cursor-pointer truncate"
                >
                  {item.label}
                </span>
              ) : (
                <span className="text-white font-medium truncate">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* MAIN CARD */}
        <Card className="bg-[#151517]/90 backdrop-blur-md border-zinc-800 rounded overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* IMAGES */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-zinc-800">
                <div className="relative aspect-square bg-gray-700 rounded overflow-hidden mb-4 flex items-center justify-center p-2">
                  <img
                    src={activeImage}
                    alt={product?.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {product?.images?.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImage === img
                          ? "border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                          : "border-zinc-800 bg-zinc-900"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* INFO */}
              <div className="lg:col-span-7 p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {product?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-6 text-gray-400">
                  <span>
                    SKU: <span className="text-white">{product?.sku}</span>
                  </span>
                  <Separator
                    orientation="vertical"
                    className="h-4 bg-zinc-700"
                  />
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">
                      {Number(product?.averageRating).toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-300">
                      ({product?.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>

                {/* PRICE SECTION */}
                <div className="bg-red-600/10 p-5 rounded border border-red-600/20 mb-6 flex flex-col gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-red-500">
                    {formatVND(product?.price || 0)}
                  </span>
                  <div className="flex items-center gap-3">
                    {product?.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatVND(product.originalPrice)}
                        </span>
                      )}
                    {product?.discountPercentage && (
                      <Badge
                        variant="outline"
                        className="border-red-600 text-red-500 font-bold rounded"
                      >
                        -{product.discountPercentage}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      isAddingToCart || (product?.stockQuantity || 0) <= 0
                    }
                    className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white rounded font-bold uppercase text-lg"
                  >
                    <div className="flex-col items-center flex justify-center">
                      <div className="flex">
                        {(product?.stockQuantity || 0) > 0
                          ? "MUA NGAY"
                          : "HẾT HÀNG"}
                        <ShoppingCart className="w-5 h-5 ml-2 mt-1" />
                      </div>
                      <span className="text-xs normal-case font-normal">
                        Giao tận nơi/Nhận tại cửa hàng
                      </span>
                    </div>
                  </Button>
                  <a
                    href="https://zalo.me/g/wxvskd604"
                    target="_blank"
                    className="flex-1 h-14 bg-transparent text-blue-400 border border-blue-400 rounded font-bold uppercase text-lg"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex flex-row items-center">
                        <img
                          width="32"
                          height="32"
                          src="https://img.icons8.com/color/96/zalo.png"
                          alt="zalo"
                        />
                        <span>Tư vấn ngay</span>
                      </div>
                      <span className="text-xs normal-case font-normal">
                        Hỗ trợ nhiệt tình
                      </span>
                    </div>
                  </a>
                  <Button
                    variant="outline"
                    className={`h-14 w-14 border-zinc-700 bg-zinc-900/50 rounded ${
                      isWishlisted
                        ? "border-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isWishlisted ? "fill-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>

                <div className="border-t border-zinc-800 pt-6 grid grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-red-500" />
                    <p className="text-sm">Giao hàng miễn phí</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-red-500" />
                    <p className="text-sm">Bảo hành chính hãng</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SPECS & REVIEWS */}
        {product?.specifications && (
          <Card className="bg-[#151517]/90 backdrop-blur-md border-zinc-800 rounded">
            <CardHeader>
              <CardTitle className="uppercase border-l-4 border-red-600 pl-3 text-white">
                Thông số kỹ thuật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductSpecsTable specs={product.specifications} />
            </CardContent>
          </Card>
        )}
        <ProductReviews productId={product?._id || ""} />
        {relatedProducts.length > 0 && (
          <div className="p-0">
            <ProductListCarousel
              title="Sản phẩm tương tự"
              products={relatedProducts}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductDetailPage;
