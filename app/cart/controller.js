const Cart = require('./model');
const Product = require('../product/model');

// Helper function to calculate the total price
async function calculateTotalPrice(products) {
    let totalPrice = 0;

    for (const product of products) {
      const productData = await Product.findById(product.productId);
      if (productData) {
        totalPrice += productData.price * product.quantity;
      }
    }

return totalPrice;
}

module.exports = {
    addToCart : async (req, res) => {
      try {
        const { userId, productId, quantity = 1 } = req.body;
    
        // Find the product by productId
        const product = await Product.findById(productId);
    
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        // Calculate the total price based on the product quantity and price
        const totalPrice = product.price * quantity;
    
        // Check if the user already has a cart, if not create a new cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
          cart = new Cart({
            userId,
            totalPrice,
            products: [{
              productId : product._id,
              name: product.name,
              price : product.price,
              quantity
            }],
          });
    
          await cart.save();
        } else {
          // Check if the product is already in the cart
          const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
          
          if (existingProduct) {
            // If the product exists in the cart, update its quantity and the total price
            existingProduct.quantity = quantity; // Update the quantity instead of adding
            cart.totalPrice = await calculateTotalPrice(cart.products); // Update the total price based on the new quantity
          } else {
            // If the product is not in the cart, add it to the cart
            cart.products.push({ 
              productId : product._id,
              name: product.name,
              price : product.price,
              images : product.images,
              quantity 
            });
            cart.totalPrice = await calculateTotalPrice(cart.products);
          }
    
          await cart.save();
        }
    
        res.status(200).json({ message: 'Product added to cart successfully', cart });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    },    

    removeFromCart : async (req, res) => {
        try {
            const { userId, productId } = req.query;

            // Find the user's cart
            const cart = await Cart.findOne({ userId });
            
            if (!cart) {
              return res.status(404).json({ message: 'Cart not found' });
            }
            
            // Remove the product from the cart
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            
            // Calculate the total price
            cart.totalPrice = await calculateTotalPrice(cart.products);

            // Save the updated cart
            await cart.save();

            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ message: 'Failed to remove item from cart', error: err.message });
        }
    },

    getCart : async (req, res) => {
        try {
          const { id: userId } = req.user;
      
          // Find the user's cart and populate the products field with product data
          const cart = await Cart.findOne({ userId });
      
          if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
      
          res.status(200).json({ message: 'Product retreived successfully', cart });
        } catch (err) {
          res.status(500).json({ message: 'Failed to get cart', error: err.message });
        }
    }
}