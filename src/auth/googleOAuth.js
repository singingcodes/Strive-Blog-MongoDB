import GoogleStrategy from "passport-google-oauth20"
import UsersModel from "../services/users/model.js"
import { generateAccessToken } from "./tools.js"
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/users/googleRedirect`,
    passReqToCallback: true,
  },
  async (_, __, profile, passportNext) => {
    try {
      // This callback function is executed when Google sends us a successfull response back
      // Here we are receiving some informations about the user from Google (scopes --> email, profile)

      // 1. Check if the user is already in our db
      const user = await UsersModel.findOne({ email: profile._json.email })

      if (user) {
        // 2. If he/she is there --> generate accessToken (optionally a refreshToken)
        const token = await generateAccessToken(user)
        // 3. Then we can go next (we go to the /googleRedirect route handler)
        passportNext(null, { token })
      } else {
        // 4. Else if the user is not in our db --> create that user and generate an accessToken (optionally a refreshToken)
        const { given_name, family_name, email } = profile._json

        const newUser = new UsersModel({
          firstName: given_name,
          lastName: family_name,
          email,
          googleID: profile.id,
        })
        const createdUser = await newUser.save()
        const { token } = await generateAccessToken(createdUser)
        // 5. Next
        passportNext(null, { token })
      }
    } catch (error) {
      // in case of errors we gonna use passportNext
      passportNext(error)
    }
  }
)
export default googleStrategy
