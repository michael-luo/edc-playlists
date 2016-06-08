import Event from '../models/event';

export function getEvents(req, res) {
  Event.find().sort('-dateAdded').exec((err, events) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ data: events });
  });
}
