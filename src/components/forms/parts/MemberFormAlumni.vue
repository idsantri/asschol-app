<template>
    <q-card bordered flat class="q-px-sm q-my-sm bg-transparent flex items-center">
        <div class="q-mr-md text-caption">Keanggotaan</div>
        <q-toggle
            v-model="inputs.alumni"
            color="orange"
            :true-value="1"
            :false-value="0"
            :label="inputs.alumni ? 'Alumni' : 'Simpatisan'"
        />
    </q-card>

    <InputSelectArray
        v-model="inputs.kelompok"
        url="kelompok-koordinasi"
        label="Kelompok Koordinasi *"
        class="q-my-sm"
        hint="Pengelompokan koordinasi anggota"
    />

    <q-separator class="q-my-md" />
    <!-- MASUK PESANTREN -->
    <q-input
        dense
        class="q-my-sm"
        outlined
        label="ID Santri"
        v-model="inputs.santri_id"
        hint="ID Santri saat masuk pesantren"
        type="number"
        :disable="!inputs.alumni"
    />
    <q-input
        dense
        :hint="
            isValid(new Date(inputs.tgl_masuk_pesantren))
                ? formatDate(new Date(inputs.tgl_masuk_pesantren), 'cccc, dd MMMM yyyy') +
                  ' | ' +
                  bacaHijri(m2h(inputs.tgl_masuk_pesantren))
                : 'Tanggal masuk pesantren'
        "
        class="q-my-sm"
        outlined
        label="Tanggal Masuk (M)"
        v-model="inputs.tgl_masuk_pesantren"
        :disable="!inputs.alumni"
        type="date"
        @change="onChangeTglMasuk"
    />

    <q-input
        dense
        hint="Tahun masuk pesantren"
        class="q-my-sm"
        outlined
        label="Tahun Masuk (Masehi)"
        v-model="inputs.th_masuk_pesantren"
        :disable="!inputs.alumni"
        :rules="[(val) => !val || (val?.length == 4 && !isNaN(val)) || '4 digit angka!']"
        error-color="negative"
    />

    <!-- BERHENTI DARI PESANTREN -->

    <q-input
        dense
        :hint="
            isValid(new Date(inputs.tgl_bergabung))
                ? formatDate(new Date(inputs.tgl_bergabung), 'cccc, dd MMMM yyyy') +
                  ' | ' +
                  bacaHijri(m2h(inputs.tgl_bergabung))
                : 'Tanggal berhenti dari pesantren atau bergabung dengan alumni'
        "
        class="q-my-sm"
        outlined
        label="Tanggal Bergabung (M)"
        v-model="inputs.tgl_bergabung"
        type="date"
        @change="onChangeTglBergabung"
    />

    <q-input
        dense
        hint="Tahun berhenti dari pesantren atau bergabung dengan alumni"
        class="q-my-sm"
        outlined
        label="Tahun Bergabung (Masehi) *"
        v-model="inputs.th_bergabung"
        :rules="[(val) => (val?.length == 4 && !isNaN(val)) || 'Harus diisi! | 4 digit angka!']"
        error-color="negative"
    />
</template>

<script setup>
import { watch } from 'vue';
import InputSelectArray from '../inputs/InputSelectArray.vue';
import { isValid } from 'date-fns';
import { formatDate } from '@/utils/date-operation';
import { bacaHijri, m2h } from '@/utils/hijri';

const inputs = defineModel();

const backup = { ...inputs.value };
watch(
    () => inputs.value.alumni,
    (n, _o) => {
        if (!n) {
            inputs.value.santri_id = '';
            inputs.value.tgl_masuk_pesantren = '';
            inputs.value.th_masuk_pesantren = '';
        } else {
            inputs.value.santri_id = backup.santri_id;
            inputs.value.tgl_masuk_pesantren = backup.tgl_masuk_pesantren;
            inputs.value.th_masuk_pesantren = backup.th_masuk_pesantren;
        }
    },
);

// watch(
//     () => inputs.value.tgl_h,
//     (newValue, oldValue) => {
//         if (newValue !== oldValue) {
//             inputs.value.tgl_h = newValue.replace(/-/g, '');
//         }
//     },
// );

const onChangeTglMasuk = () => {
    if (isValid(new Date(inputs.value.tgl_masuk_pesantren))) {
        const year = new Date(inputs.value.tgl_masuk_pesantren).getFullYear();
        inputs.value.th_masuk_pesantren = year.toString();
    }
};
const onChangeTglBergabung = () => {
    if (isValid(new Date(inputs.value.tgl_bergabung))) {
        const year = new Date(inputs.value.tgl_bergabung).getFullYear();
        inputs.value.th_bergabung = year.toString();
    }
};
</script>
