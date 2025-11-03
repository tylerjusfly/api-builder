
import { Router } from 'express';
import { getLatestRecording } from './session.service';

const router = Router();

router.get('/recordings/:room', async (req, res) => {
  const { room } = req.params;
  try {
    const jamSession = await getLatestRecording(room);
    if (jamSession && jamSession.events) {
      res.json(jamSession.events);
    } else {
      res.status(404).json({ error: 'No recordings found for this room' });
    }
  } catch (error) {
    console.error('Failed to retrieve recordings:', error);
    res.status(500).json({ error: 'Failed to retrieve recordings' });
  }
});

export const sessionRouter = router;
