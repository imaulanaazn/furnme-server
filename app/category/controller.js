const Category = require('./model');

module.exports = {
    addCategory : (req, res) => {
        const { name, thumbnail } = req.body;
      
        // Create a new Category object
        const newCategory = new Category({
          name: name,
          thumbnail: thumbnail
        });
      
        // Save the category to the database
        newCategory.save()
          .then((category) => {
            res.status(201).json({ message: 'Category added successfully', category });
          })
          .catch((error) => {
            console.error('Error adding category:', error);
            res.status(500).json({ message: 'Internal server error' });
          });
    },
    getCategories : (req, res) => {
        Category.find()
          .then((categories) => {
            res.status(200).json(categories);
          })
          .catch((error) => {
            console.error('Error retrieving categories:', error);
            res.status(500).json({ message: 'Internal server error' });
          });
    },
    getCategoryById : (req, res) => {
        const categoryId = req.params.id;
      
        Category.findById(categoryId)
          .then((category) => {
            if (!category) {
              return res.status(404).json({ message: 'Category not found' });
            }
      
            res.status(200).json(category);
          })
          .catch((error) => {
            console.error('Error retrieving category:', error);
            res.status(500).json({ message: 'Internal server error' });
          });
    },
    deleteCategoryById : (req, res) => {
        const categoryId = req.params.id;
      
        Category.findByIdAndDelete(categoryId)
          .then((category) => {
            if (!category) {
              return res.status(404).json({ message: 'Category not found' });
            }
      
            res.status(200).json({ message: 'Category deleted successfully' });
          })
          .catch((error) => {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Internal server error' });
          });
    }
}