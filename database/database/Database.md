### **1. Collection: users**

Lưu trữ thông tin người dùng, bao gồm cả khách hàng và quản trị viên.

```javascript
{  
  _id: ObjectID,  
  email: { type: String, unique: true, required: true },  
  password: { type: String, required: true }, 
  fullName: { type: String, required: true },
  phoneNumber: { type: String },
  avatarUrl: { type: String },
  addresses: [
    {  
      street: String,  
      ward: String, 
      district: String,
      city: String,
      isDefault: { type: Boolean, default: false }  
    }  
  ],
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },  
  isActive: { type: Boolean, default: true }, 
  passwordResetToken: { type: String },  
  passwordResetExpires: { type: Date },  
  createdAt: { type: Date, default: Date.now },  
  updatedAt: { type: Date }  
} 
```

### **2. Collection: categories**

Lưu trữ danh mục sản phẩm (Laptop, Chuột, Bàn phím...).

```javascript
{  
  _id: ObjectID,  
  name: { type: String, unique: true, required: true },  
  description: { type: String },  
  imageUrl: { type: String },  
  parentCategory: { type: ObjectID, ref: categories, default: null } 
}
```

### **3. Collection: brands**

Lưu trữ thông tin thương hiệu (Dell, Logitech, Asus...).

```javascript
{  
  _id: ObjectID,  
  name: { type: String, unique: true, required: true },  
  logoUrl: { type: String },  
  description: { type: String }  
}
```

### **4. Collection: products**

Lưu trữ thông tin chi tiết của tất cả sản phẩm. Cái này quan trọng nên t sẽ comment kỹ chút.

```javascript
{  
  _id: ObjectID,  
  name: { type: String, required: true, index: true }, // index để tìm kiếm  
  sku: { type: String, unique: true, required: true }, // Mã sản phẩm  
  description: { type: String }, // Mô tả ngắn  
  detailedInfo: { type: String }, // Mô tả chi tiết, có thể là HTML  
  price: { type: Number, required: true }, // Giá bán hiện tại  
  originalPrice: { type: Number }, // Giá gốc (khi có khuyến mãi)  
  stockQuantity: { type: Number, required: true, default: 0 }, // Số lượng tồn kho  
  images: [  
    { type: String } // Mảng các URL hình ảnh  
  ],  
  category: { type: ObjectID, ref: categories, required: true },  
  brand: { type: ObjectID, ref: brands },  
  specifications: { type: Object }, // Đối tượng linh hoạt cho thông số kỹ thuật  
  // Ví dụ: { cpu: Intel Core i5, ram: 16GB DDR4, storage: 512GB SSD }
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },//Trạng thái của sản phầm
  tags: [{ type: String, index: true }], // Hỗ trợ tìm kiếm  
  averageRating: { type: Number, default: 0 }, // Điểm đánh giá trung bình  
  reviewCount: { type: Number, default: 0 }, // Tổng số lượt đánh giá  
  soldCount: { type: Number, default: 0 }, // Số lượng đã bán (hỗ trợ thống kê)  
  createdAt: { type: Date, default: Date.now },  
  updatedAt: { type: Date }  
}
```

*Lưu ý: specifications có thể tùy biến. Ví dụ, Laptop sẽ có 'cpu', 'ram', nhưng Chuột sẽ có 'dpi', 'connection_type'.*

### **5. Collection: carts**

Lưu trữ giỏ hàng của người dùng. Mỗi người dùng có 1 giỏ hàng.

```javascript
{  
  _id: ObjectID,  
  userId: { type: ObjectID, ref: users, unique: true, required: true },  
  items: [  
    {  
      productId: { type: ObjectID, ref: products },  
      quantity: { type: Number, required: true, min: 1 },  
      name: String,
      price: Number, 
      image: String
    }  
  ],  
  totalAmount: { type: Number },
  updatedAt: { type: Date, default: Date.now }  
}
```

### **6. Collection: orders**

Lưu trữ thông tin các đơn hàng đã được đặt.

```javascript
{  
  _id: ObjectID,  
  orderCode: { type: String, unique: true, required: true },
  userId: { type: ObjectID, ref: users, required: true },  
  customerInfo: {
    fullName: String,  
    email: String,  
    phoneNumber: String,  
    shippingAddress: {  
      street: String,  
      ward: String,  
      district: String,  
      city: String  
    }  
  },  
  items: [ 
    {  
      productId: { type: ObjectID, ref: products },  
      name: String,  
      sku: String,  
      quantity: Number,  
      price: Number
    }  
  ],  
  subtotal: { type: Number }, 
  shippingFee: { type: Number, default: 0 },  
  discountAmount: { type: Number, default: 0 },  
  voucherCode: { type: String },  
  totalAmount: { type: Number, required: true },  
  paymentMethod: { type: String, enum: ['COD', 'BankTransfer', 'OnlineGateway'] },  
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: {
    type: String,  
    enum: ['pending_confirmation', 'processing', 'shipping', 'completed', 'cancelled'],  
    default: 'pending_confirmation'    
  },  
  notes: { type: String }, 
  createdAt: { type: Date, default: Date.now },  
  updatedAt: { type: Date }  
}
```

### **7. Collection: reviews**

Lưu trữ các đánh giá sản phẩm của khách hàng.

```javascript
{  
  _id: ObjectID,  
  productId: { type: ObjectID, ref: products, required: true },  
  userId: { type: ObjectID, ref: users, required: true },  
  rating: { type: Number, min: 1, max: 5, required: true },  
  comment: { type: String },  
  images: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: pending } 
  adminReply: { type: String }, 
  createdAt: { type: Date, default: Date.now }  
}
```

### **8. Collection: promotions (hoặc vouchers)**

Quản lý mã giảm giá, khuyến mãi.

```javascript
{  
  _id: ObjectID,  
  code: { type: String, unique: true, required: true },  
  description: { type: String },  
  discountType: { type: String, enum: ['percentage', 'fixed_amount'] }, // phần trăm hoặc số tiền cố định  
  discountValue: { type: Number, required: true },  
  minOrderAmount: { type: Number, default: 0 }, // Giá trị đơn hàng tối thiểu  
  maxDiscountAmount: { type: Number }, // Giới hạn giảm tối đa (cho loại percentage)  
  startDate: { type: Date },  
  endDate: { type: Date },  
  usageLimit: { type: Number }, // Tổng số lần sử dụng  
  usedCount: { type: Number, default: 0 }, // Đếm số lần đã dùng  
  isActive: { type: Boolean, default: true }  
}
```

### **9. Collection: feedback**

Lưu trữ các liên hệ, góp ý của khách hàng.

```javascript
{  
  _id: ObjectID,  
  fullName: { type: String },  
  email: { type: String },  
  phoneNumber: { type: String },  
  subject: { type: String },  
  message: { type: String, required: true },  
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },  
  adminReply: { type: String },  
  createdAt: { type: Date, default: Date.now }  
}
```

### **10. Collection: chatSessions**

Lưu trữ lịch sử hội thoại của chatbot.

```javascript
{  
  _id: ObjectID,  
  userId: { type: ObjectID, ref: users, default: null }, 
  messages: [  
    {  
      sender: { type: String, enum: ['user', 'bot'] },  
      message: String,  
      timestamp: { type: Date, default: Date.now }  
    }  
  ],  
  createdAt: { type: Date, default: Date.now },  
  updatedAt: { type: Date }  
}  
```

### **11. Collection: wishlists**

```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'Users', required: true, unique: true },
  products: [ { type: ObjectId, ref: 'Products' } ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### **12.  Collection: payments**

```javascript
{
  _id: ObjectId,
  orderId: { type: ObjectId, ref: 'Orders', required: true, index: true },
  userId: { type: ObjectId, ref: 'Users', required: true },
  amount: { type: Number, required: true },
  method: { type: String }, // 'VNPAY', 'Momo', 'COD'...
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionCode: { type: String, index: true }, // Mã giao dịch từ bên thứ 3
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```