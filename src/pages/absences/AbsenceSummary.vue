<template>
    <QCard class="" bordered flat>
        <QCardActions class="">
            <q-btn
                icon="sync"
                no-caps
                @click="loadData"
                dense
                flat
                class="q-mr-xs"
                title="Muat ulang"
            />
            <div>Rekap Absensi</div>
            <QSpace />
            <div class="tw:flex tw:gap-2">
                <QBtn
                    :to="{
                        path: `/activities/${activity.id}/absences/qr`,
                        // query: { scope: query.scope },
                    }"
                    :label="$q.screen.lt.sm ? 'Scan' : 'Scan QR Code'"
                    color="orange-10"
                    no-caps
                    outline=""
                    class="q-px-sm text-orange-1"
                    icon="sym_o_qr_code_scanner"
                    dense
                />
                <QBtn
                    :to="{
                        path: `/activities/${activity.id}/absences`,
                        // query: { scope: query.scope },
                    }"
                    :label="$q.screen.lt.sm ? 'Detail' : 'Detail Absensi'"
                    color="orange-10"
                    no-caps
                    outline=""
                    class="q-px-sm text-orange-1"
                    icon="sym_o_list"
                    dense
                />
            </div>
        </QCardActions>
        <QMarkupTable class="">
            <LoadingAbsolute v-if="loading" />
            <thead class="bg-brown-1">
                <tr>
                    <th class="text-left">Kelompok</th>
                    <th>Total (Aktif)</th>
                    <th>Hadir</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="report?.length > 0">
                    <tr v-for="item in report" :key="item.kelompok">
                        <td>{{ item.kelompok }}</td>
                        <td class="text-center">{{ item.jumlah }}</td>
                        <td class="text-center">{{ item.hadir }}</td>
                        <td class="text-center">
                            {{
                                String(((item.hadir / item.jumlah) * 100).toFixed(2)).padStart(
                                    5,
                                    '0',
                                )
                            }}%
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="4" class="text-center q-pa-lg">
                            <div class="q-my-md">Belum ada data untuk ditampilkan</div>
                            <div class="q-my-md">
                                <QBtn
                                    icon="assignment_add"
                                    label="Buat Absen"
                                    outline
                                    no-caps
                                    glossy
                                    @click="createAbsence"
                                />
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot class="bg-orange-2">
                <tr>
                    <td>
                        <QBtn
                            icon="sym_o_delete_forever"
                            label="Reset"
                            color="negative"
                            no-caps
                            @click="resetAbsence"
                            :disable="!report.length"
                            dense
                            class="q-px-sm"
                        />
                    </td>
                    <td class="text-center">{{ sumActive }}</td>
                    <td class="text-center">{{ sumHadir }}</td>
                    <td class="text-center">
                        {{ String(((sumHadir / sumActive) * 100).toFixed(2)).padStart(5, '0') }}%
                    </td>
                </tr>
            </tfoot>
        </QMarkupTable>
    </QCard>
    <!-- <pre>{{ report }}</pre> -->
</template>
<script setup>
import LoadingAbsolute from '@/components/LoadingAbsolute.vue';
import Absence from '@/models/Absence';
import { notifyConfirm } from '@/utils/notify';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
    activity: { required: true },
});

const loading = ref(false);
const report = ref([]);

onMounted(async () => {
    if (props.activity.id) {
        await loadData();
    }
});

watch(
    () => props.activity,
    async (newVal) => {
        if (newVal.id) {
            await loadData();
        }
    },
    { immediate: true },
);

const sumActive = computed(() => {
    return report.value.reduce((accumulator, r) => {
        return accumulator + parseInt(r.jumlah);
    }, 0);
});
const sumHadir = computed(() => {
    return report.value.reduce((accumulator, r) => {
        return accumulator + parseInt(r.hadir);
    }, 0);
});

// load absence (summary/report)
async function loadData() {
    try {
        loading.value = true;
        const res = await Absence.getSummary(props.activity.id);
        report.value = res.absence_summaries;
    } catch (e) {
        console.log('error report absence', e);
    } finally {
        loading.value = false;
    }
}

async function createAbsence() {
    try {
        loading.value = true;
        const res = await Absence.createByActivity(props.activity.id);
        report.value = res.absence_summaries;
    } catch (e) {
        console.log('error report absence', e);
    } finally {
        loading.value = false;
    }
}

async function resetAbsence() {
    const isConfirmed = await notifyConfirm('Hapus data absensi untuk kegiatan ini?', true);
    if (!isConfirmed) return;

    try {
        loading.value = true;
        await Absence.removeByActivity(props.activity.id);
        report.value = [];
    } catch (error) {
        console.log('error on reset absence ', error);
    } finally {
        loading.value = false;
    }
}
</script>
<style scoped>
td {
    white-space: normal;
    word-wrap: break-word;
    padding: 4px 8px;
}
</style>
