<template>
    <q-card class="full-width" style="max-width: 425px">
        <q-form @submit.prevent="onSubmit">
            <FormHeader title="Arus Kas" :is-new="!id" />
            <LoadingAbsolute v-if="loading" />

            <q-card-section class="q-pa-sm">
                <InputSelectArray
                    v-model="inputs.account"
                    url="account-name"
                    label="Rekening *"
                    class="q-my-sm"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-input
                    dense
                    outlined
                    label="Keterangan *"
                    class="q-my-sm"
                    v-model="inputs.description"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-card bordered flat class="q-px-sm q-my-sm bg-transparent flex items-center">
                    <div class="q-mr-md text-caption">Tipe</div>
                    <q-toggle
                        v-model="inputs.flag"
                        color="orange"
                        :true-value="'in'"
                        :false-value="'out'"
                        :label="inputs.flag == 'in' ? 'Pemasukan' : 'Pengeluaran'"
                    />
                </q-card>
                <InputCurrency
                    dense
                    class="q-my-sm"
                    outlined
                    v-model="inputs.amount"
                    required
                    label="Nominal"
                    :rules="[(val) => !!val || 'Harus diisi!']"
                />
                <q-input
                    dense
                    class="q-my-sm"
                    outlined
                    label="Catatan"
                    v-model="inputs.note"
                    autogrow=""
                />
            </q-card-section>
            <FormActions :btn-delete="!!id" @on-delete="onDelete" />
        </q-form>
    </q-card>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import LoadingAbsolute from '../LoadingAbsolute.vue';
import InputSelectArray from './inputs/InputSelectArray.vue';
import { notifyConfirm } from '@/utils/notify';
import FormHeader from './parts/FormHeader.vue';
import FormActions from './parts/FormActions.vue';
import CashFlow from '@/models/CashFlow';
import InputCurrency from './inputs/InputCurrency.vue';

const props = defineProps({
    dataInputs: { type: Object, required: true },
});
const emit = defineEmits(['successDelete', 'successSubmit', 'successUpdate', 'successCreate']);

const inputs = ref({ flag: 'in', ...props.dataInputs });
const loading = ref(false);
let btnClose = null;
const id = props.dataInputs?.id;

onMounted(async () => {
    btnClose = document.getElementById('btn-close-form');
});

const onSubmit = async () => {
    const data = JSON.parse(JSON.stringify(inputs.value));

    try {
        loading.value = true;
        let response = null;
        if (!id) {
            response = await CashFlow.create(data);
            emit('successCreate', response?.cash_flow);
        } else {
            response = await CashFlow.update(id, data);
            emit('successUpdate', response?.cash_flow);
        }
        emit('successSubmit', response?.cash_flow);
        btnClose.click();
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
        await CashFlow.remove(id);
        btnClose.click();
        emit('successDelete', id);
    } catch (error) {
        console.log('error delete status ', error);
    } finally {
        loading.value = false;
    }
};
</script>
