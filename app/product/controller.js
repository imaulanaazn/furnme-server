const Product = require('./model');
const Transaction = require('../transaction/model');

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
    }
}