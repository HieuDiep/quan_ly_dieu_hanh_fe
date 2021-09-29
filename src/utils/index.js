import _ from 'lodash';
export const nomalizeData = (data, fieldID = '_id') => {
  return data.reduce(
    (r, d) => {
      return {
        byId: {
          ...r.byId,
          [d[fieldID]]: d
        },
        ids: r.ids.concat(d[fieldID])
      };
    },
    { byId: {}, ids: [] }
  );
};

export const cipher = (text) => {
  try {
    const salt = process.env.SECERT_KEY_CIPHER || 'tobeornottobe';
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
      .split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  } catch (error) {
    return text;
  }
};

export const decipher = (encoded) => {
  try {
    const salt = process.env.SECERT_KEY_CIPHER || 'tobeornottobe';
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');
  } catch (error) {
    return encoded;
  }
};

String.prototype.hexDecode = function () {
  var j;
  var hexes = this.match(/.{1,4}/g) || [];
  var back = '';
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
};
export const getPartner = (_users, me) => {
  return _.filter(_users, (o) => {
    return o !== me.username;
  })[0];
};
export const convertHexToUTF8 = (hexString) => {
  let result = '';
  try {
    result = decodeURIComponent(hexString.replace(/(..)/g, '%$1'));
  } catch (e) {
    result = hexString;
  }
  return result;
};

export const encodeUTF8ToHex = (str) => {
  let hex;
  try {
    hex = unescape(encodeURIComponent(str))
      .split('')
      .map(function (v) {
        return v.charCodeAt(0).toString(16);
      })
      .join('');
  } catch (e) {
    hex = str;
  }
  return hex;
};

export const convertDateTimeGroup = (dateString) => {
  const current = new Date();
  const _date = current.getDate().toString().padStart(2, '0');
  const _month = (current.getMonth() + 1).toString().padStart(2, '0');
  const _year = current.getFullYear().toString();

  const now = new Date(dateString);
  const date = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString();

  const minutes = now.getMinutes().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');

  let dateResult = `${date}/${month}/${year}`;

  if (dateResult === `${_date}/${_month}/${_year}`) {
    dateResult = 'Hôm nay';
  }

  return `${dateResult} ${hours}:${minutes}`;
};

export const splitContactList = (contacts) => {
  const result = [];
  const objIndex = {};

  let maxOfIndex = 0;

  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];
    const arraySplits = contact.full_name.split(' ');
    const firstLetterOfName = arraySplits[arraySplits.length - 1][0];
    if (!objIndex[firstLetterOfName] && objIndex[firstLetterOfName] !== 0) {
      objIndex[firstLetterOfName] = maxOfIndex;
      result[maxOfIndex] = {
        letter: firstLetterOfName,
        users: [contact]
      };
      maxOfIndex += 1;
    } else {
      const users = result[objIndex[firstLetterOfName]].users.concat(contact);
      result[objIndex[firstLetterOfName]].users = users;
    }
  }

  return result.sort((r1, r2) =>
    r1.letter > r2.letter ? 1 : r2.letter > r1.letter ? -1 : 0
  );
};
export const getLmMsg = (_lm) => {
  const gap = new Date().getTime() - new Date(_lm).getTime();
  const curentH = new Date().getHours();

  const time = new Date(_lm);
  const hours = time.getHours().toString().padStart(2, '0');
  const min = time.getMinutes().toString().padStart(2, '0');
  const date = time.getDate().toString().padStart(2, '0');
  const month = (time.getMonth() + 1).toString().padStart(2, '0');
  // const year = time.getFullYear().toString();
  let str = '';
  if (gap < curentH * 60 * 60 * 1000) {
    str = `Hôm nay ${hours}:${min}`;
  } else if (gap < 48 * 60 * 60 * 1000) {
    str = `Hôm qua ${hours}:${min}`;
  } else {
    str = `${date} thg ${month} ${hours}:${min}`;
  }
  return str;
};
const getDayOfMessage = (messageTime) => {
  const now = new Date(messageTime);
  const date = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString();

  return `${date}/${month}/${year}`;
};

const sortMessages = (messages) => {
  return messages.sort((m1, m2) => {
    let time1 = m1.ts;
    let time2 = m2.ts;

    if (new Date(time1) < new Date(time2)) {
      return -1;
    } else if (new Date(time1) > new Date(time2)) {
      return 1;
    } else return 0;
  });
};

export const splitMessages = (messages) => {
  const distance = 60 * 3; // 3'
  let currentDay = '';
  let currentUser = '';
  let result = [];
  let objectIds = {};
  const _messages = sortMessages(messages);

  for (let message of _messages) {
    if (objectIds[message._id]) continue;
    objectIds[message._id] = message._id;
    if (
      currentDay &&
      getDayOfMessage(message.ts) !== getDayOfMessage(currentDay)
    ) {
      result.push({
        breaking_day: message.ts
      });
    }

    if (message.t) {
      result.push(message);
      currentDay = message.ts;
      currentUser = '';
      continue;
    }

    if (currentUser === message.u._id) {
      if (result.length === 0) {
        result[result.length] = {
          u: message.u,
          messages: [message]
        };
      } else {
        if (
          !result[result.length - 1].t &&
          !result[result.length - 1].breaking_day
        ) {
          const firstMessageInBlock = result[result.length - 1].messages[0];
          const timeOfFirstMessage = new Date(firstMessageInBlock.ts).getTime();
          const timeOfCurrentMessage = new Date(message.ts).getTime();

          if ((timeOfCurrentMessage - timeOfFirstMessage) / 1000 <= distance) {
            if (result[result.length - 1]) {
              result[result.length - 1].messages = result[
                result.length - 1
              ].messages.concat(message);
            } else {
              result[result.length - 1] = {
                u: message.u,
                messages: [message]
              };
            }
          } else {
            result[result.length] = {
              u: message.u,
              messages: [message]
            };
          }
        } else {
          result[result.length] = {
            u: message.u,
            messages: [message]
          };
        }
      }
    } else {
      result[result.length] = {
        u: message.u,
        messages: [message]
      };
    }
    currentDay = message.ts;
    currentUser = message.u._id;
  }

  return result;
};

export const getQuoteType = (quoteMessage) => {
  if (quoteMessage.file) {
    const typeOfFile = quoteMessage.file.type.split('/')[0];
    if (typeOfFile === 'image') {
      return 'IMAGE';
    }
    return 'FILE';
  }
  return 'TEXT';
};

export const getQuoteImageUrl = (quoteMessage) =>
  process.env.CHAT_URL + quoteMessage.attachments[0].image_url;

export const isEmptyObject = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

export const sortGroupByLatestMessage = (groups) => {
  return groups.sort((r1, r2) => {
    let time1 = r1.lm || r1._updatedAt;
    let time2 = r2.lm || r2._updatedAt;

    if (r1.lm) {
      time1 = r1.lm;
    }

    if (r2.lm) {
      time2 = r2.lm;
    }

    if (new Date(time1) > new Date(time2)) {
      return -1;
    } else if (new Date(time1) < new Date(time2)) {
      return 1;
    } else return 0;
  });
};

export const convertLastLogin = (lastLogin) => {
  const minutes = 60;
  const hours = 60 * 60;
  const days = 60 * 60 * 24;

  const now = Math.floor(new Date().getTime() / 1000);
  const _lastLogin = Math.floor(new Date(lastLogin).getTime() / 1000);

  const sub = now - _lastLogin;

  if (sub < minutes) return 'Vừa truy cập';
  if (sub < hours) {
    const _minutes = Math.floor(sub / minutes);
    return `${_minutes} phút trước`;
  }
  if (sub < days) {
    const _hours = Math.floor(sub / hours);
    return `${_hours} giờ trước`;
  }

  const _days = Math.floor(sub / days);
  return `${_days} ngày trước`;
};

export const convertDateAnnouncement = (dateString) => {
  const current = new Date();
  const _date = current.getDate().toString().padStart(2, '0');
  const _month = (current.getMonth() + 1).toString().padStart(2, '0');
  const _year = current.getFullYear().toString();

  const dateValue = dateString.split(' ')[0];
  const timeValue = dateString.split(' ')[1];

  const date = dateValue.split('-')[2].padStart(2, '0');
  const month = dateValue.split('-')[1].padStart(2, '0');
  const year = dateValue.split('-')[0].toString();

  const minutes = timeValue.split(':')[1].padStart(2, '0');
  const hours = timeValue.split(':')[0].padStart(2, '0');

  let dateResult = `${date}/${month}/${year}`;

  if (dateResult === `${_date}/${_month}/${_year}`) {
    dateResult = 'Hôm nay';
  }

  return `${dateResult} ${hours}:${minutes}`;
};

export const convertNewDateToAnnouncementDate = () => {
  const current = new Date();
  const _date = current.getDate().toString().padStart(2, '0');
  const _month = (current.getMonth() + 1).toString().padStart(2, '0');
  const _year = current.getFullYear().toString();

  const minutes = current.getMinutes().toString().padStart(2, '0');
  const hours = current.getHours().toString().padStart(2, '0');

  return `${_year}-${_month}-${_date} ${hours}:${minutes}`;
};

export const convertCreatedAt = (dateString) => {
  const date = dateString.split(' ')[0];
  const [_year, _month, _day] = date.split('-');

  return `${_day}/${_month}/${_year}`;
};

export const convertDateline = (dateString, isDone = false) => {
  let _dateline = {
    isOver: false,
    label: ''
  };

  const date = dateString.split(' ')[0];
  const time = dateString.split(' ')[1];
  const [_year, _month, _day] = date.split('-');
  const [_hour, _minute] = time.split(':');

  _dateline.label = `${_hour}:${_minute} ${_day}/${_month}/${_year}`;

  if (isDone) return _dateline;

  const isOverDateline = new Date(dateString) < new Date();

  if (isOverDateline) {
    const totalOverDay = Math.floor(
      (new Date() - new Date(dateString)) / 1000 / 86400
    );
    const totalOverHour = Math.floor(
      (new Date() - new Date(dateString)) / 1000 / (60 * 60)
    );
    const totalOverMinute = Math.floor(
      (new Date() - new Date(dateString)) / 1000 / 60
    );
    const totalOverSecond = Math.floor(
      (new Date() - new Date(dateString)) / 1000
    );

    if (totalOverDay !== 0) {
      _dateline.isOver = true;
      _dateline.label += ` Quá ${totalOverDay} ngày`;
    } else {
      if (totalOverHour !== 0) {
        _dateline.isOver = true;
        _dateline.label += ` Quá ${totalOverHour} giờ`;
      } else {
        if (totalOverMinute !== 0) {
          _dateline.isOver = true;
          _dateline.label += ` Quá ${totalOverMinute} phút`;
        } else {
          _dateline.isOver = true;
          _dateline.label += ` Quá ${totalOverSecond} giây`;
        }
      }
    }
  }

  return _dateline;
};

export const getNameOfRoom = (_room, me) => {
  let name = '';
  _room.typeRoom === 1
    ? (() => {
        // private chat
        // console.log(_room, _room.usernames);
        name = getPartner(_room.usernames, me);
      })()
    : (() => {
        // group chat
        name = _room.fname;
      })();
  return name;
};
export const getImageDimensions = (img) => {
  return new Promise((resolve) => {
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
  });
};
export const getFileType = (_fileName) => {
  return _fileName.split('.').pop().toString().toLowerCase();
};
