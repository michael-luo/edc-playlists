import Event from '../models/event';

export function getEvents(req, res) {
  Event
    .find()
    .sort('name')
    .populate({
      path: 'artists',
      options: {
        sort: 'name'
      }
    })
    .exec((err, events) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ data: events });
    });
}
