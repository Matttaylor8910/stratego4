import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';
import {User} from 'types';

import {UtilService} from './util.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  authState: firebase.User|null = null;

  constructor(
      private readonly afAuth: AngularFireAuth,
      private readonly afs: AngularFirestore,
      private readonly utilService: UtilService,
  ) {
    this.startSession();
  }

  /**
   * Start a "session" by determining if the user is currently logged in or not
   * and logging them in anonymously if they're not logged in. This ensure that
   * we have a uid for each user. Anonymous auth tokens do not expire and are
   * stored locally so the uid should never change unless they uninstall, or
   * afAuth.auth.signOut() is called
   */
  startSession(): Promise<string> {
    return new Promise(resolve => {
      this.afAuth.authState.pipe(take(1)).subscribe(async (auth) => {
        if (auth === null) {
          await this.loginAnonymously();
        } else {
          this.authState = auth;
        }
        resolve(this.authState.uid);
      });
    });
  }

  /**
   * Get the current userId or wait for the session to start to return a userId
   * for use throughout the app
   */
  getUserId(): Promise<string> {
    return new Promise(async resolve => {
      const uid = this.currentUserId;
      if (uid) {
        resolve(uid);
      } else {
        resolve(await this.startSession());
      }
    });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.afAuth.auth.currentUser !== null;
  }

  // Returns current user data
  get currentUser(): firebase.User|null {
    return this.afAuth.auth.currentUser;
  }

  // Returns current user ID
  get currentUserId(): string {
    return this.afAuth.auth.currentUser ? this.afAuth.auth.currentUser.uid : '';
  }

  /**
   * Every user is technically "authenticated" because we log them in
   * anonymously. This function returns true if the user is logged in with a
   * real auth provider other than anonymous
   */
  get isLoggedIn(): boolean {
    return this.authenticated && this.currentUser.email !== null;
  }

  /**
   * Log a user in anonymously
   */
  loginAnonymously(): Promise<void|firebase.auth.UserCredential> {
    return this.afAuth.auth.signInAnonymously()
        .then((userCredential) => {
          this.authState = userCredential.user;
          this.updateUserData(userCredential.user);
        })
        .catch(error => console.log(error));
  }

  /**
   * Login given an email and password
   */
  async loginWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .catch(this.errorHandler.bind(this));
  }

  /**
   * Create an account with the given email and password then save the given
   * name to their user document
   */
  async signUpWithEmailAndPassword(
      name: string, email: string, password: string) {
    const userCredential =
        await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .catch(this.errorHandler.bind(this));

    // if we have a valid user credential, add/update the user document
    if (userCredential && userCredential.user !== null) {
      this.updateUserData(userCredential.user, {name});
    }
  }

  /**
   * Send a password reset email and catch errors
   */
  async sendPasswordResetEmail(email: string) {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(email);
    } catch (error) {
      // do nothing in the case of a failure except re-throw
      if (!error.code.startsWith('auth/')) {
        throw error;
      }
    }
    this.utilService.showToast(
        `If an account exists for ${
            email}, an email will be sent with further instructions`,
        5000);
  }

  /**
   * Handle AngularFireAuth errors and present toasts
   */
  errorHandler(error: {code: string, message: string}) {
    let {message} = error;
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Please enter a valid email address';
        break;
      case 'auth/user-not-found':
        message = 'An account with that email address does not exist';
        break;
      case 'auth/wrong-password':
        message = 'Invalid email or password';
        break;
      case 'auth/email-already-in-use':
        message = 'This email is already in use. Login or reset password';
        break;
      case 'auth/popup-closed-by-user':
        // if they close the popup, just do nothing
        return;
      default:
        break;
    }

    // show a toast and re-throw the error if it's not from Firebase Auth
    this.utilService.showToast(message);
    if (!error.code.startsWith('auth/')) {
      throw error;
    }
  }

  /**
   * Whenever a user logs in in with any auth service, call this function to
   * add/update that user's data in Firestore
   */
  private async updateUserData(
      firebaseUser: firebase.User, additionalInfo?: Partial<User>) {
    const path = `users/${firebaseUser.uid}`;
    const data: Partial<User> = {id: firebaseUser.uid};

    if (firebaseUser.displayName) {
      data.name = firebaseUser.displayName;
    }
    if (firebaseUser.email) {
      data.email = firebaseUser.email;
    }
    if (firebaseUser.photoURL) {
      data.photoURL = firebaseUser.photoURL;
    }

    // assign any additional info passed in
    Object.assign(data, additionalInfo);

    await this.afs.doc(path).set(data, {merge: true});
  }

  /**
   * You can never fully log out of the mobile app, logging out just spawns a
   * new anonymous account
   */
  async logout(): Promise<void> {
    this.authState = null;
    await this.afAuth.auth.signOut();
    await this.loginAnonymously();
  }
}
