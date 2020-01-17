import * as firebase from 'firebase/app';

const dateConversions = {
  dateToTimestamp(date) {
    return firebase.firestore.Timestamp.fromDate(new Date(date))
  },

  timestampToDate(ts) {
    const local = ts.toDate();
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toJSON().slice(0,10)
  }
}

export default dateConversions;