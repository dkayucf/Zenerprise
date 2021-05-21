import express from 'express'
import userRoutes from './user'

const router = express.Router() // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('Pass'))

// mount user route at /users
router.use('/users', userRoutes)

export default router
