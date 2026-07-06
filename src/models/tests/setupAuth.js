import { useAuthStore } from '../../stores/authStore';
import Auth from '../Auth';
import { createPinia, setActivePinia } from 'pinia';

const setupAuth = (() => {
    let savedAuth = null;

    function authState() {
        const store = useAuthStore();
        return store.$state;
    }

    function resetAuth() {
        const store = useAuthStore();
        store.$reset();
    }

    function loginToStore(authData) {
        const store = useAuthStore();
        store.login(authData);
    }

    async function doLogin() {
        localStorage.clear();
        resetAuth();

        const result = await Auth.login({
            login: 'admin',
            password: '112233',
        });

        console.log('Login result:', result);

        if (!result || !result.token) {
            throw new Error('Login failed: No token received');
        }

        // Update store with login result
        loginToStore(result);

        // Verify token is stored
        const store = useAuthStore();
        console.log('Store state after login:', store.$state);

        return result;
    }

    // Setup untuk digunakan di beforeAll
    async function setupTestSuite() {
        setActivePinia(createPinia());
        localStorage.clear();
        resetAuth();

        try {
            const auth = await doLogin();
            console.log('Initial login response:', auth);
            savedAuth = auth; // Simpan hasil auth untuk digunakan di beforeEach
            return auth;
        } catch (error) {
            console.error('Initial login failed:', error);
            throw error;
        }
    }

    // Setup untuk digunakan di beforeEach
    function setupTestCase() {
        setActivePinia(createPinia()); // Reset Pinia store
        loginToStore(savedAuth); // Restore auth state dari login awal
        const store = authState();
        console.log('Store state in test case:', store);
        return store;
    }

    return {
        authState,
        resetAuth,
        loginToStore,
        doLogin,
        setupTestSuite, // Untuk beforeAll
        setupTestCase, // Untuk beforeEach
    };
})();

export default setupAuth;
