<template lang="">
    <q-select
        dense
        hint=""
        class="q-my-sm"
        outlined
        :label="label"
        emit-value
        map-options
        v-model="model"
        :options="options"
        :loading="loading"
        behavior="menu"
        clearable
    >
        <template v-slot:after>
            <q-btn-dropdown outline dropdown-icon="more_vert" class="q-px-sm" color="">
                <q-btn
                    no-caps
                    label="Reload"
                    flat
                    class="block full-width"
                    icon="sync"
                    @click="onFetch()"
                    v-close-popup
                />
                <q-separator />
                <q-btn
                    no-caps
                    label="Setting"
                    flat
                    icon="toc"
                    to="/settings/addresses"
                    v-close-popup
                    class="block full-width"
                />
            </q-btn-dropdown>
        </template>
    </q-select>
</template>
<script setup>
defineProps({
    options: { type: Array },
    loading: { type: Boolean },
    onFetch: { type: Function },
    label: { type: String, default: 'Alamat' },
});

const model = defineModel();
</script>
<style lang=""></style>
