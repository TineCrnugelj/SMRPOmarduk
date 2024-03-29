import * as Joi from 'joi';

export interface TokenDto {
	iat: number;
	nbf?: number;
	iss: string;
	exp?: number;
	jti?: string;

	sid: number;
	sub: string;
	sname: string;
	isAdmin: boolean;
}

export const tokenSchema = Joi.object().keys({
	iat: Joi.date().timestamp('unix').required(),		// Issued At (RFC)
	nbf: Joi.date().timestamp('unix'),							// Not Before (RFC)
	iss: Joi.string().trim(),												// Issuer (RFC)
	exp: Joi.date().timestamp('unix'),							// Expire Time (RFC)
	jti: Joi.string().trim(),												// JWT ID (RFC)

	sid: Joi.number().required(),										// Subject ID
	sub: Joi.string().trim().required(),						// Subject username
	sname: Joi.string().trim().allow(null),					// Subject name
	isAdmin: Joi.bool().required(),									// Is subject an admin
});
