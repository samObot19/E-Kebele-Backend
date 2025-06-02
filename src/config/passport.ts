import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserUseCase } from '../application/use-cases/user';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { config } from './env';

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

// Debug log configuration
console.log('Initializing Google Strategy with:');
console.log('Client ID:', config.googleAuth.clientID);
console.log('Callback URL:', config.googleAuth.callbackURL);

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleAuth.clientID,
      clientSecret: config.googleAuth.clientSecret,
      callbackURL: config.googleAuth.callbackURL,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google auth callback received');
        console.log('Profile:', JSON.stringify(profile, null, 2));
        
        // Check if user exists
        let user = await userUseCase.getUserByEmail(profile.emails?.[0]?.value || '');

        if (!user) {
          // Create new user
          user = await userUseCase.registerUser({
            userId: `google_${profile.id}`,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || '',
            googleId: profile.id,
            role: 'resident', // Default role
            status: 'pending',
            phone: '',
            address: '',
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Google auth error:', error);
        return done(error as Error);
      }
    }
  )
);

// Configure JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
    },
    async (jwtPayload, done) => {
      try {
        const user = await userUseCase.getUserById(jwtPayload.userId);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport; 