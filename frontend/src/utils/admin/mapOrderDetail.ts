export const ORDER_STATUS = {
    pending_confirmation: "Chờ xác nhận",
    processing: "Đang xử lí",
    shipping: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Hủy"
} as const;

export const PAYMENT_STATUS = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    failed: "Thất bại"
} as const 

export const PAYMENT_METHOD = {
    COD: "Thanh toán khi nhận hàng",
    BankTransfer: "Chuyển khoản ngân hàng",
    OnlineGateway: "Thanh toán trực tuyến"
} as const;

export function getOrderStatusLabel(status: keyof typeof ORDER_STATUS) {
    return ORDER_STATUS[status];
}

export function getPaymentStatusLabel(status: keyof typeof PAYMENT_STATUS) {
    return PAYMENT_STATUS[status];
}

export function getPaymentMethodLabel(method: keyof typeof PAYMENT_METHOD) {
    return PAYMENT_METHOD[method];
}