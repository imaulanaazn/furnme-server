const Product = require('./model');
const Transaction = require('../transaction/model');
const User = require('../user/model');

module.exports = {
    getAllProducts: async (req,res)=>{
        try {
            // Extract the query parameters
            const { category, maxPrice, minPrice, rating, discount, flashSale, limit } = req.body;

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
            $limit: 7,
          },
          {
            $lookup: {
              from: 'products', // Replace 'products' with the actual collection name
              localField: '_id',
              foreignField: '_id',
              as: 'productDetails',
            },
          },
        ]); 
        
        res.status(200).json(
          mostBoughtProduct.map(prod => prod.productDetails)
          .flat()
          );
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch most bought product', error: err.message });
      }
    },
    getRecommendedProducts: async (req, res) => {
      try {
        const userId = req.headers.userid;
  
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
    },
    getFlashSaleProducts : async (req, res) => {
      try {
        const currentDate = new Date();
    
        const flashSaleProducts = await Product.find({
          flashSaleStart: { $lte: currentDate },
          flashSaleEnd: { $gte: currentDate }
        });
    
        res.status(200).json(flashSaleProducts);
      } catch (err) {
        res.status(500).json({ message: 'Failed to get flash sale products', error: err.message });
      }
    },
    updateFlashSale : async (req, res) => {
      try {
        const { productId, flashSaleStart, flashSaleEnd } = req.body;
    
        // Find the product by its ID
        const product = await Product.findById(productId);
    
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        // Update the flash sale details
        product.flashSaleStart = flashSaleStart;
        product.flashSaleEnd = flashSaleEnd;

        console.log(product)
    
        // Save the updated product
        await product.save();
    
        res.status(200).json({ message: 'Flash sale updated successfully', product });
      } catch (err) {
        res.status(500).json({ message: 'Failed to update flash sale', error: err.message });
      }
    },
    deleteFlashSale : async (req, res) => {
      try {
        const { productId } = req.params;
    
        // Find the product by its ID
        const product = await Product.findById(productId);
    
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        // Remove the flash sale details
        product.flashSaleStart = undefined;
        product.flashSaleEnd = undefined;
    
        // Save the updated product
        await product.save();
    
        res.status(200).json({ message: 'Flash sale details deleted successfully', product });
      } catch (err) {
        res.status(500).json({ message: 'Failed to delete flash sale details', error: err.message });
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