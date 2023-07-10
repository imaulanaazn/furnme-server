const Cart = require('./model');

// Helper function to calculate the total price
const calculateTotalPrice = (products) => {
let totalPrice = 0;

for (const product of products) {
    totalPrice += product.quantity * product.product.price;
}

return totalPrice;
}

module.exports = {
    addToCart : async (req, res) => {
        try {
            const { user, product, quantity } = req.body;

            // Check if the user's cart already exists
            let cart = await Cart.findOne({ user });

            if (!cart) {
            // If the cart doesn't exist, create a new cart
            cart = new Cart({ user, products: [] });
            }

            // Check if the product is already in the cart
            const existingProduct = cart.products.find(p => p.product.toString() === product);

            if (existingProduct) {
            // If the product exists in the cart, update the quantity
            existingProduct.quantity += quantity;
            } else {
            // If the product doesn't exist, add it to the cart
            cart.products.push({ product, quantity });
            }

            // Calculate the total price
            cart.totalPrice = calculateTotalPrice(cart.products);

            // Save the cart
            await cart.save();

            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ message: 'Failed to add item to cart', error: err.message });
        }
    },

    removeFromCart : async (req, res) => {
        try {
            const { user, product } = req.body;

            // Find the user's cart
            const cart = await Cart.findOne({ user });

            if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
            }

            // Remove the product from the cart
            cart.products = cart.products.filter(p => p.product.toString() !== product);

            // Calculate the total price
            cart.totalPrice = calculateTotalPrice(cart.products);

            // Save the updated cart
            await cart.save();

            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ message: 'Failed to remove item from cart', error: err.message });
        }
    },

    getCart : async (req, res) => {
        try {
            const { user } = req.body;

            // Find the user's cart
            const cart = await Cart.findOne({ user });

            if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
            }

            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ message: 'Failed to get cart', error: err.message });
        }
    }
}