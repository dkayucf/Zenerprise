import express from 'express'

const router = express.Router() // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/storage-locations', (req, res) => res.send('Pass'))

export default router
