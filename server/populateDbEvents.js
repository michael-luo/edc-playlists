import Event from '../server/models/event';
import eventData from '../json/eventData';

export default function() {
  _clear(Event).then(() => {
    _populate(Event, eventData).then(() => {
      console.log('Completed database population');
    });
  });
}

// Clear a collection
function _clear(Model) {
  const name = Model.modelName;

  return Model.remove({}).then((res) => {
    if (!res.result.ok) {
      console.error(`Failed to clear '${name}' collection`);
      return;
    }

    console.log(`Cleared the '${name}' collection`);
    return;
  });
}

// Populate a model with a list of data
function _populate(Model, data) {
  const name = Model.modelName;

  return Model.collection.insert(data).then((res) => {
    if (!res.result.ok) {
      console.error(`Failed to populate '${name}' collection`);
      return;
    }

    console.log(`Populated '${name}' collection with data:\n${JSON.stringify(res, null, 4)}`);
    return;
  });
}
