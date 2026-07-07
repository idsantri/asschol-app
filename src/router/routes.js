import MainLayout from '@/layouts/MainLayout.vue';
import HomeView from '@/pages/HomeView.vue';

export default [
    {
        path: '/',
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/pages/auth/LoginPage.vue'),
            },
            {
                path: 'logout',
                name: 'Logout',
                component: () => import('@/pages/auth/LogoutPage.vue'),
            },
        ],
    },
    {
        path: '/',
        component: MainLayout,
        children: [
            // Home
            {
                path: '',
                name: 'home',
                component: HomeView,
            },

            // Members
            {
                path: 'members',
                meta: { title: 'Anggota' },
                children: [
                    {
                        path: '',
                        component: () => import('../pages/member/MemberIndex.vue'),
                    },
                    {
                        path: ':id',
                        component: () => import('../pages/member/MemberDetail.vue'),
                    },
                ],
            },

            // Activities
            {
                path: 'activities',
                meta: { title: 'Kegiatan' },
                children: [
                    {
                        path: '',
                        component: () => import('@/pages/activities/ActivitiesIndex.vue'),
                    },
                    {
                        path: ':id',
                        component: () => import('@/pages/activities/ActivityDetail.vue'),
                        redirect: (to) => `${to.path}/absence-summaries`,
                        children: [
                            {
                                path: 'absence-summaries',
                                component: () => import('@/pages/absences/AbsenceSummary.vue'),
                            },
                            {
                                path: 'notes',
                                component: () => import('@/pages/notes/IndexNotes.vue'),
                            },
                        ],
                    },
                    {
                        path: ':id/notes/form',
                        component: () => import('@/pages/notes/EditNote.vue'),
                    },
                    {
                        path: ':id/absences',
                        component: () => import('@/pages/absences/AbsencesIndex.vue'),
                    },
                    {
                        path: ':id/absences/qr',
                        component: () => import('@/pages/absences/AbsencesQR.vue'),
                    },
                ],
            },

            // Cash Flows
            {
                path: 'cash-flows',
                meta: { title: 'Arus Kas' },
                children: [
                    {
                        component: () => import('../pages/cash-flows/IndexPage.vue'),
                        path: '',
                    },
                ],
            },

            // Settings
            {
                path: 'settings',
                meta: { title: 'Pengaturan' },
                children: [
                    {
                        path: 'addresses',
                        component: () => import('../pages/address/IndexAlamat.vue'),
                        meta: { title: 'Pengaturan: Alamat' },
                    },
                    {
                        path: 'lists',
                        component: () => import('../pages/lists/ListsIndex.vue'),
                        meta: { title: 'Pengaturan: List' },
                        children: [
                            {
                                path: ':listKey',
                                component: () => import('../pages/lists/ListsByKey.vue'),
                            },
                        ],
                    },
                    {
                        path: 'users',
                        component: () => import('../pages/users/UserPage.vue'),
                        meta: { title: 'Pengaturan: Pengguna' },
                    },
                    {
                        path: 'users/:id',
                        component: () => import('../pages/users/UserId.vue'),
                        meta: { title: 'Pengaturan: Pengguna' },
                    },
                ],
            },

            // Profile
            {
                path: 'profile',
                meta: { title: 'Profil Saya' },
                component: () => import('../pages/profile/ProfileUser.vue'),
            },
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('@/pages/ErrorNotFound.vue'),
    },
];
