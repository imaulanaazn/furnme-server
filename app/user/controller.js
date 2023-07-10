const User = require('./model');
module.exports = {
    addRecentlyViewed : async (req, res) => {
        try {
            const {productId } = req.body;
            const {userId} = req.params;

            // Find the user by their ID
            const user = await User.findById(userId);

            if (!user) {
            return res.status(404).json({ message: 'User not found' });
            }

            // Add the product to the recentlyViewed array
            user.recentlyViewed.push(productId);

            // Save the updated user document
            await user.save();

            res.status(200).json(user.recentlyViewed);
        } catch (err) {
            res.status(500).json({ message: 'Failed to add product to recently viewed', error: err.message });
        }
    },
    getRecentlyViewed : async (req, res) => {
        try {
          const { userId } = req.params;
      
          // Find the user by their ID
          const user = await User.findById(userId).populate('recentlyViewed');
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          res.status(200).json(user.recentlyViewed);
        } catch (err) {
          res.status(500).json({ message: 'Failed to get recently viewed products', error: err.message });
        }
      }      
}