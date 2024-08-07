import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isISO8601 } from 'class-validator';

@ValidatorConstraint({ async: false })
class IsTimestampWithTZConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    try {
      new Date(value);
    } catch (e) {
      return false;
    }
    // Use class-validator's isISO8601 to check if the value is a valid ISO 8601 string with timezone
    return isISO8601(value, { strict: true });
  }

  defaultMessage(args: ValidationArguments) {
    return 'The value ($value) is not a valid ISO 8601 timestamp with timezone!';
  }
}

export function IsTimestampWithTZ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimestampWithTZConstraint,
    });
  };
}
