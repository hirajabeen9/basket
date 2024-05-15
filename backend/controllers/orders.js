import Order from "../models/order.js";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51O1YXlAO8EpzcQpnA6JmvngkdtGeQpiL8y64e4Sp8geUUumugTgd0mgYciVU0cU09nN9NZLrtUG5BwmgaPfpxlrK00wffNsWC1"
  // "sk_test_51IutRpCcy8OEmYvUq77adzYjJTDLe8TJl5UW6eg99TzYWTfIofFKeY4G30I70p7ajKhlAuw8lXfCjgpRDxAyxZUX004L1dEEEP"
);

// PATH     : /api/orders
// METHOD   : GET
// ACCESS   : Private
// DESC     : Get my orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const _id = req.user._id;
  let orders = await Order.find({ user: _id });
  res.json(orders);
});

// PATH     : /api/orders/:id
// METHOD   : GET
// ACCESS   : Private
// DESC     : Get order by id
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("user", "name email");
  if (order) {
    if (order.user._id === req.user._id) {
      return res.json(order);
    }

    if (req.user.isAdmin) {
      return res.json(order);
    }
    res.status(403);
    throw new Error("You don't have permission to view this order.");
  } else {
    res.status(404);
    throw new Error("order not found.");
  }
});

// PATH     : /api/orders
// METHOD   : GET
// ACCESS   : Private
// DESC     : Get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
  let orders = await Order.find({});
  res.json(orders);
});
// export const getAllOrders = asyncHandler(async (req, res) => {
//   try {
//     const orders = await Order.find({});
//     console.log("orders list backend:", orders);
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Server error while fetching orders." });
//   }
// });


// PATH     : /api/orders/
// METHOD   : POST
// ACCESS   : Private
// DESC     : Create new order
export const createOrder = asyncHandler(async (req, res) => {
  let {
    orderItems,
    shippingAddress,
    subTotal,
    shippingPrice,
    saleTax,
    totalPrice,
    paymentInfo,
  } = req.body;

  const user = req.user;

  await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: "PKR",
    confirm: true,
    payment_method: paymentInfo.id,
    description: `${user.name}(${user.email}) bought ${orderItems.length} item(s)`,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  let order = new Order({
    orderItems,
    shippingAddress,
    subTotal,
    shippingPrice,
    saleTax,
    totalPrice,
    paymentInfo,
    isPaid: true,
    paidAt: new Date(),
    user: user._id,
  });

  let createdOrder = await order.save();

  res.statusCode = 201;
  res.json({ id: createdOrder._id });
});

const updateProductItems = async (orderItems) => {
  orderItems.forEach(async (orderItem) => {
    const { product, qty } = orderItem;
    //
  });
};
// PATH     : /api/orders/:id
// METHOD   : Put
// ACCESS   : Private
// DESC     : Get order by id and mark it as delivered
export const updateOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("order id:", id);
  const order = await Order.findById(id).populate("user", "name email");
  if (order) {
    if (order.user._id === req.user._id || req.user.isAdmin) {
      // Check if the order is already delivered
      if (order.isDelivered) {
        return res.json({ message: "This order is already marked as delivered." });
      }

      // Mark the order as delivered
      order.isDelivered = true;
      await order.save();

      return res.json({ message: "Order marked as delivered.", order });
    } else {
      res.status(403);
      throw new Error("You don't have permission to view this order.");
    }
  } else {
    res.status(404);
    throw new Error("Order not found.");
  }
});
// Add a new route to get the total count of orders
// PATH     : /api/orders/count
// METHOD   : GET
// ACCESS   : Public
// DESC     : Count All Orders
export const getAllOrdersCount = asyncHandler(async (req, res) => {
  const orderCount = await Order.countDocuments({});
  res.json({ count: orderCount });
});



// API endpoint to fetch sales data by month and year
export const getSalesByMonthAndYear = asyncHandler(async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          isPaid: true, // Assuming you want to consider only paid orders
        },
      },
      {
        $project: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
