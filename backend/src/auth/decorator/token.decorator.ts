/**
 * User decorator
 * @see https://docs.nestjs.com/custom-decorators
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest();
	return data ? req.user && req.user[data] : req.user;
});
