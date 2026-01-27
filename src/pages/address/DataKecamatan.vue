<template lang="">
    <q-card>
        <q-card-section class="q-pa-sm bg-orange-8 text-orange-1 text-subtitle1 flex flex-center">
            Kecamatan/Distrik
            <q-space />
            <q-btn @click="fetchData" icon="sync" round dense flat class="q-mr-md" />
            <q-btn @click="onAdd" icon="add" round dense flat />
        </q-card-section>
        <TableAlamat
            :rows="rows"
            :columns="columns"
            :loading="loading"
            @on-select="(v) => $emit('onSelect', v)"
            @on-edit="onEdit"
        />
        <q-dialog v-model="crudShow">
            <AlamatKecamatanForm
                :data="alamat"
                @success-delete="fetchData"
                @success-submit="fetchData"
            />
        </q-dialog>
    </q-card>
</template>
<script setup>
import { ref, watch } from 'vue';
import { notifyWarning } from '@/utils/notify';
import TableAlamat from './TableAlamat.vue';
import AlamatKecamatanForm from '@/components/forms/AlamatKecamatanForm.vue';
import Address from '@/models/Address';
import { useAddressStore } from '@/stores/addressStore';

const props = defineProps({
    provinsi_id: { type: String, required: true, default: '' },
    kabupaten_id: { type: String, required: true, default: '' },
});

const rows = ref([]);
const loading = ref(false);
const alamat = ref({});
const crudShow = ref(false);
const state = useAddressStore();

async function fetchData() {
    crudShow.value = false;
    rows.value = [];
    const { provinsi_id, kabupaten_id } = props;
    if (!kabupaten_id || !provinsi_id) return;

    try {
        loading.value = true;
        const data = await Address.Kecamatan.getAll({ kabupaten_id });
        if (data && data.kecamatan) {
            state.setKecamatan(data.kecamatan, { provinsi_id, kabupaten_id });
            rows.value = state.getKecamatan({ provinsi_id, kabupaten_id });
        }
    } catch (_err) {
        // console.error(_err);
        console.log('error get kecamatan');
    } finally {
        loading.value = false;
    }
}

async function checkData() {
    rows.value = [];
    const { provinsi_id, kabupaten_id } = props;
    if (!kabupaten_id || !provinsi_id) return;

    const kecamatan = state.getKecamatan({ provinsi_id, kabupaten_id });
    if (kecamatan?.length > 0) {
        rows.value = kecamatan;
    } else {
        await fetchData();
    }
}

function onAdd() {
    const { kabupaten_id } = props;
    if (!kabupaten_id) {
        return notifyWarning('Pilih kabupaten terlebih dahulu!');
    }
    alamat.value = { kabupaten_id };
    crudShow.value = true;
}

function onEdit(v) {
    alamat.value = v;
    crudShow.value = true;
}

watch(
    () => props.kabupaten_id,
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
        format: (val) => `${val.replace(/(\w{2})(\w{2})(\w{2})/, '$1.$2.$3')}`,
    },
    {
        name: 'kecamatan',
        align: 'left',
        label: 'Kecamatan',
        field: 'kecamatan',
        sortable: true,
    },
];
</script>
<style lang=""></style>
