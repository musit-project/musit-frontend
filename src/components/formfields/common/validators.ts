import { TODO } from '../../../types/common';

export const validateString = (inValue: TODO, minimumLength = 0, maximumLength = 20) => {
  const value = inValue ? inValue.trim() : '';
  return value.length < minimumLength || value.length > maximumLength
    ? 'error'
    : 'success';
};

export const validateNumber = (
  value = '',
  minimumLength = 0,
  maximumLength = 10,
  precision = 3
) => {
  /* eslint-disable prefer-template */
  const expression =
    '^(-?\\d{' +
    minimumLength +
    ',' +
    maximumLength +
    '})(' +
    (precision > 0 ? ',' : '') +
    '\\d{0,' +
    precision +
    '})?$';
  /* eslint-enable prefer-template */
  const matcher = new RegExp(expression);
  const matches = matcher.test(value);
  return matches ? 'success' : 'error';
};

const validate = (source: TODO) => {
  let lValue: string | null = ''; //TODO: Use undefined instead of null?
  if (source.validator) {
    lValue = source.validator;
  } else {
    switch (source.validate) {
      case 'text':
        lValue = validateString(source.value, source.minimumLength, source.maximumLength);
        break;
      case 'number':
        lValue = validateNumber(
          source.value,
          source.minimumLength,
          source.maximumLength,
          source.precision
        );
        break;
      default:
        lValue = null;
    }
  }
  return lValue;
};

export default validate;
