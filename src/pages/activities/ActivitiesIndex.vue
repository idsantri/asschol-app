<template>
    <CardPage>
        <CardHeader
            :title="titlePage"
            @on-reload="loadData"
            :show-add="true"
            @on-add="dialog = true"
        />

        <q-card-section class="q-pa-sm" style="max-width: 1024px">
            <QTable
                :rows="filteredActivities"
                :columns="columns"
                flat
                bordered
                :loading="loading"
                @row-click="
                    (evt, row, index) =>
                        $router.push({
                            path: `/activities/${row.id}`,
                        })
                "
                :filter="filterText"
            >
                <template v-slot:top>
                    <div
                        class="tw:gap-y-2 tw:gap-x-8 tw:grid tw:grid-cols-1 tw:w-full tw:sm:flex tw:sm:items-center tw:sm:justify-between"
                    >
                        <InputSelectArray
                            v-model="filterKelompok"
                            url="kelompok-koordinasi"
                            label="Pilih Kelompok"
                            class="tw:flex-1"
                        />
                        <q-input
                            class="tw:flex-1"
                            borderless
                            dense
                            debounce="300"
                            v-model="filterText"
                            placeholder="Cari"
                            outlined
                            clearable
                        >
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </div>
                </template>
            </QTable>
        </q-card-section>
        <QDialog v-model="dialog">
            <ActivityForm
                @success-create="onCreate"
                :dataInputs="{
                    kelompok: auth.getKelompok,
                }"
            />
        </QDialog>
    </CardPage>
</template>
<script setup>
import ActivityForm from '@/components/forms/ActivityForm.vue';
import InputSelectArray from '@/components/forms/inputs/InputSelectArray.vue';
import Activity from '@/models/Activity';
import { useAuthStore } from '@/stores/authStore';
import { formatDate } from '@/utils/date-operation';
import { toProperCase } from '@/utils/string';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQueryState } from 'vue-url-state';

const auth = useAuthStore();

const activities = ref([]);
const loading = ref(false);
const dialog = ref(false);
const qKelompok = useQueryState('kelompok', '');
const router = useRouter();
const filterKelompok = ref('');
const filterText = ref('');

const titlePage = computed(() => {
    const baseTitle = 'Data Kegiatan';
    if (qKelompok.value) {
        return `${baseTitle} — ${toProperCase(qKelompok.value)}`;
    }
    return baseTitle;
});

const filteredActivities = computed(() =>
    filterKelompok.value
        ? activities.value.filter(
              (a) => a.kelompok.toLowerCase() == filterKelompok.value.toLowerCase(),
          )
        : activities.value,
);

watch(filterKelompok, async (newVal, _oldVal) => {
    qKelompok.value = newVal;
});

async function loadData() {
    try {
        loading.value = true;
        const data = await Activity.getAll();
        activities.value = data.activities;
    } catch (error) {
        console.log('error get activities ', error);
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await loadData();
});

const onCreate = (newActivity) => {
    dialog.value = false;
    router.push({
        path: `/activities/${newActivity.id}`,
        // query: { scope: qKelompok.value },
    });
};

const columns = [
    {
        name: 'tahun_bulan',
        label: 'Tahun Bulan',
        align: 'left',
        field: 'tahun_bulan',
        sortable: true,
        // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
    },
    {
        name: 'tgl_m',
        label: 'Tanggal (M)',
        align: 'left',
        field: 'tgl_m',
        format: (val) => formatDate(val, 'cccc, dd MMMM yyyy'),
        sortable: true,
    },
    {
        name: 'nama',
        label: 'Nama Kegiatan',
        align: 'left',
        field: 'nama',
        sortable: true,
    },
    {
        name: 'kelompok',
        label: 'Kelompok',
        align: 'left',
        field: 'kelompok',
        sortable: true,
    },
];
</script>
