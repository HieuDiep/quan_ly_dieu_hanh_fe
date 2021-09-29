export const isEmptyObject = (_object) => {
  let bl = Boolean(Object.keys(_object).length);
  return !bl;
};
// return Object.keys(_object).length === 0 && _object.constructor === Object;

export const isEmptyField = (_requiredField, _object) => {
  // truyền vào _requiredField là dạng object
  // vd : {name : 'msg'} => nếu thiếu trường name thì error return ra {name:'msg'}
  let error = {};
  for (const field in _requiredField) {
    if (!_object[field]) {
      error[field] = _requiredField[field];
    }
  }
  return error;
  // return object  keys : invalid field, value : msg
};
