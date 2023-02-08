const Order = require('./model')

module.exports = {
  //CREATE
  createOrder : async (req,res)=>{
    const newOrder = new Order(req.body);
    
    try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //UPDATE
  updateOrder: async (req,res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //GET USER ORDERS
  getUserOrders: async (req,res) => {
    try {
      const orders = await Order.find({ userId: req.query.userId });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
