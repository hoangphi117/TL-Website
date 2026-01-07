import express from 'express'
const router = express.Router()
import { addWithList, removeWithList, getWishList } from '../../../controllers/customer/wishlistController.js'

router.post('/:id', addWithList)
router.delete('/:id', removeWithList)
router.get('/', getWishList)

export default router