const Product = require('./model');
module.exports = {
    getAllProducts: async (req,res)=>{
        try {
            // Extract the query parameters
            const { category, maxPrice, minPrice, rating, discount, flashSale } = req.query;

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

            await Product.find(filter)
            .then(products => {
              res.status(200).json(products);
            })
            .catch(err => {
              res.status(500).json({ message: 'Internal server error' });
            })
            
          } catch (err) { 
            // Handle any errors that occur during the process
            res.status(500).json({ message: err.message });
          }
    }
}