const Cart = require('./model')

module.exports = {
    addToCart: async (req,res)=>{
        const newCart = new Cart(req.body);

        try {
            const savedCart = await newCart.save();
            res.status(200).json(savedCart);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getUserCart: async (req,res)=>{
        const {userid} = req.query;

        try{
            const userCart = await Cart.find({userId:userid});
            res.status(200).json({data:userCart})
        }catch(err){
            res.status(500).json(err)
        }
    },
    editCartItems: async (req,res)=>{
        try {
            const updatedCart = await Cart.findByIdAndUpdate(
              req.params.id,
              {
                $set: req.body,
              },
              { new: true }
            );
            res.status(200).json(updatedCart);
          } catch (err) {
            res.status(500).json(err);
          }
    },
    deleteCart: async (req,res)=>{
        try {
            await Cart.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Cart has been deleted..."});
          } catch (err) {
            res.status(500).json(err);
          }
    }
}