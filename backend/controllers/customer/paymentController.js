import Order from '../../models/orderModel.js';
import Payment from '../../models/paymentModel.js';
import * as vnpayService from '../../utils/vnpayService.js';
import * as momoService from '../../utils/momoService.js';
import * as bankService from '../../utils/bankQrService.js';

export const createPayment = async (req, res) => {
  const { orderCode, paymentMethod, paymentProvider } = req.body;
  const user = req.user

  if (paymentMethod != "COD" && paymentMethod != "BankTransfer" && paymentMethod != "OnlineGateway") {
    return res.status(400).json({
      message: "Payment method invalid"
    })
  }

  if (paymentMethod == "OnlineGateway" && paymentProvider != "VNPAY" && paymentProvider != "Momo") {
    return res.status(400).json({
      message: "Payment provider invalid"
    })
  }

  try {
    const order = await Order.findOne({ orderCode })

    if (!order || order.paymentStatus == 'paid' || order.paymentStatus == 'failed') {
      return res.status(400).json({
        message: "Order invalid"
      });
    }

    order.paymentMethod = paymentMethod;
    const savedOrder = await order.save();
    let paymentUrl = null;

    if (paymentMethod === 'OnlineGateway') {
      const newPayment = new Payment({
        orderId: savedOrder._id,
        userId: user._id,
        amount: savedOrder.totalAmount,
        method: paymentProvider,
        status: 'pending',
        transactionCode: null
      });
      await newPayment.save();

      if (paymentProvider === 'VNPAY') {
        paymentUrl = vnpayService.createPaymentUrl(req, savedOrder);
      }
      else if (paymentProvider === 'Momo') {
        paymentUrl = await momoService.createMomoPayment(savedOrder);
      }
    }
    else if (paymentMethod === 'BankTransfer') {
      paymentUrl = bankService.generateVietQR(savedOrder);
    }

    res.status(201).json({
      message: "Create payment successful",
      order: savedOrder,
      paymentUrl
    });

  } catch (error) {
    res.status(500).json({
      message: "Create payment error",
      error: error
    });
  }
};