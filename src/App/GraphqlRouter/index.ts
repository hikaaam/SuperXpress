import { buildSchema } from 'type-graphql';
import UserResolver from './UserResolver';
import { validateJWT } from '../Middleware/jwt'
const dotenv = require("dotenv");
dotenv.config();

export default buildSchema({
    resolvers: [
        UserResolver,
    ],
    authChecker: ({ context }) => {
        if (process.env.graphql_auth === 'false') return true;
        // here we can read the user from context
        // and check his permission in the db against the `roles` argument
        // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
        const jwtToken = context.authorization;
        if(jwtToken == null) throw new Error("No Authorization Header!!");
        const { success } = validateJWT(jwtToken);
        return success; //return true if authorized and return false if not
    }
}); //put another resolver here