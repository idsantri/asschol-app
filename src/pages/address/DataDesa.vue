<template lang="">
    <q-card>
        <q-card-section class="q-pa-sm bg-orange-8 text-orange-1 text-subtitle1 flex flex-center">
            Desa/Kelurahan
            <q-space />
            <q-btn @click="fetchData" icon="sync" round dense flat class="q-mr-md" />
            <q-btn @click="onAdd" icon="add" round dense flat />
        </q-card-section>
        <TableAlamat
            :rows="rows"
            :columns="columns"
            :loading="loading"
            @on-select="null"
            :no-check-box="true"
            @on-edit="onEdit"
        />
        <q-dialog v-model="crudShow">
            <AlamatDesaForm
                :data="alamat"
                @success-delete="fetchData"
                @success-submit="fetchData"
            />
        </q-dialog>
    </q-card>
</template>
<script setup>
import { ref, watch } from 'vue';
import TableAlamat from './TableAlamat.vue';
import AlamatDesaForm from '@/components/forms/AlamatDesaForm.vue';
import Address from '@/models/Address';
import { useAddressStore } from '@/stores/addressStore';
import { notifyWarning } from '@/utils/notify';

const props = defineProps({
    provinsi_id: { type: String, required: true, default: '' },
    kabupaten_id: { type: String, required: true, default: '' },
    kecamatan_id: { type: String, required: true, default: '' },
});

const rows = ref([]);
const loading = ref(false);
const alamat = ref({});
const crudShow = ref(false);
const state = useAddressStore();

async function fetchData() {
    crudShow.value = false;
    rows.value = [];
    const { provinsi_id, kabupaten_id, kecamatan_id } = props;
    if (!kabupaten_id || !provinsi_id || !kecamatan_id) return;

    try {
        loading.value = true;
        const data = await Address.Desa.getAll({ kecamatan_id });
        if (data && data.desa) {
            state.setDesa(data.desa, {
                provinsi_id,
                kabupaten_id,
                kecamatan_id,
            });
            rows.value = state.getDesa({
                provinsi_id,
                kabupaten_id,
                kecamatan_id,
            });
        }
    } catch (_err) {
        // console.error(_err);
        console.log('error get desa');
    } finally {
        loading.value = false;
    }
}

async function checkData() {
    rows.value = [];
    const { provinsi_id, kabupaten_id, kecamatan_id } = props;
    if (!kabupaten_id || !provinsi_id || !kecamatan_id) return;

    const desa = state.getDesa({
        provinsi_id,
        kabupaten_id,
        kecamatan_id,
    });
    if (desa?.length > 0) {
        rows.value = desa;
    } else {
        await fetchData();
    }
}

function onAdd() {
    const { kecamatan_id } = props;
    if (!kecamatan_id) {
        return notifyWarning('Pilih kecamatan terlebih dahulu!');
    }
    alamat.value = { kecamatan_id };
    crudShow.value = true;
}

function onEdit(v) {
    alamat.value = v;
    crudShow.value = true;
}

watch(
    () => props.kecamatan_id,
    async (_v) => {
        // console.log('w', v);
        await checkData();
    },
);

const columns = [
    {
        name: 'id',
        label: 'ID',
        align: 'left',
        field: 'id',
        sortable: true,
        format: (val) => `${val.replace(/(\w{2})(\w{2})(\w{2})(\w{4})/, '$1.$2.$3.$4')}`,
    },
    {
        name: 'desa',
        align: 'left',
        label: 'Desa',
        field: 'desa',
        sortable: true,
    },
];
</script>
<style lang=""></style>
