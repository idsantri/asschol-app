<template>
    <QCard flat bordered>
        <QCardSection class="q-pa-sm bg-orange-2"> Formulir User </QCardSection>
        <q-card-section class="q-pa-sm">
            <form @submit.prevent="onSubmit">
                <q-input
                    v-model="inputs.email"
                    class="q-my-sm"
                    label="Email"
                    outlined
                    dense
                    type="email"
                />
                <q-input
                    v-model="inputs.username"
                    class="q-my-sm"
                    label="Username"
                    outlined
                    dense
                    type="text"
                />

                <div class="flex items-center justify-between">
                    <div class="q-pl-sm">Anda bisa login dengan username atau email</div>
                    <QBtn label="Simpan" no-caps color="orange" type="submit" />
                </div>
            </form>
        </q-card-section>
    </QCard>
</template>
<script setup>
import User from '@/models/User';
import { ref } from 'vue';

const props = defineProps({
    user: { type: Object },
});

const inputs = ref({ ...props.user });
const emit = defineEmits(['loading', 'success']);
async function onSubmit() {
    const data = JSON.parse(JSON.stringify(inputs.value));

    try {
        emit('loading', true);
        const response = await User.updateMyProfile(data);
        emit('success', response?.user);
    } catch (error) {
        console.log('error update password ', error);
    } finally {
        emit('loading', false);
    }
}
</script>
