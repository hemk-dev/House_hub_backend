import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ErrorResponseUtility {
  static handleApiResponseError(error) {
    if (typeof error.response !== 'undefined') {
      switch (error.response.statusCode) {
        case 401:
          throw new UnauthorizedException(error.response.message);
        case 403:
          throw new ForbiddenException(error.response.message);
        case 404:
          throw new NotFoundException(error.response.message);
        case 406:
          throw new NotAcceptableException(error.response.message);
        case 409:
          throw new ConflictException(error.response.message);
        case 422:
          throw new BadRequestException(error.response.message);
        case 400:
          throw new BadRequestException(error.response.message);
        case 500:
          throw new InternalServerErrorException(error.response.message);
        default:
          throw new InternalServerErrorException(
            `${error.message}&&&id&&&${error.Message}`,
          );
      }
    }
    throw new InternalServerErrorException(`Internal Server Error: ${error}`);
  }
}
