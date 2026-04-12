import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../users/schemas/user.schema';

export const CurrentUser = createParamDecorator<UserDocument>(
    (data: unknown, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest<{ user: UserDocument }>().user;
    },
);