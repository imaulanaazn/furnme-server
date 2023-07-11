const Product = require('./model');
const Transaction = require('../transaction/model');
const User = require('../user/model');

module.exports = {
    getAllProducts: async (req,res)=>{
        try {
            // Extract the query parameters
            const { category, maxPrice, minPrice, rating, discount, flashSale, limit } = req.query;

            // Construct the filter object based on the query parameters
            const filter = {};

            if (category) {
            filter.category = { $in: category.split(',') };
            }

            if (maxPrice && !isNaN(maxPrice)) {
            filter.price = { $lte: parseFloat(maxPrice) };
            }

            if (minPrice && !isNaN(minPrice)) {
            filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
            }

            if (rating && !isNaN(rating)) {
            filter.rating = { $gte: parseFloat(rating) };
            }

            if(parseInt(discount)){;
              filter.discount = {$gte:0}
            }

            const currentDate = new Date();
            if(parseInt(flashSale)){
              filter.flashSaleStart = { $lte: currentDate };
              filter.flashSaleEnd = { $gte: currentDate };
            }

            let productsResult;
            try {
              if (parseInt(limit) > 0) {
                productsResult = await Product.find(filter).limit(limit);
              } else {
                productsResult = await Product.find(filter);
              }

              res.status(200).json(productsResult);
            } catch (err) {
              res.status(500).json({ message: 'Internal server error' });
            }

            
          } catch (err) { 
            // Handle any errors that occur during the process
            res.status(500).json({ message: err.message });
          }
    },
    getTrendingProducts : async (req, res) => {
      try {
        const mostBoughtProduct = await Transaction.aggregate([
          {
            $unwind: '$products',
          },
          {
            $group: {
              _id: '$products.productId',
              totalPurchases: { $sum: '$products.quantity' },
            },
          },
          {
            $sort: { totalPurchases: -1 },
          },
          {
            $limit: 10,
          },
        ]);
    
        res.status(200).json(mostBoughtProduct);
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch most bought product', error: err.message });
      }
    },
    getRecommendedProducts: async (req, res) => {
      try {
        const { userId } = req.body;
  
        if (!userId) {
          const recommendedProd = await Product.find();
          return res.status(200).json(recommendedProd);
        }
  
        // Find the user by their ID and populate the recently viewed products
        const user = await User.findById(userId).select('recentlyViewed').populate('recentlyViewed');
  
        if (!user || user.recentlyViewed.length === 0) {
          const recommendedProd = await Product.find();
          return res.status(200).json(recommendedProd);
        }
  
        // Extract the category IDs from the recently viewed products
        const categoryIds = user.recentlyViewed.flatMap((product) => product.category);
  
        // Count the occurrence of each category ID
        const categoryCount = countOccurrences(categoryIds);
  
        // Sort the categories based on their occurrence count
        const sortedCategories = sortCategoriesByCount(categoryCount);
  
        // Get the most clicked category
        const mostClickedCategories = sortedCategories.slice(0, 3);
  
        const recommendedProd = await Product.find({ category: { $in: mostClickedCategories } });
        res.status(200).json(recommendedProd);
      } catch (err) {
        res.status(500).json({ message: 'Failed to get most clicked category', error: err.message });
      }
    }
}

// Function to count the occurrence of each category ID
const countOccurrences = (categoryIds) => {
  const count = {};

  categoryIds.forEach((categoryId) => {
    count[categoryId] = (count[categoryId] || 0) + 1;
  });

  return count;
};

// Function to sort categories based on their occurrence count
const sortCategoriesByCount = (categoryCount) => {
  const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);

  return sortedCategories.map(([categoryId]) => categoryId);
};