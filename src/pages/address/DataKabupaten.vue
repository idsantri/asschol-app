<template lang="">
    <q-card>
        <q-card-section class="q-pa-sm bg-orange-8 text-orange-1 text-subtitle1 flex flex-center">
            Kabupaten/Kota
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
            <AlamatKabupatenForm
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
import AlamatKabupatenForm from '@/components/forms/AlamatKabupatenForm.vue';
import Address from '@/models/Address';
import { useAddressStore } from '@/stores/addressStore';

const props = defineProps({
    provinsi_id: { type: String, required: true, default: '' },
});

const rows = ref([]);
const loading = ref(false);
const alamat = ref({});
const crudShow = ref(false);
const state = useAddressStore();

async function fetchData() {
    crudShow.value = false;
    rows.value = [];
    const { provinsi_id } = props;
    if (!provinsi_id) return;
    try {
        loading.value = true;
        const data = await Address.Kabupaten.getAll({ provinsi_id });
        // console.log('🚀 ~ fetchData ~ data:', data);
        if (data && data.kabupaten) {
            state.setKabupaten(data.kabupaten, { provinsi_id });
            rows.value = state.getKabupaten({ provinsi_id });
        }
    } catch (_err) {
        // console.error(_err);
        console.log('error get kabupaten');
    } finally {
        loading.value = false;
    }
}

async function checkData() {
    rows.value = [];
    const { provinsi_id } = props;
    if (!provinsi_id) return;

    const kabupaten = state.getKabupaten({ provinsi_id });
    if (kabupaten?.length > 0) {
        rows.value = kabupaten;
    } else {
        fetchData();
    }
}
function onAdd() {
    const { provinsi_id } = props;
    if (!provinsi_id) {
        return notifyWarning('Pilih provinsi terlebih dahulu!');
    }
    alamat.value = { provinsi_id };
    crudShow.value = true;
}

function onEdit(v) {
    alamat.value = v;
    crudShow.value = true;
}

watch(
    () => props.provinsi_id,
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
        format: (val) => `${val.replace(/(\w{2})(\w{2})/, '$1.$2')}`,
    },
    {
        name: 'kabupaten',
        align: 'left',
        label: 'Kabupaten',
        field: 'kabupaten',
        sortable: true,
    },
];
</script>
<style lang=""></style>
