const Fuse = require("fuse.js");
const Product = require("../models/productModel");

// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str;
}

class SearchAgent {
    constructor() {
        this.searchEngine = null;
        this.cachedProducts = [];
        this.lastUpdated = 0;
    }

    async init() {
        await this.updateSearchIndex();
    }

    async updateSearchIndex() {
        const now = Date.now();
        if (now - this.lastUpdated > 300000 || !this.searchEngine) {
            try {
                const products = await Product.find({ status: "active" })
                    .populate("brand", "name")
                    .populate("category", "name")
                    .select("name price description brand category specifications tags");

                // Chuẩn hóa dữ liệu
                this.cachedProducts = products.map((p) => ({
                    price: p.price,
                    searchText: `ID:${p.id} ${p.name}
            ${p.brand?.name || ""},
            ${p.category?.name || ""}
            ${p.description || ""}
            ${JSON.stringify(p.specifications || "")}
            ${p.tags}`,
                    searchTextNoTone: removeVietnameseTones(`${p.name} ${p.brand?.name || ""} ${p.category?.name || ""} ${p.description || ""} ${p.tags || ""}`),
                    raw: {
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        description: p.description,
                        brand: p.brand?.name || "",
                        category: p.category?.name || "",
                        specifications: p.specifications,
                        tags: p.tags,
                    },
                }));

                const options = {
                    isCaseSensitive: false,
                    includeScore: true,
                    shouldSort: true,
                    keys: ["searchText", "searchTextNoTone"],
                    threshold: 0.5, // Tăng từ 0.4 lên 0.5 để tìm kiếm linh hoạt hơn
                    distance: 1000,
                    ignoreLocation: true,
                };

                this.searchEngine = new Fuse(this.cachedProducts, options);
                this.lastUpdated = now;
                console.log(`[SearchAgent] Updated index with ${this.cachedProducts.length} products.`);
            } catch (e) {
                console.error("[SearchAgent] Update Error:", e);
            }
        }
    }

    search(queryObj) {
        if (!this.searchEngine) return [];

        let results = [];
        const keyword = queryObj.keyword || queryObj.category || "";

        if (keyword) {
            // Tìm kiếm với keyword gốc
            let fuseResults = this.searchEngine.search(keyword);
            
            // Nếu không tìm thấy, thử tìm với keyword không dấu
            if (fuseResults.length === 0) {
                const keywordNoTone = removeVietnameseTones(keyword);
                fuseResults = this.searchEngine.search(keywordNoTone);
            }
            
            results = fuseResults.map((r) => r.item);
        } else {
            results = this.cachedProducts;
        }

        // Filter by Price
        if (queryObj.price_max) results = results.filter((p) => p.price <= queryObj.price_max);
        if (queryObj.price_min) results = results.filter((p) => p.price >= queryObj.price_min);

        // Filter by Category
        if (queryObj.category) {
            const categoryKeyword = queryObj.category.toLowerCase();
            results = results.filter((p) => p.raw.category.toLowerCase().includes(categoryKeyword));
        }

        // Filter by Brand
        if (queryObj.brand) {
            const brandKeyword = queryObj.brand.toLowerCase();
            results = results.filter((p) => p.raw.brand.toLowerCase().includes(brandKeyword));
        }

        // Sort
        if (queryObj.sort_by) {
            if (queryObj.sort_by === "price_desc") {
                results.sort((a, b) => b.price - a.price);
            } else if (queryObj.sort_by === "price_asc") {
                results.sort((a, b) => a.price - b.price);
            }
        }

        return results;
    }

    getTopProducts(queryObj, limit = 10) {
        const results = this.search(queryObj);
        return results.slice(0, limit);
    }
}

module.exports = new SearchAgent();
