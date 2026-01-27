<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Input Desa/Kelurahan" :is-new="isNew" />
            <FormLoading v-if="loading" />
            <q-card-section>
                <q-input
                    v-model="inputs.kecamatan_id"
                    name="kecamatan_id"
                    dense
                    class="q-my-sm"
                    outlined
                    required
                    label="Kode Kecamatan/Distrik"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                    readonly=""
                />
                <q-input
                    v-model="inputs.id"
                    name="id"
                    dense
                    class="q-my-sm"
                    outlined
                    required
                    label="Kode Desa/Kelurahan"
                    :rules="[
                        (val) => !!val || 'Harus diisi!',
                        (val) => /^[a-zA-Z0-9]+$/.test(val) || 'Harus berisi huruf atau angka!',
                    ]"
                    ref="firstInput"
                />
                <q-input
                    v-model="inputs.desa"
                    name="desa"
                    dense
                    class="q-my-sm"
                    outlined
                    required
                    label="Nama Desa/Kelurahan"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
            </q-card-section>
            <FormActions :btn-delete="!isNew" @on-delete="onDelete" />
        </q-form>
    </q-card>
</template>
<script setup>
import { nextTick, onMounted, ref, useTemplateRef } from 'vue';
import { Desa } from '@/models/Address';
import { notifyConfirm } from '@/utils/notify';
import FormActions from './parts/FormActions.vue';
import FormHeader from './parts/FormHeader.vue';

const props = defineProps({
    data: { type: Object, required: false, default: () => {} },
});
const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const inputs = ref({ ...props.data });
const isNew = !props.data?.id;
const firstInput = useTemplateRef('firstInput');
const loading = ref(false);

onMounted(async () => {
    await nextTick();
    if (firstInput.value) firstInput.value.focus();
});

const onSubmit = async (e) => {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        loading.value = true;
        let response = null;
        if (isNew) {
            response = await Desa.create(data);
            emit('successCreate', response?.desa);
        } else {
            response = await Desa.update(props.data.id, data);
            emit('successUpdate', response?.desa);
        }
        emit('successSubmit', response?.desa);
    } catch (error) {
        console.log('error status ', error);
    } finally {
        loading.value = false;
    }
};

const onDelete = async () => {
    const isConfirmed = await notifyConfirm('Hapus data ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await Desa.remove(props.data.id);
        emit('successDelete', props.data.id);
    } catch (error) {
        console.log('error delete status ', error);
    } finally {
        loading.value = false;
    }
};
</script>
