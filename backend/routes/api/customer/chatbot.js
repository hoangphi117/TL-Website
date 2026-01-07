import express from 'express'
const router = express.Router()
import { chatWithAI, getHistory } from '../../../controllers/customer/chatbotController.js'

router.post('/', chatWithAI)
router.get('/', getHistory)

export default router