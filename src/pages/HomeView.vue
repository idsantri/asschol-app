<script setup>
const env = import.meta.env;
</script>

<template>
    <div class="">
        <div class="text-center tw:py-8">
            <q-avatar round color="" size="150px">
                <img alt="logo" src="/logo.svg" />
            </q-avatar>
        </div>
        <div class="tw:text-center tw:p-2 tw:space-y-2">
            <div class="tw:text-lg tw:font-light">Selamat Datang di</div>
            <div class="tw:text-2xl tw:font-semibold text-orange-10">
                <span class="tw:font-light">Aplikasi</span> {{ env.VITE_APP_LONG_NAME }}
            </div>
            <div
                class="tw:text-lg tw:font-light tw:tracking-widest"
                style="font-variant: small-caps"
            >
                {{ env.VITE_APP_DESCRIPTION }}
            </div>
        </div>
        <!-- <pre>{{ env }}</pre> -->
    </div>
</template>
