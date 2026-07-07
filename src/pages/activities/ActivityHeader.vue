<template>
    <div class="text-center">
        <div>
            <strong> {{ activity.nama }}</strong>
            <br />
            Kelompok {{ activity.kelompok }}<br />
            <small>
                {{ formatDate(activity.tgl_m, 'cccc, dd MMMM yyyy') }} |
                {{ bacaHijri(activity.tgl_h) }}
            </small>
        </div>
        <div v-if="activity.locked" class="q-mt-sm q-pa-sm text-center text-negative bg-orange-3">
            Kegiatan ini sudah dikunci, <br />tidak bisa mengubah data absensi!
        </div>
    </div>
</template>
<script>
import { formatDate } from '@/utils/date-operation';
import { bacaHijri } from '@/utils/hijri';

export default {
    props: {
        activity: {
            type: Object,
            required: true,
        },
    },
    setup() {
        return {
            formatDate,
            bacaHijri,
        };
    },
};
</script>
<style lang=""></style>
