const mongoose = require('mongoose')

const categorieSchema = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    imageUrl: { type: String },
    parentCategory: { type: ObjectID, ref: categories, default: null }
  }
)

const Categorie = mongoose.model('Categorie', categorieSchema)

module.exports = Categorie