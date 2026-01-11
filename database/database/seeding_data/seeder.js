require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { fakerVI: faker } = require('@faker-js/faker');

// --- IMPORT MODELS ---
const { User, Category, Brand, Product, Cart, Order, Review, Promotion, Payment } = require('./models');
// (Đảm bảo bạn đã export index.js như comment cuối bài trước, hoặc require từng file)

const MONGO_URI = "mongodb://localhost:27017/TeamLiquid-DB";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// --- DATA CẤU HÌNH ---
// Định nghĩa danh sách tên model thực tế để random cho "khớp"
const SAMPLE_DATA = {
  'Laptop': {
    prefixes: ['Gaming', 'Ultrabook', 'Workstation', 'MacBook', 'Vivobook', 'ThinkPad', 'Inspiron'],
    specs: () => ({
      cpu: faker.helpers.arrayElement(['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M2', 'Apple M3']),
      ram: faker.helpers.arrayElement(['8GB', '16GB', '32GB', '64GB']),
      storage: faker.helpers.arrayElement(['256GB SSD', '512GB SSD', '1TB SSD']),
      screen: faker.helpers.arrayElement(['13.3 inch', '14 inch', '15.6 inch', '16 inch 4K']),
      gpu: faker.helpers.arrayElement(['NVIDIA RTX 3050', 'NVIDIA RTX 4060', 'Integrated Graphics', 'AMD Radeon'])
    }),
    imageKeyword: 'laptop'
  },
  'Điện thoại': {
    prefixes: ['Galaxy S', 'Galaxy A', 'iPhone', 'Redmi Note', 'Find X', 'Xperia', 'Pixel'],
    specs: () => ({
      screen: faker.helpers.arrayElement(['6.1 inch OLED', '6.7 inch Super AMOLED', '6.5 inch LCD']),
      camera: faker.helpers.arrayElement(['48MP', '64MP', '108MP', '200MP']),
      battery: faker.helpers.arrayElement(['4000mAh', '5000mAh', '4500mAh']),
      chip: faker.helpers.arrayElement(['Snapdragon 8 Gen 2', 'A17 Pro', 'Dimensity 9200'])
    }),
    imageKeyword: 'smartphone'
  },
  'Bàn phím': {
    prefixes: ['Mechanical Keychron', 'Logitech G', 'Corsair K', 'Razer BlackWidow', 'Akko'],
    specs: () => ({
      switch: faker.helpers.arrayElement(['Red Switch', 'Blue Switch', 'Brown Switch']),
      layout: faker.helpers.arrayElement(['Fullsize', 'TKL (87 keys)', '60%', '75%']),
      connection: faker.helpers.arrayElement(['Type-C', 'Bluetooth 5.0', 'Wireless 2.4Ghz']),
      led: faker.helpers.arrayElement(['RGB', 'White LED', 'No LED'])
    }),
    imageKeyword: 'keyboard'
  },
  'Chuột': {
    prefixes: ['MX Master', 'G Pro', 'Viper', 'DeathAdder', 'Magic Mouse'],
    specs: () => ({
      dpi: faker.number.int({ min: 1000, max: 25000 }).toString(),
      sensor: 'Optical',
      connection: faker.helpers.arrayElement(['Wired', 'Wireless', 'Bluetooth']),
      weight: faker.number.int({ min: 60, max: 120 }) + 'g'
    }),
    imageKeyword: 'computer_mouse'
  },
  'Tai nghe': {
    prefixes: ['AirPods', 'Sony WH', 'JBL Tune', 'Sennheiser Momentum', 'Galaxy Buds'],
    specs: () => ({
      type: faker.helpers.arrayElement(['Over-ear', 'In-ear', 'True Wireless']),
      battery: faker.number.int({ min: 10, max: 60 }) + ' hours',
      anc: faker.datatype.boolean() ? 'Active Noise Cancelling' : 'No',
      driver: '40mm Dynamic'
    }),
    imageKeyword: 'headphone'
  }
};

const importData = async () => {
  try {
    // 1. Clean Data
    console.log('🗑️  Deleting old data...');
    await Promise.all([
      User.deleteMany(), Category.deleteMany(), Brand.deleteMany(),
      Product.deleteMany(), Cart.deleteMany(), Order.deleteMany(),
      Review.deleteMany(), Promotion.deleteMany(), Payment.deleteMany()
    ]);

    // 2. Categories & Brands
    console.log('📦 Creating Categories & Brands...');
    const categories = await Category.insertMany([
      { name: 'Laptop', imageUrl: 'https://placehold.co/600x400?text=Laptop' },
      { name: 'Điện thoại', imageUrl: 'https://placehold.co/600x400?text=Phone' },
      { name: 'Bàn phím', imageUrl: 'https://placehold.co/600x400?text=Keyboard' },
      { name: 'Chuột', imageUrl: 'https://placehold.co/600x400?text=Mouse' },
      { name: 'Tai nghe', imageUrl: 'https://placehold.co/600x400?text=Headphone' }
    ]);

    const brands = await Brand.insertMany([
      { name: 'Dell', logoUrl: 'https://placehold.co/200?text=Dell' },
      { name: 'Asus', logoUrl: 'https://placehold.co/200?text=Asus' },
      { name: 'Apple', logoUrl: 'https://placehold.co/200?text=Apple' },
      { name: 'Logitech', logoUrl: 'https://placehold.co/200?text=Logitech' },
      { name: 'Samsung', logoUrl: 'https://placehold.co/200?text=Samsung' },
      { name: 'Sony', logoUrl: 'https://placehold.co/200?text=Sony' },
      { name: 'Xiaomi', logoUrl: 'https://placehold.co/200?text=Xiaomi' }
    ]);

    // 3. Users
    console.log('👤 Creating Users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Tạo 1 admin
    const admin = await User.create({
      fullName: 'Admin Manager', email: 'admin@gmail.com', password: hashedPassword, role: 'admin'
    });

    // Tạo 10 customers
    const customersData = Array.from({ length: 10 }).map(() => ({
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      role: 'customer',
      addresses: [{
        street: faker.location.streetAddress(),
        city: 'Hồ Chí Minh',
        isDefault: true
      }]
    }));
    const customers = await User.insertMany(customersData);

    // 4. Products (SMART GENERATION)
    console.log('💻 Creating Products (Smart Context)...');
    const productsList = [];

    // Duyệt qua từng Category để tạo sản phẩm tương ứng
    for (const category of categories) {
      // Lấy config mẫu dựa trên tên category
      const config = SAMPLE_DATA[category.name];

      if (!config) continue; // Bỏ qua nếu không có config

      // Mỗi category tạo 10 sản phẩm
      for (let i = 0; i < 10; i++) {
        const randomBrand = brands[faker.number.int({ min: 0, max: brands.length - 1 })];
        const modelName = faker.helpers.arrayElement(config.prefixes); // Lấy tên mẫu: "Galaxy S"
        const modelNumber = faker.string.numeric(2); // Số phiên bản: "24"
        const suffix = faker.helpers.arrayElement(['Pro', 'Ultra', 'Plus', 'Gaming', 'Lite', '']);

        // Tên sản phẩm ghép lại: "Samsung Galaxy S 24 Ultra"
        const productName = `${randomBrand.name} ${modelName} ${modelNumber} ${suffix}`.trim();

        const price = parseFloat(faker.commerce.price({ min: 1000000, max: 60000000, dec: 0 }));

        productsList.push({
          name: productName,
          sku: category.name.substring(0, 2).toUpperCase() + faker.string.alphanumeric(6).toUpperCase(),
          description: `Sản phẩm ${productName} chính hãng, bảo hành 12 tháng.`,
          detailedInfo: `<p>Chi tiết về ${productName}...</p>`,
          price: price,
          originalPrice: price + 500000,
          stockQuantity: faker.number.int({ min: 0, max: 50 }),
          // Lấy ảnh từ source có keyword liên quan
          images: [
            faker.image.urlLoremFlickr({ category: config.imageKeyword, width: 640, height: 480 }),
            faker.image.urlLoremFlickr({ category: 'tech', width: 640, height: 480 })
          ],
          category: category._id,
          brand: randomBrand._id,
          specifications: config.specs(), // Gọi hàm sinh specs riêng cho từng loại
          tags: [category.name.toLowerCase(), randomBrand.name.toLowerCase(), 'hot'],
          averageRating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
          soldCount: faker.number.int({ min: 10, max: 1000 })
        });
      }
    }
    const createdProducts = await Product.insertMany(productsList);

    // 5. Orders & Others... (Giữ nguyên logic cũ hoặc đơn giản hóa)
    console.log('🛒 Creating Orders...');
    const ordersList = [];
    for (let i = 0; i < 20; i++) {
      const user = faker.helpers.arrayElement(customers);
      const product = faker.helpers.arrayElement(createdProducts);
      const qty = faker.number.int({ min: 1, max: 2 });

      ordersList.push({
        orderCode: 'ORD-' + faker.string.nanoid(8).toUpperCase(),
        userId: user._id,
        totalAmount: product.price * qty,
        items: [{
          productId: product._id,
          name: product.name,
          quantity: qty,
          price: product.price
        }],
        customerInfo: { fullName: user.fullName, email: user.email },
        paymentMethod: 'COD',
        status: 'pending'
      });
    }
    await Order.insertMany(ordersList);

    console.log('✅ Data Imported Successfully with SMART Context!');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

connectDB().then(importData);