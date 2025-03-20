// Mock Firebase configuration
// This is a simplified implementation without actual Firebase dependencies

export const database = {
  ref: (path: string) => ({
    on: (event: string, callback: Function) => {
      console.log(`Listening to ${event} event on ${path}`);
      return null;
    },
    off: (event?: string) => {
      console.log(`Stopped listening to ${event || 'all'} events on ${path}`);
      return null;
    },
    set: (data: any) => {
      console.log(`Setting data at ${path}:`, data);
      return Promise.resolve();
    },
    update: (data: any) => {
      console.log(`Updating data at ${path}:`, data);
      return Promise.resolve();
    },
    push: () => ({
      key: `mock-key-${Date.now()}`,
      set: (data: any) => {
        console.log(`Pushing data to ${path}:`, data);
        return Promise.resolve();
      }
    }),
  }),
};

// Mock auth object without actual Firebase authentication
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: Function) => {
    console.log('Auth state change listener added');
    return () => console.log('Auth state change listener removed');
  },
  signInWithEmailAndPassword: (email: string, password: string) => {
    console.log(`Mock sign in with email: ${email}`);
    return Promise.resolve({ user: { uid: 'mock-user-id', email } });
  },
  createUserWithEmailAndPassword: (email: string, password: string) => {
    console.log(`Mock user creation with email: ${email}`);
    return Promise.resolve({ user: { uid: 'mock-user-id', email } });
  },
  signOut: () => {
    console.log('Mock sign out');
    return Promise.resolve();
  }
};

export default {
  name: 'shire-of-irwin-app',
  database,
  auth,
}; 